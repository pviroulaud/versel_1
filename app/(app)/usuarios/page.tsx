import { db } from '@/lib/db'
import { usuario } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { PageHeader } from '@/components/page-header'
import { UsuariosClient } from './usuarios-client'

export default async function UsuariosPage() {
  const user = await getSession()
  if (!user) redirect('/login')
  if (user.perfil !== 'Administrador') redirect('/dashboard')

  const rows = await db
    .select({
      id: usuario.id,
      legajo: usuario.legajo,
      rfid: usuario.rfid,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      perfil: usuario.perfil,
      activo: usuario.activo,
    })
    .from(usuario)
    .orderBy(desc(usuario.fechaCreacion))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Usuarios"
        description="Gestión de operadores y administradores. Acceso por legajo + PIN o RFID."
      />
      <UsuariosClient rows={rows} />
    </div>
  )
}
