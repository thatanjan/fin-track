import { createBalance } from '@/actions/management'
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

export default function NewBalancePage() {
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
              <h1 className="text-2xl font-bold text-gray-900">Add Account</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>New Account</CardTitle>
            <CardDescription>
              Add a new account or balance where your money is stored.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createBalance} className="space-y-6">
              {/* Account Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Account Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., My Checking Account, Cash Wallet"
                  required
                />
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Account Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_account">Bank Account</SelectItem>
                    <SelectItem value="mobile_banking">Mobile Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Initial Balance */}
              <div className="space-y-2">
                <Label htmlFor="balance">Initial Balance ($)</Label>
                <Input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  defaultValue="0"
                />
                <p className="text-sm text-gray-500">
                  Enter the current balance in this account
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  Add Account
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}