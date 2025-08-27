'use client'

import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { useTransition } from 'react'

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <Button 
      type="button" 
      variant="outline" 
      onClick={handleSignOut}
      loading={isPending}
    >
      {isPending ? 'Signing out...' : 'Sign Out'}
    </Button>
  )
}