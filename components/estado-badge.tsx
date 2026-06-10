import { cn } from '@/lib/utils'

const styles: Record<string, string> = {
  Pendiente: 'border-chart-5/30 bg-chart-5/10 text-foreground',
  'En Curso': 'border-primary/30 bg-primary/10 text-primary',
  Disponible: 'border-primary/30 bg-primary/10 text-primary',
  Finalizada: 'border-chart-4/30 bg-chart-4/15 text-chart-4',
  Completada: 'border-chart-4/30 bg-chart-4/15 text-chart-4',
  Cancelada: 'border-destructive/30 bg-destructive/10 text-destructive',
  Enviado: 'border-accent/40 bg-accent/15 text-accent-foreground',
}

export function EstadoBadge({ estado }: { estado: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        styles[estado] ?? 'border-border bg-muted text-muted-foreground',
      )}
    >
      {estado}
    </span>
  )
}
