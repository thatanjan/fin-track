`import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">Something went wrong</CardTitle>
          <CardDescription>
            We encountered an error while processing your request.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Please try again or contact support if the problem persists.
          </p>
          <div className="flex space-x-4">
            <Button asChild className="flex-1">
              <Link href="/">Go Home</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}