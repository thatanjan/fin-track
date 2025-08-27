import { getBalances, getCategories } from '@/actions/transactions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import NewTransactionForm from '@/features/transactions/components/NewTransactionForm'
import Link from 'next/link'

export default async function NewTransactionPage() {
  const [balances, categories] = await Promise.all([
    getBalances(),
    getCategories(),
  ])

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
            <NewTransactionForm balances={balances} categories={categories} />
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