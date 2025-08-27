import { createTransaction, getBalances, getCategories } from '@/actions/transactions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

export default async function NewTransactionPage() {
  const [balances, categories] = await Promise.all([
    getBalances(),
    getCategories(),
  ])

  const incomeCategories = categories.filter(cat => cat.type === 'income')
  const expenseCategories = categories.filter(cat => cat.type === 'expense')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <Link href="/">← Back</Link>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Add Transaction</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>New Transaction</CardTitle>
            <CardDescription>
              Add a new income or expense transaction to track your finances.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createTransaction} className="space-y-6">
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
                <Button type="submit" className="flex-1">
                  Add Transaction
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        {(balances.length === 0 || categories.length === 0) && (
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="font-medium text-orange-800">Setup Required</h3>
                <p className="text-sm text-orange-700">
                  {balances.length === 0 && "You need to add at least one account/balance before creating transactions. "}
                  {categories.length === 0 && "You need to add at least one category before creating transactions."}
                </p>
                <div className="flex space-x-4 mt-4">
                  {balances.length === 0 && (
                    <Button asChild size="sm">
                      <Link href="/balances/new">Add Account</Link>
                    </Button>
                  )}
                  {categories.length === 0 && (
                    <Button asChild size="sm">
                      <Link href="/categories/new">Add Category</Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}