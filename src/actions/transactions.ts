'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import type {
  InsertTransaction,
  TransactionWithDetails,
  DashboardSummary,
} from '@/types/database'

export async function getDashboardData(): Promise<DashboardSummary> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get all transactions with details
  const { data: transactions } = await supabase
    .from('transactions')
    .select(
      `
      *,
      balance:balances(*),
      category:categories(*)
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

  // Get all liabilities
  const { data: liabilities } = await supabase
    .from('liabilities')
    .select('*')
    .eq('user_id', user.id)

  // Calculate totals
  const totalBalance =
    balances?.reduce((sum, balance) => sum + balance.balance, 0) || 0
  const totalLiabilities =
    liabilities?.reduce((sum, liability) => sum + liability.amount, 0) || 0

  // Calculate income and expenses from transactions
  const { data: incomeTransactions } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', user.id)
    .eq('type', 'income')

  const { data: expenseTransactions } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', user.id)
    .eq('type', 'expense')

  const totalIncome =
    incomeTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0
  const totalExpenses =
    expenseTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0

  // Get first 3 balances for dashboard display
  const { data: firstThreeBalances } = await supabase
    .from('balances')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  // Get monthly data for charts (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  const startDate = sixMonthsAgo.toISOString().split('T')[0]

  const { data: monthlyTransactions } = await supabase
    .from('transactions')
    .select('amount, type, date')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .order('date', { ascending: true })

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

    if (monthlyData[monthKey]) {
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount
      } else {
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

  return {
    totalIncome,
    totalExpenses,
    totalBalance,
    totalLiabilities,
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
  const type = formData.get('type') as 'income' | 'expense'
  const date = formData.get('date') as string

  const transaction: InsertTransaction = {
    user_id: user.id,
    balance_id: balanceId,
    category_id: categoryId,
    amount,
    description: description || null,
    type,
    date: date || new Date().toISOString(),
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
    const newBalance =
      type === 'income' ? balance.balance + amount : balance.balance - amount

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
