import { db } from '@/lib/db'
import { proveedor } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { PageHeader } from '@/components/page-header'
import { ProveedoresClient } from './proveedores-client'

export default async function ProveedoresPage() {
  const rows = await db.select().from(proveedor).orderBy(desc(proveedor.fechaCreacion))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Proveedores"
        description="Proveedores de materia prima y de servicios externos."
      />
      <ProveedoresClient rows={rows} />
    </div>
  )
}
