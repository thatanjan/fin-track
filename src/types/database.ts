export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      balances: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'cash' | 'bank_account' | 'mobile_banking'
          balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'cash' | 'bank_account' | 'mobile_banking'
          balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'cash' | 'bank_account' | 'mobile_banking'
          balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'income' | 'expense'
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'income' | 'expense'
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'income' | 'expense'
          color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          balance_id: string
          category_id: string
          amount: number
          description: string | null
          type: 'income' | 'expense'
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance_id: string
          category_id: string
          amount: number
          description?: string | null
          type: 'income' | 'expense'
          date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance_id?: string
          category_id?: string
          amount?: number
          description?: string | null
          type?: 'income' | 'expense'
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      liabilities: {
        Row: {
          id: string
          user_id: string
          name: string
          amount: number
          description: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          amount: number
          description?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          amount?: number
          description?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type helpers
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Balance = Database['public']['Tables']['balances']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Liability = Database['public']['Tables']['liabilities']['Row']

export type InsertProfile = Database['public']['Tables']['profiles']['Insert']
export type InsertBalance = Database['public']['Tables']['balances']['Insert']
export type InsertCategory = Database['public']['Tables']['categories']['Insert']
export type InsertTransaction = Database['public']['Tables']['transactions']['Insert']
export type InsertLiability = Database['public']['Tables']['liabilities']['Insert']

export type UpdateProfile = Database['public']['Tables']['profiles']['Update']
export type UpdateBalance = Database['public']['Tables']['balances']['Update']
export type UpdateCategory = Database['public']['Tables']['categories']['Update']
export type UpdateTransaction = Database['public']['Tables']['transactions']['Update']
export type UpdateLiability = Database['public']['Tables']['liabilities']['Update']

// Extended types for joined data
export type TransactionWithDetails = Transaction & {
  balance: Balance
  category: Category
}

export type DashboardSummary = {
  totalIncome: number
  totalExpenses: number
  totalBalance: number
  totalLiabilities: number
  recentTransactions: TransactionWithDetails[]
}