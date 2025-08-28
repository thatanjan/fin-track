import { Database } from './database'

// Table row types
export type Balance = Database['public']['Tables']['balances']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type TransactionType =
  Database['public']['Tables']['transaction_type']['Row']

// Insert types
export type InsertBalance = Database['public']['Tables']['balances']['Insert']
export type InsertCategory =
  Database['public']['Tables']['categories']['Insert']
export type InsertTransaction =
  Database['public']['Tables']['transactions']['Insert']
export type InsertTransactionType =
  Database['public']['Tables']['transaction_type']['Insert']

// Update types
export type UpdateBalance = Database['public']['Tables']['balances']['Update']
export type UpdateCategory =
  Database['public']['Tables']['categories']['Update']
export type UpdateTransaction =
  Database['public']['Tables']['transactions']['Update']
export type UpdateTransactionType =
  Database['public']['Tables']['transaction_type']['Update']

// Extended types for joined data
export type TransactionWithDetails = Transaction & {
  balance: Balance
  category: Category
  transaction_type: TransactionType[]
}

export type DashboardSummary = {
  totalIncome: number
  totalExpenses: number
  totalBalance: number
  totalLiabilities: number
  recentTransactions: TransactionWithDetails[]
  balances: Balance[]
  totalBalances: number
  monthlyIncomeData: { month: string; amount: number }[]
  monthlyExpenseData: { month: string; amount: number }[]
}
