import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  jsonb,
  primaryKey,
} from 'drizzle-orm/pg-core'

export const usuario = pgTable('usuario', {
  id: serial('id').primaryKey(),
  legajo: text('legajo').notNull().unique(),
  rfid: text('rfid').unique(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  perfil: text('perfil').notNull().default('Operador'),
  pin: text('pin'),
  activo: boolean('activo').notNull().default(true),
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
})

export const sesion = pgTable('sesion', {
  id: text('id').primaryKey(),
  usuarioId: integer('usuario_id').notNull(),
  creada: timestamp('creada', { withTimezone: true }).notNull().defaultNow(),
  expira: timestamp('expira', { withTimezone: true }).notNull(),
  activa: boolean('activa').notNull().default(true),
})

export const cliente = pgTable('cliente', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  cuit: text('cuit'),
  activo: boolean('activo').notNull().default(true),
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
})

export const proveedor = pgTable('proveedor', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  cuit: text('cuit'),
  tipo: text('tipo').notNull().default('Servicio'),
  activo: boolean('activo').notNull().default(true),
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
})

export const servicioProveedor = pgTable('servicio_proveedor', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  activo: boolean('activo').notNull().default(true),
})

export const tipoMateriaPrima = pgTable('tipo_materia_prima', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  activo: boolean('activo').notNull().default(true),
})

export const materiaPrima = pgTable('materia_prima', {
  id: serial('id').primaryKey(),
  codigo: text('codigo').notNull().unique(),
  tipoMateriaPrimaId: integer('tipo_materia_prima_id'),
  stockMinimo: numeric('stock_minimo').notNull().default('0'),
  activo: boolean('activo').notNull().default(true),
})

export const stockIngreso = pgTable('stock_ingreso', {
  id: serial('id').primaryKey(),
  materiaPrimaId: integer('materia_prima_id').notNull(),
  proveedorId: integer('proveedor_id'),
  lote: text('lote'),
  designacion: text('designacion'),
  colada: text('colada'),
  cantidadEntregada: numeric('cantidad_entregada').notNull().default('0'),
  cantidadRechazada: numeric('cantidad_rechazada').notNull().default('0'),
  fecha: timestamp('fecha', { withTimezone: true }).notNull().defaultNow(),
  usuarioId: integer('usuario_id'),
})

export const stockBaja = pgTable('stock_baja', {
  id: serial('id').primaryKey(),
  materiaPrimaId: integer('materia_prima_id').notNull(),
  motivo: text('motivo'),
  cantidad: numeric('cantidad').notNull().default('0'),
  fecha: timestamp('fecha', { withTimezone: true }).notNull().defaultNow(),
  usuarioId: integer('usuario_id'),
})

export const operacion = pgTable('operacion', {
  id: serial('id').primaryKey(),
  codigo: text('codigo').notNull().unique(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  tipo: text('tipo').notNull().default('Interna'),
  proveedorId: integer('proveedor_id'),
  servicioId: integer('servicio_id'),
  activo: boolean('activo').notNull().default(true),
})

export const operacionAdjunto = pgTable('operacion_adjunto', {
  id: serial('id').primaryKey(),
  operacionId: integer('operacion_id').notNull(),
  nombreArchivo: text('nombre_archivo').notNull(),
  tipoArchivo: text('tipo_archivo'),
  rutaArchivo: text('ruta_archivo'),
})

export const maquina = pgTable('maquina', {
  id: serial('id').primaryKey(),
  codigo: text('codigo').notNull().unique(),
  nombre: text('nombre').notNull(),
  tiempoSetup: integer('tiempo_setup').notNull().default(0),
  activo: boolean('activo').notNull().default(true),
})

export const maquinaOperacion = pgTable(
  'maquina_operacion',
  {
    maquinaId: integer('maquina_id').notNull(),
    operacionId: integer('operacion_id').notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.maquinaId, t.operacionId] }) }),
)

export const producto = pgTable('producto', {
  id: serial('id').primaryKey(),
  codigo: text('codigo').notNull().unique(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  activo: boolean('activo').notNull().default(true),
})

export const workflow = pgTable('workflow', {
  id: serial('id').primaryKey(),
  productoId: integer('producto_id').notNull(),
  nombre: text('nombre').notNull(),
})

export const etapaWorkflow = pgTable('etapa_workflow', {
  id: serial('id').primaryKey(),
  workflowId: integer('workflow_id').notNull(),
  nombre: text('nombre').notNull(),
  orden: integer('orden').notNull().default(0),
})

export const etapaOperacion = pgTable('etapa_operacion', {
  id: serial('id').primaryKey(),
  etapaWorkflowId: integer('etapa_workflow_id').notNull(),
  operacionId: integer('operacion_id').notNull(),
  orden: integer('orden').notNull().default(0),
})

export const ordenTrabajo = pgTable('orden_trabajo', {
  id: serial('id').primaryKey(),
  clienteId: integer('cliente_id'),
  productoId: integer('producto_id'),
  materiaPrimaId: integer('materia_prima_id'),
  descripcion: text('descripcion'),
  codigoLote: text('codigo_lote'),
  cantidadFabricar: numeric('cantidad_fabricar').notNull().default('0'),
  estado: text('estado').notNull().default('Pendiente'),
  motivoCancelacion: text('motivo_cancelacion'),
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
})

export const operacionOrdenTrabajo = pgTable('operacion_orden_trabajo', {
  id: serial('id').primaryKey(),
  ordenTrabajoId: integer('orden_trabajo_id').notNull(),
  operacionId: integer('operacion_id'),
  etapaNombre: text('etapa_nombre'),
  orden: integer('orden').notNull().default(0),
  cantidadInicial: numeric('cantidad_inicial').notNull().default('0'),
  cantidadFinal: numeric('cantidad_final').notNull().default('0'),
  cantidadDescarte: numeric('cantidad_descarte').notNull().default('0'),
  estado: text('estado').notNull().default('Pendiente'),
  fechaInicio: timestamp('fecha_inicio', { withTimezone: true }),
  fechaFin: timestamp('fecha_fin', { withTimezone: true }),
  tiempoSetup: integer('tiempo_setup').notNull().default(0),
  tiempoFallas: integer('tiempo_fallas').notNull().default(0),
})

export const parcialidadOperacion = pgTable('parcialidad_operacion', {
  id: serial('id').primaryKey(),
  operacionOrdenTrabajoId: integer('operacion_orden_trabajo_id').notNull(),
  usuarioId: integer('usuario_id'),
  maquinaId: integer('maquina_id'),
  cantidadInicial: numeric('cantidad_inicial').notNull().default('0'),
  cantidadFinal: numeric('cantidad_final').notNull().default('0'),
  cantidadDescarte: numeric('cantidad_descarte').notNull().default('0'),
  motivoDescarte: text('motivo_descarte'),
  fechaInicio: timestamp('fecha_inicio', { withTimezone: true }).notNull().defaultNow(),
  fechaFin: timestamp('fecha_fin', { withTimezone: true }),
})

export const demoraOperacion = pgTable('demora_operacion', {
  id: serial('id').primaryKey(),
  parcialidadOperacionId: integer('parcialidad_operacion_id').notNull(),
  duracionMinutos: integer('duracion_minutos').notNull().default(0),
  motivo: text('motivo'),
})

export const remitoServicioExterno = pgTable('remito_servicio_externo', {
  id: serial('id').primaryKey(),
  operacionOrdenTrabajoId: integer('operacion_orden_trabajo_id').notNull(),
  proveedorId: integer('proveedor_id'),
  cantidad: numeric('cantidad').notNull().default('0'),
  peso: numeric('peso'),
  fechaSalida: timestamp('fecha_salida', { withTimezone: true }),
  fechaRetorno: timestamp('fecha_retorno', { withTimezone: true }),
  estado: text('estado').notNull().default('Enviado'),
})

export const auditoria = pgTable('auditoria', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id'),
  entidad: text('entidad'),
  accion: text('accion'),
  fecha: timestamp('fecha', { withTimezone: true }).notNull().defaultNow(),
  datos: jsonb('datos'),
})
