import { createCategory } from '@/actions/management'
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
            <form action={createCategory} className="space-y-6">
              {/* Category Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Groceries, Salary, Entertainment"
                  required
                />
              </div>

              {/* Category Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Category Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="color">Color (Optional)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    className="w-20 h-10"
                    defaultValue="#3b82f6"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mt-2">
                      Choose a color to help identify this category
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  Add Category
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
              </div>
            </form>
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