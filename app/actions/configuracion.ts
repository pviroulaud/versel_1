'use server'

import { db } from '@/lib/db'
import { cliente, proveedor, servicioProveedor, usuario } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireSession } from '@/lib/auth'
import { requireAdmin, audit } from '@/lib/actions-helpers'

/* ---------------- Clientes ---------------- */

export async function crearCliente(data: Record<string, string>) {
  const user = await requireSession()
  if (!data.nombre?.trim()) return { error: 'El nombre es obligatorio.' }
  const [row] = await db
    .insert(cliente)
    .values({ nombre: data.nombre.trim(), cuit: data.cuit?.trim() || null })
    .returning()
  await audit(user.id, 'Cliente', 'Alta', row)
  revalidatePath('/clientes')
}

export async function actualizarCliente(id: number, data: Record<string, string>) {
  const user = await requireSession()
  if (!data.nombre?.trim()) return { error: 'El nombre es obligatorio.' }
  await db
    .update(cliente)
    .set({
      nombre: data.nombre.trim(),
      cuit: data.cuit?.trim() || null,
      activo: data.activo === 'true',
    })
    .where(eq(cliente.id, id))
  await audit(user.id, 'Cliente', 'Modificación', { id, ...data })
  revalidatePath('/clientes')
}

export async function eliminarCliente(id: number) {
  const user = await requireSession()
  await db.update(cliente).set({ activo: false }).where(eq(cliente.id, id))
  await audit(user.id, 'Cliente', 'Baja', { id })
  revalidatePath('/clientes')
}

/* ---------------- Proveedores ---------------- */

export async function crearProveedor(data: Record<string, string>) {
  const user = await requireSession()
  if (!data.nombre?.trim()) return { error: 'El nombre es obligatorio.' }
  const [row] = await db
    .insert(proveedor)
    .values({
      nombre: data.nombre.trim(),
      cuit: data.cuit?.trim() || null,
      tipo: data.tipo || 'Servicio',
    })
    .returning()
  await audit(user.id, 'Proveedor', 'Alta', row)
  revalidatePath('/proveedores')
}

export async function actualizarProveedor(id: number, data: Record<string, string>) {
  const user = await requireSession()
  if (!data.nombre?.trim()) return { error: 'El nombre es obligatorio.' }
  await db
    .update(proveedor)
    .set({
      nombre: data.nombre.trim(),
      cuit: data.cuit?.trim() || null,
      tipo: data.tipo || 'Servicio',
      activo: data.activo === 'true',
    })
    .where(eq(proveedor.id, id))
  await audit(user.id, 'Proveedor', 'Modificación', { id, ...data })
  revalidatePath('/proveedores')
}

export async function eliminarProveedor(id: number) {
  const user = await requireSession()
  await db.update(proveedor).set({ activo: false }).where(eq(proveedor.id, id))
  await audit(user.id, 'Proveedor', 'Baja', { id })
  revalidatePath('/proveedores')
}

/* ---------------- Servicios ---------------- */

export async function crearServicio(data: Record<string, string>) {
  const user = await requireSession()
  if (!data.nombre?.trim()) return { error: 'El nombre es obligatorio.' }
  const [row] = await db.insert(servicioProveedor).values({ nombre: data.nombre.trim() }).returning()
  await audit(user.id, 'Servicio', 'Alta', row)
  revalidatePath('/servicios')
}

export async function actualizarServicio(id: number, data: Record<string, string>) {
  const user = await requireSession()
  if (!data.nombre?.trim()) return { error: 'El nombre es obligatorio.' }
  await db
    .update(servicioProveedor)
    .set({ nombre: data.nombre.trim(), activo: data.activo === 'true' })
    .where(eq(servicioProveedor.id, id))
  await audit(user.id, 'Servicio', 'Modificación', { id, ...data })
  revalidatePath('/servicios')
}

export async function eliminarServicio(id: number) {
  const user = await requireSession()
  await db.update(servicioProveedor).set({ activo: false }).where(eq(servicioProveedor.id, id))
  await audit(user.id, 'Servicio', 'Baja', { id })
  revalidatePath('/servicios')
}

/* ---------------- Usuarios (solo Administrador) ---------------- */

export async function crearUsuario(data: Record<string, string>) {
  const admin = await requireAdmin()
  if (!data.legajo?.trim()) return { error: 'El legajo es obligatorio.' }
  if (!data.nombre?.trim() || !data.apellido?.trim())
    return { error: 'Nombre y apellido son obligatorios.' }
  try {
    const [row] = await db
      .insert(usuario)
      .values({
        legajo: data.legajo.trim(),
        rfid: data.rfid?.trim() || null,
        nombre: data.nombre.trim(),
        apellido: data.apellido.trim(),
        perfil: data.perfil || 'Operador',
        pin: data.pin?.trim() || null,
      })
      .returning()
    await audit(admin.id, 'Usuario', 'Alta', { ...row, pin: undefined })
  } catch {
    return { error: 'El legajo o RFID ya existe.' }
  }
  revalidatePath('/usuarios')
}

export async function actualizarUsuario(id: number, data: Record<string, string>) {
  const admin = await requireAdmin()
  if (!data.legajo?.trim()) return { error: 'El legajo es obligatorio.' }
  const set: Record<string, unknown> = {
    legajo: data.legajo.trim(),
    rfid: data.rfid?.trim() || null,
    nombre: data.nombre.trim(),
    apellido: data.apellido.trim(),
    perfil: data.perfil || 'Operador',
    activo: data.activo === 'true',
  }
  if (data.pin?.trim()) set.pin = data.pin.trim()
  try {
    await db.update(usuario).set(set).where(eq(usuario.id, id))
    await audit(admin.id, 'Usuario', 'Modificación', { id, ...data, pin: undefined })
  } catch {
    return { error: 'El legajo o RFID ya existe.' }
  }
  revalidatePath('/usuarios')
}

export async function eliminarUsuario(id: number) {
  const admin = await requireAdmin()
  if (admin.id === id) return { error: 'No puede desactivar su propio usuario.' }
  await db.update(usuario).set({ activo: false }).where(eq(usuario.id, id))
  await audit(admin.id, 'Usuario', 'Baja', { id })
  revalidatePath('/usuarios')
}
