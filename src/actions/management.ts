'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import type { InsertBalance, InsertCategory } from '@/types/app'

export async function createBalance(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const balance = parseFloat(formData.get('balance') as string) || 0

  const newBalance: InsertBalance = {
    user_id: user.id,
    name,
    balance,
  }

  const { error } = await supabase.from('balances').insert(newBalance)

  if (error) {
    console.error('Error creating balance:', error)
    throw new Error('Failed to create balance')
  }

  revalidatePath('/')
  redirect('/')
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const type = formData.get('type') as 'income' | 'expense'
  const color = formData.get('color') as string

  const newCategory: InsertCategory = {
    user_id: user.id,
    name,
    type,
    color: color || null,
  }

  const { error } = await supabase.from('categories').insert(newCategory)

  if (error) {
    console.error('Error creating category:', error)
    throw new Error('Failed to create category')
  }

  revalidatePath('/')
  redirect('/')
}

export async function deleteBalance(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const balanceId = formData.get('balance_id') as string

  // Check if balance has transactions
  const { count } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('balance_id', balanceId)

  if (count && count > 0) {
    throw new Error('Cannot delete balance with existing transactions')
  }

  const { error } = await supabase
    .from('balances')
    .delete()
    .eq('id', balanceId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting balance:', error)
    throw new Error('Failed to delete balance')
  }

  revalidatePath('/')
}

export async function deleteCategory(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const categoryId = formData.get('category_id') as string

  // Check if category has transactions
  const { count } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryId)

  if (count && count > 0) {
    throw new Error('Cannot delete category with existing transactions')
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting category:', error)
    throw new Error('Failed to delete category')
  }

  revalidatePath('/')
}
