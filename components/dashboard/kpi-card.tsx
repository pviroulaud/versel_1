import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  accent,
}: {
  label: string
  value: string | number
  unit?: string
  icon: LucideIcon
  accent?: 'primary' | 'accent' | 'destructive' | 'chart-4'
}) {
  const accentClass = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/15 text-accent-foreground',
    destructive: 'bg-destructive/10 text-destructive',
    'chart-4': 'bg-chart-4/15 text-chart-4',
  }[accent ?? 'primary']

  return (
    <Card className="flex flex-row items-center gap-4 p-4">
      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-md', accentClass)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="font-mono text-2xl font-bold leading-tight text-foreground">
          {value}
          {unit ? <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span> : null}
        </p>
      </div>
    </Card>
  )
}
