'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'

const estadoConfig = {
  total: { label: 'Órdenes' },
  Pendiente: { label: 'Pendiente', color: 'var(--chart-5)' },
  'En Curso': { label: 'En Curso', color: 'var(--chart-1)' },
  Finalizada: { label: 'Finalizada', color: 'var(--chart-4)' },
  Cancelada: { label: 'Cancelada', color: 'var(--destructive)' },
} satisfies ChartConfig

export function EstadosChart({ data }: { data: Record<string, number> }) {
  const orden = ['Pendiente', 'En Curso', 'Finalizada', 'Cancelada']
  const rows = orden.map((estado) => ({
    estado,
    total: data[estado] ?? 0,
    fill: (estadoConfig as Record<string, { color?: string }>)[estado]?.color,
  }))

  return (
    <ChartContainer config={estadoConfig} className="h-[260px] w-full">
      <BarChart data={rows} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="estado" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
          {rows.map((r) => (
            <Cell key={r.estado} fill={r.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

const stockConfig = {
  actual: { label: 'Stock actual', color: 'var(--chart-1)' },
  minimo: { label: 'Mínimo', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function StockChart({
  data,
}: {
  data: { codigo: string; actual: number; minimo: number }[]
}) {
  return (
    <ChartContainer config={stockConfig} className="h-[260px] w-full">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="codigo" tickLine={false} axisLine={false} fontSize={11} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="actual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="minimo" fill="var(--color-minimo)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

const palette = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

export function DescarteChart({
  data,
}: {
  data: { motivo: string; total: number }[]
}) {
  const config: ChartConfig = { total: { label: 'Unidades' } }
  data.forEach((d, i) => {
    config[d.motivo] = { label: d.motivo, color: palette[i % palette.length] }
  })
  const rows = data.map((d, i) => ({ ...d, fill: palette[i % palette.length] }))

  if (rows.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        Sin descartes registrados.
      </div>
    )
  }

  return (
    <ChartContainer config={config} className="mx-auto aspect-square h-[260px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="motivo" />} />
        <Pie data={rows} dataKey="total" nameKey="motivo" innerRadius={55} strokeWidth={3}>
          {rows.map((r) => (
            <Cell key={r.motivo} fill={r.fill} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="motivo" />} className="flex-wrap" />
      </PieChart>
    </ChartContainer>
  )
}
