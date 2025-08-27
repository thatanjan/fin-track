'use client'

import { createTransaction } from '@/actions/transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface Balance {
  id: string
  name: string
  balance: number
}

interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
}

interface NewTransactionFormProps {
  balances: Balance[]
  categories: Category[]
}

export default function NewTransactionForm({ balances, categories }: NewTransactionFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const incomeCategories = categories.filter(cat => cat.type === 'income')
  const expenseCategories = categories.filter(cat => cat.type === 'expense')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const formDataObj = new FormData(event.currentTarget)
    
    startTransition(async () => {
      try {
        await createTransaction(formDataObj)
        router.push('/')
      } catch (error) {
        console.error('Error creating transaction:', error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Transaction Type</Label>
        <Select name="type" required>
          <SelectTrigger>
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          type="text"
          placeholder="Enter transaction description"
        />
      </div>

      {/* Balance/Account */}
      <div className="space-y-2">
        <Label htmlFor="balance_id">Account</Label>
        <Select name="balance_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {balances.map((balance) => (
              <SelectItem key={balance.id} value={balance.id}>
                {balance.name} (${balance.balance.toFixed(2)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category_id">Category</Label>
        <Select name="category_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {incomeCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name} (Income)
              </SelectItem>
            ))}
            {expenseCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name} (Expense)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      {/* Submit Button */}
      <div className="flex space-x-4">
        <Button type="submit" className="flex-1" loading={isPending}>
          {isPending ? 'Adding Transaction...' : 'Add Transaction'}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}