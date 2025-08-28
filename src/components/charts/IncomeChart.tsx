'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface IncomeChartProps {
  data: { month: string; amount: number }[]
}

const chartConfig = {
  amount: {
    label: 'Income',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function IncomeChart({ data }: IncomeChartProps) {
  // Calculate trend
  const currentMonth = data[data.length - 1]?.amount || 0
  const previousMonth = data[data.length - 2]?.amount || 0
  const trend =
    previousMonth === 0
      ? 0
      : ((currentMonth - previousMonth) / previousMonth) * 100
  const isPositiveTrend = trend >= 0

  const totalIncome = data.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income</CardTitle>
        <CardDescription>Income trends over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => [
                    formatCurrency(value as number),
                    'Income',
                  ]}
                />
              }
            />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {Math.abs(trend).toFixed(1)}%{' '}
          {isPositiveTrend ? 'increase' : 'decrease'} from last month
          {isPositiveTrend ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Total income: {formatCurrency(totalIncome)} over 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
