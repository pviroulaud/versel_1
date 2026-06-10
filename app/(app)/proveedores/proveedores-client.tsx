'use client'

import { CrudManager, type ColumnDef, type FieldDef } from '@/components/crud-manager'
import { ActivoBadge } from '@/components/activo-badge'
import { Badge } from '@/components/ui/badge'
import { crearProveedor, actualizarProveedor, eliminarProveedor } from '@/app/actions/configuracion'

type Proveedor = {
  id: number
  nombre: string
  cuit: string | null
  tipo: string
  activo: boolean
}

const fields: FieldDef[] = [
  { name: 'nombre', label: 'Nombre', required: true, placeholder: 'Razón social' },
  { name: 'cuit', label: 'CUIT', placeholder: '30-12345678-9' },
  {
    name: 'tipo',
    label: 'Tipo',
    type: 'select',
    required: true,
    defaultValue: 'Servicio',
    options: [
      { value: 'Materia Prima', label: 'Materia Prima' },
      { value: 'Servicio', label: 'Servicio' },
    ],
  },
  { name: 'activo', label: 'Activo', type: 'switch', defaultValue: true },
]

const columns: ColumnDef<Proveedor>[] = [
  { header: 'Nombre', cell: (r) => <span className="font-medium">{r.nombre}</span> },
  { header: 'CUIT', cell: (r) => <span className="font-mono text-xs">{r.cuit ?? '—'}</span> },
  {
    header: 'Tipo',
    cell: (r) => <Badge variant="secondary">{r.tipo}</Badge>,
  },
  { header: 'Estado', cell: (r) => <ActivoBadge activo={r.activo} /> },
]

export function ProveedoresClient({ rows }: { rows: Proveedor[] }) {
  return (
    <CrudManager<Proveedor>
      rows={rows}
      columns={columns}
      fields={fields}
      entityLabel="proveedor"
      searchKeys={['nombre', 'cuit', 'tipo']}
      toFormValues={(r) => ({ nombre: r.nombre, cuit: r.cuit, tipo: r.tipo, activo: r.activo })}
      createAction={crearProveedor}
      updateAction={actualizarProveedor}
      deleteAction={eliminarProveedor}
      deleteLabel="Desactivar"
    />
  )
}
