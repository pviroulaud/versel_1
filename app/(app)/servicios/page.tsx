import { db } from '@/lib/db'
import { servicioProveedor } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { PageHeader } from '@/components/page-header'
import { ServiciosClient } from './servicios-client'

export default async function ServiciosPage() {
  const rows = await db
    .select()
    .from(servicioProveedor)
    .orderBy(desc(servicioProveedor.id))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Servicios"
        description="Catálogo de servicios externos prestados por proveedores."
      />
      <ServiciosClient rows={rows} />
    </div>
  )
}
