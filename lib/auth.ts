import 'server-only'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { db } from './db'
import { sesion, usuario } from './db/schema'
import { and, eq, gt } from 'drizzle-orm'

const COOKIE_NAME = 'mes_session'
const SESSION_DAYS = 7

export type SessionUser = {
  id: number
  legajo: string
  nombre: string
  apellido: string
  perfil: 'Administrador' | 'Operador'
}

/**
 * Authenticate by Legajo + PIN, or by RFID alone.
 * Returns the session id on success, null on failure.
 */
export async function login(params: {
  legajo?: string
  pin?: string
  rfid?: string
}): Promise<{ sessionId: string; user: SessionUser } | null> {
  let found
  if (params.rfid) {
    const rows = await db
      .select()
      .from(usuario)
      .where(and(eq(usuario.rfid, params.rfid), eq(usuario.activo, true)))
      .limit(1)
    found = rows[0]
  } else if (params.legajo) {
    const rows = await db
      .select()
      .from(usuario)
      .where(and(eq(usuario.legajo, params.legajo), eq(usuario.activo, true)))
      .limit(1)
    const candidate = rows[0]
    // If user has a PIN configured it must match
    if (candidate && candidate.pin && candidate.pin !== params.pin) {
      return null
    }
    found = candidate
  }

  if (!found) return null

  const id = randomUUID()
  const expira = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await db.insert(sesion).values({ id, usuarioId: found.id, expira })

  return {
    sessionId: id,
    user: {
      id: found.id,
      legajo: found.legajo,
      nombre: found.nombre,
      apellido: found.apellido,
      perfil: found.perfil as SessionUser['perfil'],
    },
  }
}

export async function setSessionCookie(sessionId: string) {
  const store = await cookies()
  store.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies()
  const sid = store.get(COOKIE_NAME)?.value
  if (!sid) return null

  const rows = await db
    .select({
      uId: usuario.id,
      legajo: usuario.legajo,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      perfil: usuario.perfil,
    })
    .from(sesion)
    .innerJoin(usuario, eq(sesion.usuarioId, usuario.id))
    .where(and(eq(sesion.id, sid), eq(sesion.activa, true), gt(sesion.expira, new Date())))
    .limit(1)

  const r = rows[0]
  if (!r) return null
  return {
    id: r.uId,
    legajo: r.legajo,
    nombre: r.nombre,
    apellido: r.apellido,
    perfil: r.perfil as SessionUser['perfil'],
  }
}

export async function requireSession(): Promise<SessionUser> {
  const s = await getSession()
  if (!s) throw new Error('Unauthorized')
  return s
}

export async function logout() {
  const store = await cookies()
  const sid = store.get(COOKIE_NAME)?.value
  if (sid) {
    await db.update(sesion).set({ activa: false }).where(eq(sesion.id, sid))
    store.delete(COOKIE_NAME)
  }
}
