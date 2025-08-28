import { getDashboardData } from '@/actions/transactions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { IncomeChart } from '@/components/charts/IncomeChart'
import { ExpenseChart } from '@/components/charts/ExpenseChart'
import SignOutButton from '@/features/auth/components/SignOutButton'
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

export default async function Home() {
  const dashboardData = await getDashboardData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">FinTrack</h1>
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link href="/transactions/new">Add Transaction</Link>
              </Button>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground">💰</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(dashboardData.totalBalance)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground">📈</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(dashboardData.totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground">📉</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(dashboardData.totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Liabilities</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">⚠️</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(dashboardData.totalLiabilities)}
              </div>
              <p className="text-xs text-muted-foreground">Outstanding debt</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="group cursor-pointer transition-all hover:shadow-md border-dashed border-2 hover:border-solid">
            <Link href="/transactions/new" className="block p-6">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-4 p-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <div className="text-2xl">💰</div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Add Transaction</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Record new income or expense
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all hover:shadow-md border-dashed border-2 hover:border-solid">
            <Link href="/balances/new" className="block p-6">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-4 p-0">
                <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-secondary/70 transition-colors">
                  <div className="text-2xl">🏦</div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Add Account</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create new balance account
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all hover:shadow-md border-dashed border-2 hover:border-solid">
            <Link href="/categories/new" className="block p-6">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-4 p-0">
                <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center group-hover:bg-accent/70 transition-colors">
                  <div className="text-2xl">📁</div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Add Category</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Organize transactions
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Monthly Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <IncomeChart data={dashboardData.monthlyIncomeData} />
          <ExpenseChart data={dashboardData.monthlyExpenseData} />
        </div>

        {/* Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Balances */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Account Balances</CardTitle>
                <CardDescription>Your active accounts</CardDescription>
              </div>
              {dashboardData.totalBalances > 3 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/balances">
                    Show All ({dashboardData.totalBalances})
                  </Link>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {dashboardData.balances.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.balances.map((balance) => (
                    <div
                      key={balance.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{balance.name}</h4>
                        <p className="text-sm text-gray-500">
                          Created {formatDate(balance.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(balance.balance)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No accounts yet</p>
                  <Button asChild>
                    <Link href="/balances/new">Add Your First Account</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your latest financial activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {transaction.description || 'Transaction'}
                          </h4>
                          <span
                            className={`text-lg font-bold ${
                              transaction.type === 'income'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span>{transaction.category.name}</span>
                          <span className="mx-2">•</span>
                          <span>{transaction.balance.name}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No transactions yet</p>
                  <Button asChild>
                    <Link href="/transactions/new">
                      Add Your First Transaction
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
