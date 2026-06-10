import { getSession } from '@/lib/auth'
import { getDashboardData } from '@/lib/data/dashboard'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { EstadosChart, StockChart, DescarteChart } from '@/components/dashboard/charts'
import { EstadoBadge } from '@/components/estado-badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import {
  Activity,
  CheckCircle2,
  Package,
  Percent,
  Send,
  Users,
  AlertTriangle,
  ClipboardList,
} from 'lucide-react'

function fmtFecha(d: Date | string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function DashboardPage() {
  const user = await getSession()
  const data = await getDashboardData()
  const { kpis } = data
  const lowStock = data.stock.filter((s) => s.actual <= s.minimo)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Bienvenido, {user?.nombre}
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumen general del piso de planta — fabricación de engranajes cónicos.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="OT en curso" value={kpis.enCurso} icon={Activity} accent="primary" />
        <KpiCard label="OT pendientes" value={kpis.pendientes} icon={ClipboardList} accent="accent" />
        <KpiCard label="Unidades producidas" value={kpis.producidas} icon={CheckCircle2} accent="chart-4" />
        <KpiCard label="Tasa de calidad" value={kpis.tasaCalidad} unit="%" icon={Percent} accent="primary" />
        <KpiCard label="Operadores activos" value={kpis.operadoresActivos} icon={Users} accent="primary" />
        <KpiCard label="Servicios externos abiertos" value={kpis.remitosAbiertos} icon={Send} accent="accent" />
        <KpiCard label="Unidades descartadas" value={kpis.descarte} icon={AlertTriangle} accent="destructive" />
        <KpiCard label="OT finalizadas" value={kpis.finalizadas} icon={Package} accent="chart-4" />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Órdenes de trabajo por estado</CardTitle>
            <CardDescription>Distribución actual de las OT en el sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <EstadosChart data={data.estados} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Descarte por motivo</CardTitle>
            <CardDescription>Unidades rechazadas según causa.</CardDescription>
          </CardHeader>
          <CardContent>
            <DescarteChart data={data.descartePorMotivo} />
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Órdenes recientes</CardTitle>
              <CardDescription>Últimas órdenes de trabajo registradas.</CardDescription>
            </div>
            <Link href="/ordenes" className="text-sm font-medium text-primary hover:underline">
              Ver todas
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Lote</th>
                    <th className="px-4 py-2 font-medium">Cliente</th>
                    <th className="px-4 py-2 font-medium">Producto</th>
                    <th className="px-4 py-2 text-right font-medium">Cant.</th>
                    <th className="px-4 py-2 font-medium">Estado</th>
                    <th className="px-4 py-2 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recientes.map((ot) => (
                    <tr key={ot.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                      <td className="px-4 py-2.5 font-mono text-xs font-medium">{ot.lote ?? `OT-${ot.id}`}</td>
                      <td className="px-4 py-2.5">{ot.cliente ?? '—'}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{ot.producto ?? '—'}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{Number(ot.cantidad)}</td>
                      <td className="px-4 py-2.5">
                        <EstadoBadge estado={ot.estado} />
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{fmtFecha(ot.fecha)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Niveles de stock</CardTitle>
            <CardDescription>
              {lowStock.length > 0
                ? `${lowStock.length} material(es) bajo el mínimo`
                : 'Todos los materiales sobre el mínimo'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StockChart data={data.stock} />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
