import 'server-only'
import { db } from '@/lib/db'
import {
  ordenTrabajo,
  operacionOrdenTrabajo,
  parcialidadOperacion,
  materiaPrima,
  stockIngreso,
  stockBaja,
  cliente,
  producto,
  remitoServicioExterno,
} from '@/lib/db/schema'
import { sql, eq, desc } from 'drizzle-orm'

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>

export async function getDashboardData() {
  const [
    estados,
    produccionResult,
    tiemposResult,
    operadoresResult,
    remitosAbiertos,
    recientesRows,
    stockRows,
    descartePorMotivo,
  ] = await Promise.all([
    db
      .select({ estado: ordenTrabajo.estado, total: sql<number>`count(*)::int` })
      .from(ordenTrabajo)
      .groupBy(ordenTrabajo.estado),

    db
      .select({
        producidas: sql<number>`coalesce(sum(${operacionOrdenTrabajo.cantidadFinal}),0)::float`,
        descarte: sql<number>`coalesce(sum(${operacionOrdenTrabajo.cantidadDescarte}),0)::float`,
      })
      .from(operacionOrdenTrabajo),

    db
      .select({
        setup: sql<number>`coalesce(sum(${operacionOrdenTrabajo.tiempoSetup}),0)::int`,
        fallas: sql<number>`coalesce(sum(${operacionOrdenTrabajo.tiempoFallas}),0)::int`,
      })
      .from(operacionOrdenTrabajo),

    db
      .select({ total: sql<number>`count(distinct ${parcialidadOperacion.usuarioId})::int` })
      .from(parcialidadOperacion)
      .where(sql`${parcialidadOperacion.fechaFin} is null`),

    db
      .select({ total: sql<number>`count(*)::int` })
      .from(remitoServicioExterno)
      .where(sql`${remitoServicioExterno.estado} in ('Enviado','Recibido','Reenviado')`),

    db
      .select({
        id: ordenTrabajo.id,
        lote: ordenTrabajo.codigoLote,
        descripcion: ordenTrabajo.descripcion,
        estado: ordenTrabajo.estado,
        cantidad: ordenTrabajo.cantidadFabricar,
        fecha: ordenTrabajo.fechaCreacion,
        cliente: cliente.nombre,
        producto: producto.nombre,
      })
      .from(ordenTrabajo)
      .leftJoin(cliente, eq(ordenTrabajo.clienteId, cliente.id))
      .leftJoin(producto, eq(ordenTrabajo.productoId, producto.id))
      .orderBy(desc(ordenTrabajo.fechaCreacion))
      .limit(6),

    db
      .select({
        id: materiaPrima.id,
        codigo: materiaPrima.codigo,
        minimo: materiaPrima.stockMinimo,
        ingresos: sql<number>`coalesce((select sum(${stockIngreso.cantidadEntregada} - ${stockIngreso.cantidadRechazada}) from ${stockIngreso} where ${stockIngreso.materiaPrimaId} = ${materiaPrima.id}),0)::float`,
        bajas: sql<number>`coalesce((select sum(${stockBaja.cantidad}) from ${stockBaja} where ${stockBaja.materiaPrimaId} = ${materiaPrima.id}),0)::float`,
      })
      .from(materiaPrima),

    db
      .select({
        motivo: sql<string>`coalesce(${parcialidadOperacion.motivoDescarte}, 'Sin especificar')`,
        total: sql<number>`coalesce(sum(${parcialidadOperacion.cantidadDescarte}),0)::float`,
      })
      .from(parcialidadOperacion)
      .where(sql`${parcialidadOperacion.cantidadDescarte} > 0`)
      .groupBy(sql`coalesce(${parcialidadOperacion.motivoDescarte}, 'Sin especificar')`),
  ])

  const estadoMap: Record<string, number> = {}
  for (const e of estados) estadoMap[e.estado] = e.total

  const prod = produccionResult[0] ?? { producidas: 0, descarte: 0 }
  const totalUnidades = prod.producidas + prod.descarte
  const tasaCalidad = totalUnidades > 0 ? (prod.producidas / totalUnidades) * 100 : 100
  const tiempos = tiemposResult[0] ?? { setup: 0, fallas: 0 }

  const stock = stockRows.map((s) => ({
    codigo: s.codigo,
    actual: Number(s.ingresos) - Number(s.bajas),
    minimo: Number(s.minimo),
  }))

  return {
    kpis: {
      enCurso: estadoMap['En Curso'] ?? 0,
      pendientes: estadoMap['Pendiente'] ?? 0,
      finalizadas: estadoMap['Finalizada'] ?? 0,
      canceladas: estadoMap['Cancelada'] ?? 0,
      producidas: Math.round(prod.producidas),
      descarte: Math.round(prod.descarte),
      tasaCalidad: Math.round(tasaCalidad * 10) / 10,
      operadoresActivos: operadoresResult[0]?.total ?? 0,
      remitosAbiertos: remitosAbiertos[0]?.total ?? 0,
      tiempoSetup: tiempos.setup,
      tiempoFallas: tiempos.fallas,
    },
    estados: estadoMap,
    recientes: recientesRows,
    stock,
    descartePorMotivo: descartePorMotivo.map((d) => ({
      motivo: d.motivo,
      total: Math.round(Number(d.total)),
    })),
  }
}
