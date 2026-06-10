import { cn } from '@/lib/utils'

export function ActivoBadge({ activo }: { activo: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
        activo
          ? 'border-chart-4/30 bg-chart-4/15 text-chart-4'
          : 'border-border bg-muted text-muted-foreground',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', activo ? 'bg-chart-4' : 'bg-muted-foreground')} />
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  )
}
