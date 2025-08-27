'use client'

import { createCategory } from '@/actions/management'
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

export default function NewCategoryForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const formDataObj = new FormData(event.currentTarget)
    
    startTransition(async () => {
      try {
        await createCategory(formDataObj)
        router.push('/')
      } catch (error) {
        console.error('Error creating category:', error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <Button type="submit" className="flex-1" loading={isPending}>
          {isPending ? 'Adding Category...' : 'Add Category'}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}