import 'server-only'
import { db } from '@/lib/db'
import { auditoria } from '@/lib/db/schema'
import { requireSession, type SessionUser } from '@/lib/auth'

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireSession()
  if (user.perfil !== 'Administrador') throw new Error('Forbidden')
  return user
}

export async function audit(
  usuarioId: number | null,
  entidad: string,
  accion: string,
  datos?: unknown,
) {
  try {
    await db.insert(auditoria).values({
      usuarioId: usuarioId ?? null,
      entidad,
      accion,
      datos: datos ? (datos as object) : null,
    })
  } catch {
    // auditing should never block the main operation
  }
}
