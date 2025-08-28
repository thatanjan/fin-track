'use client'

import { createBalance } from '@/actions/management'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function NewBalanceForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formDataObj = new FormData(event.currentTarget)

    startTransition(async () => {
      try {
        await createBalance(formDataObj)
        router.push('/')
      } catch (error) {
        console.error('Error creating balance:', error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <Button type="submit" className="flex-1" loading={isPending}>
          {isPending ? 'Adding Account...' : 'Add Account'}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
