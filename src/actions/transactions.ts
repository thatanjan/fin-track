'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import type {
  InsertTransaction,
  TransactionWithDetails,
  DashboardSummary,
} from '@/types/app'

export async function getDashboardData(): Promise<DashboardSummary> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get all transactions with details (including transaction types)
  const { data: transactions } = await supabase
    .from('transactions')
    .select(
      `
      *,
      balance:balances(*),
      category:categories(*),
      transaction_type:transaction_type(*)
    `,
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Get all balances
  const { data: balances } = await supabase
    .from('balances')
    .select('*')
    .eq('user_id', user.id)

  // Calculate totals
  const totalBalance =
    balances?.reduce((sum, balance) => sum + (balance.balance || 0), 0) || 0

  // Get monthly data for charts (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  const startDate = sixMonthsAgo.toISOString().split('T')[0]

  const { data: monthlyTransactions } = await supabase
    .from('transactions')
    .select(
      `
      amount, 
      date,
      transaction_type:transaction_type(type)
    `,
    )
    .eq('user_id', user.id)
    .gte('date', startDate)
    .order('date', { ascending: true })

  // Calculate income and expenses from last 6 months only
  const { data: sixMonthIncomeTransactions } = await supabase
    .from('transactions')
    .select(
      `
      amount,
      transaction_type:transaction_type(type)
    `,
    )
    .eq('user_id', user.id)
    .gte('date', startDate)

  const { data: sixMonthExpenseTransactions } = await supabase
    .from('transactions')
    .select(
      `
      amount,
      transaction_type:transaction_type(type)
    `,
    )
    .eq('user_id', user.id)
    .gte('date', startDate)

  const totalIncomeSixMonths =
    sixMonthIncomeTransactions?.reduce((sum, t) => {
      return Array.isArray(t.transaction_type) &&
        t.transaction_type[0]?.type === 'income'
        ? sum + t.amount
        : sum
    }, 0) || 0

  const totalExpensesSixMonths =
    sixMonthExpenseTransactions?.reduce((sum, t) => {
      return Array.isArray(t.transaction_type) &&
        t.transaction_type[0]?.type === 'expense'
        ? sum + t.amount
        : sum
    }, 0) || 0

  // Process monthly data
  const monthlyData: Record<string, { income: number; expense: number }> = {}
  const months = []

  // Generate last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthKey = date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
    months.push(monthKey)
    monthlyData[monthKey] = { income: 0, expense: 0 }
  }

  // Aggregate transaction data by month
  monthlyTransactions?.forEach((transaction) => {
    const transactionDate = new Date(transaction.date)
    const monthKey = transactionDate.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })

    if (
      monthlyData[monthKey] &&
      Array.isArray(transaction.transaction_type) &&
      transaction.transaction_type[0]
    ) {
      if (transaction.transaction_type[0].type === 'income') {
        monthlyData[monthKey].income += transaction.amount
      } else if (transaction.transaction_type[0].type === 'expense') {
        monthlyData[monthKey].expense += transaction.amount
      }
    }
  })

  const monthlyIncomeData = months.map((month) => ({
    month,
    amount: monthlyData[month].income,
  }))

  const monthlyExpenseData = months.map((month) => ({
    month,
    amount: monthlyData[month].expense,
  }))

  // Get first 3 balances for dashboard display
  const { data: firstThreeBalances } = await supabase
    .from('balances')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  return {
    totalIncome: totalIncomeSixMonths,
    totalExpenses: totalExpensesSixMonths,
    totalBalance,
    totalLiabilities: 0, // No liabilities table anymore
    recentTransactions: (transactions as TransactionWithDetails[]) || [],
    balances: firstThreeBalances || [],
    totalBalances: balances?.length || 0,
    monthlyIncomeData,
    monthlyExpenseData,
  }
}

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const amount = parseFloat(formData.get('amount') as string)
  const description = formData.get('description') as string
  const balanceId = formData.get('balance_id') as string
  const categoryId = formData.get('category_id') as string
  const typeString = formData.get('type') as 'income' | 'expense'
  const date = formData.get('date') as string

  // Get the transaction type ID from the transaction_type table
  const { data: transactionType } = await supabase
    .from('transaction_type')
    .select('id')
    .eq('type', typeString)
    .single()

  if (!transactionType) {
    throw new Error(`Transaction type '${typeString}' not found`)
  }

  const transaction: InsertTransaction = {
    user_id: user.id,
    balance_id: balanceId,
    category_id: categoryId,
    amount,
    description: description || null,
    type: transactionType.id.toString(), // Convert to string as per the type definition
    date: date || new Date().toISOString().split('T')[0],
  }

  const { error } = await supabase.from('transactions').insert(transaction)

  if (error) {
    console.error('Error creating transaction:', error)
    throw new Error('Failed to create transaction')
  }

  // Update balance based on transaction type
  const { data: balance } = await supabase
    .from('balances')
    .select('balance')
    .eq('id', balanceId)
    .single()

  if (balance) {
    const currentBalance = balance.balance || 0
    const newBalance =
      typeString === 'income'
        ? currentBalance + amount
        : currentBalance - amount

    await supabase
      .from('balances')
      .update({ balance: newBalance })
      .eq('id', balanceId)
  }

  revalidatePath('/')
  redirect('/')
}

export async function getBalances() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: balances } = await supabase
    .from('balances')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return balances || []
}

export async function getCategories() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  return categories || []
}
