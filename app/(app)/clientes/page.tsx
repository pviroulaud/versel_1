import { db } from '@/lib/db'
import { cliente } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { PageHeader } from '@/components/page-header'
import { ClientesClient } from './clientes-client'

export default async function ClientesPage() {
  const rows = await db.select().from(cliente).orderBy(desc(cliente.fechaCreacion))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Clientes" description="Administre los clientes de la fábrica." />
      <ClientesClient rows={rows} />
    </div>
  )
}
