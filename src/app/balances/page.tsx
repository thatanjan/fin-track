import { getBalances } from '@/actions/transactions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function BalancesPage() {
  const balances = await getBalances()
  const totalBalance = balances.reduce(
    (sum, balance) => sum + balance.balance,
    0,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/">← Back to Dashboard</Link>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Account Balances
              </h1>
            </div>
            <Button asChild>
              <Link href="/balances/new">Add New Account</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Total Balance Across All Accounts
              </CardTitle>
              <CardDescription>
                Sum of all your account balances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(totalBalance)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Across {balances.length} account
                {balances.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Account Balances Grid */}
        {balances.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {balances.map((balance) => (
              <Card
                key={balance.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{balance.name}</CardTitle>
                  <CardDescription>
                    Created {formatDate(balance.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    {formatCurrency(balance.balance)}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No accounts yet
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first account to track your finances
            </p>
            <Button asChild>
              <Link href="/balances/new">Add Your First Account</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
