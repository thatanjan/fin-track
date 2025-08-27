import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import NewCategoryForm from '@/features/categories/components/NewCategoryForm'
import Link from 'next/link'

export default function NewCategoryPage() {
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
              <h1 className="text-2xl font-bold text-gray-900">Add Category</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>New Category</CardTitle>
            <CardDescription>
              Add a new category to organize your income and expenses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewCategoryForm />
          </CardContent>
        </Card>

        {/* Common Categories Suggestion */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Suggested Categories</CardTitle>
            <CardDescription>
              Here are some common categories you might want to add:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-green-700 mb-2">Income Categories</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Salary</li>
                  <li>• Freelance</li>
                  <li>• Investment Returns</li>
                  <li>• Business Income</li>
                  <li>• Other Income</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-700 mb-2">Expense Categories</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Food & Dining</li>
                  <li>• Transportation</li>
                  <li>• Shopping</li>
                  <li>• Entertainment</li>
                  <li>• Bills & Utilities</li>
                  <li>• Healthcare</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}