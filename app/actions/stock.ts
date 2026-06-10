"use server"

import { db } from "@/lib/db"
import {
  tipoMateriaPrima,
  materiaPrima,
  stockIngreso,
  stockBaja,
  proveedor,
  usuario,
  ordenTrabajo,
} from "@/lib/db/schema"
import { and, desc, eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { requireUser, requireAdmin } from "@/lib/actions-helpers"

/* ---------- Tipos de materia prima ---------- */

export async function getTiposMateriaPrima() {
  return db.select().from(tipoMateriaPrima).orderBy(tipoMateriaPrima.nombre)
}

export async function crearTipoMateriaPrima(data: { nombre: string; activo?: boolean }) {
  await requireUser()
  await db.insert(tipoMateriaPrima).values({ nombre: data.nombre, activo: data.activo ?? true })
  revalidatePath("/stock/tipos")
}

export async function actualizarTipoMateriaPrima(id: number, data: { nombre: string; activo?: boolean }) {
  await requireUser()
  await db
    .update(tipoMateriaPrima)
    .set({ nombre: data.nombre, activo: data.activo ?? true })
    .where(eq(tipoMateriaPrima.id, id))
  revalidatePath("/stock/tipos")
}

export async function eliminarTipoMateriaPrima(id: number) {
  await requireAdmin()
  await db.delete(tipoMateriaPrima).where(eq(tipoMateriaPrima.id, id))
  revalidatePath("/stock/tipos")
}

/* ---------- Materias primas ---------- */

export async function getMateriasPrimas() {
  const rows = await db
    .select({
      id: materiaPrima.id,
      codigo: materiaPrima.codigo,
      tipoMateriaPrimaId: materiaPrima.tipoMateriaPrimaId,
      tipoNombre: tipoMateriaPrima.nombre,
      stockMinimo: materiaPrima.stockMinimo,
      activo: materiaPrima.activo,
    })
    .from(materiaPrima)
    .leftJoin(tipoMateriaPrima, eq(materiaPrima.tipoMateriaPrimaId, tipoMateriaPrima.id))
    .orderBy(materiaPrima.codigo)
  return rows
}

export async function crearMateriaPrima(data: {
  codigo: string
  tipoMateriaPrimaId?: number | null
  stockMinimo?: number
  activo?: boolean
}) {
  await requireUser()
  await db.insert(materiaPrima).values({
    codigo: data.codigo,
    tipoMateriaPrimaId: data.tipoMateriaPrimaId ?? null,
    stockMinimo: String(data.stockMinimo ?? 0),
    activo: data.activo ?? true,
  })
  revalidatePath("/stock/materias-primas")
  revalidatePath("/stock")
}

export async function actualizarMateriaPrima(
  id: number,
  data: { codigo: string; tipoMateriaPrimaId?: number | null; stockMinimo?: number; activo?: boolean },
) {
  await requireUser()
  await db
    .update(materiaPrima)
    .set({
      codigo: data.codigo,
      tipoMateriaPrimaId: data.tipoMateriaPrimaId ?? null,
      stockMinimo: String(data.stockMinimo ?? 0),
      activo: data.activo ?? true,
    })
    .where(eq(materiaPrima.id, id))
  revalidatePath("/stock/materias-primas")
  revalidatePath("/stock")
}

export async function eliminarMateriaPrima(id: number) {
  await requireAdmin()
  await db.delete(materiaPrima).where(eq(materiaPrima.id, id))
  revalidatePath("/stock/materias-primas")
}

/* ---------- Ingresos de stock ---------- */

export async function getIngresos() {
  return db
    .select({
      id: stockIngreso.id,
      materiaPrimaId: stockIngreso.materiaPrimaId,
      materiaPrimaCodigo: materiaPrima.codigo,
      proveedorId: stockIngreso.proveedorId,
      proveedorNombre: proveedor.nombre,
      lote: stockIngreso.lote,
      designacion: stockIngreso.designacion,
      colada: stockIngreso.colada,
      cantidadEntregada: stockIngreso.cantidadEntregada,
      cantidadRechazada: stockIngreso.cantidadRechazada,
      fecha: stockIngreso.fecha,
      usuarioNombre: usuario.nombre,
    })
    .from(stockIngreso)
    .leftJoin(materiaPrima, eq(stockIngreso.materiaPrimaId, materiaPrima.id))
    .leftJoin(proveedor, eq(stockIngreso.proveedorId, proveedor.id))
    .leftJoin(usuario, eq(stockIngreso.usuarioId, usuario.id))
    .orderBy(desc(stockIngreso.fecha))
}

export async function crearIngreso(data: {
  materiaPrimaId: number
  proveedorId?: number | null
  lote?: string
  designacion?: string
  colada?: string
  cantidadEntregada: number
  cantidadRechazada?: number
}) {
  const u = await requireUser()
  await db.insert(stockIngreso).values({
    materiaPrimaId: data.materiaPrimaId,
    proveedorId: data.proveedorId ?? null,
    lote: data.lote ?? null,
    designacion: data.designacion ?? null,
    colada: data.colada ?? null,
    cantidadEntregada: String(data.cantidadEntregada),
    cantidadRechazada: String(data.cantidadRechazada ?? 0),
    usuarioId: u.id,
  })
  revalidatePath("/stock/ingresos")
  revalidatePath("/stock")
}

export async function eliminarIngreso(id: number) {
  await requireAdmin()
  await db.delete(stockIngreso).where(eq(stockIngreso.id, id))
  revalidatePath("/stock/ingresos")
  revalidatePath("/stock")
}

/* ---------- Bajas de stock ---------- */

export async function getBajas() {
  return db
    .select({
      id: stockBaja.id,
      materiaPrimaId: stockBaja.materiaPrimaId,
      materiaPrimaCodigo: materiaPrima.codigo,
      motivo: stockBaja.motivo,
      cantidad: stockBaja.cantidad,
      fecha: stockBaja.fecha,
      usuarioNombre: usuario.nombre,
    })
    .from(stockBaja)
    .leftJoin(materiaPrima, eq(stockBaja.materiaPrimaId, materiaPrima.id))
    .leftJoin(usuario, eq(stockBaja.usuarioId, usuario.id))
    .orderBy(desc(stockBaja.fecha))
}

export async function crearBaja(data: { materiaPrimaId: number; motivo?: string; cantidad: number }) {
  const u = await requireUser()
  await db.insert(stockBaja).values({
    materiaPrimaId: data.materiaPrimaId,
    motivo: data.motivo ?? null,
    cantidad: String(data.cantidad),
    usuarioId: u.id,
  })
  revalidatePath("/stock/bajas")
  revalidatePath("/stock")
}

export async function eliminarBaja(id: number) {
  await requireAdmin()
  await db.delete(stockBaja).where(eq(stockBaja.id, id))
  revalidatePath("/stock/bajas")
  revalidatePath("/stock")
}

/* ---------- Existencias (cálculo) ---------- */

export async function getExistencias() {
  // ingresos netos = entregada - rechazada
  const ingresos = await db
    .select({
      materiaPrimaId: stockIngreso.materiaPrimaId,
      total: sql<number>`coalesce(sum(${stockIngreso.cantidadEntregada} - ${stockIngreso.cantidadRechazada}), 0)`,
    })
    .from(stockIngreso)
    .groupBy(stockIngreso.materiaPrimaId)

  const bajas = await db
    .select({
      materiaPrimaId: stockBaja.materiaPrimaId,
      total: sql<number>`coalesce(sum(${stockBaja.cantidad}), 0)`,
    })
    .from(stockBaja)
    .groupBy(stockBaja.materiaPrimaId)

  // consumo por órdenes de trabajo (cantidad a fabricar de OTs no canceladas)
  const consumo = await db
    .select({
      materiaPrimaId: ordenTrabajo.materiaPrimaId,
      total: sql<number>`coalesce(sum(${ordenTrabajo.cantidadFabricar}), 0)`,
    })
    .from(ordenTrabajo)
    .where(sql`${ordenTrabajo.estado} <> 'Cancelada' and ${ordenTrabajo.materiaPrimaId} is not null`)
    .groupBy(ordenTrabajo.materiaPrimaId)

  const ingresoMap = new Map(ingresos.map((r) => [r.materiaPrimaId, Number(r.total)]))
  const bajaMap = new Map(bajas.map((r) => [r.materiaPrimaId, Number(r.total)]))
  const consumoMap = new Map(consumo.map((r) => [r.materiaPrimaId, Number(r.total)]))

  const materias = await getMateriasPrimas()

  return materias.map((m) => {
    const ingresado = ingresoMap.get(m.id) ?? 0
    const dadoBaja = bajaMap.get(m.id) ?? 0
    const reservado = consumoMap.get(m.id) ?? 0
    const disponible = ingresado - dadoBaja - reservado
    const minimo = Number(m.stockMinimo ?? 0)
    return {
      ...m,
      ingresado,
      dadoBaja,
      reservado,
      disponible,
      minimo,
      bajoMinimo: disponible < minimo,
    }
  })
}
