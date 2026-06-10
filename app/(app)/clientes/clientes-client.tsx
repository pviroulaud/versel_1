'use client'

import { CrudManager, type ColumnDef, type FieldDef } from '@/components/crud-manager'
import { ActivoBadge } from '@/components/activo-badge'
import { crearCliente, actualizarCliente, eliminarCliente } from '@/app/actions/configuracion'

type Cliente = { id: number; nombre: string; cuit: string | null; activo: boolean }

const fields: FieldDef[] = [
  { name: 'nombre', label: 'Nombre', required: true, placeholder: 'Razón social' },
  { name: 'cuit', label: 'CUIT', placeholder: '30-12345678-9' },
  { name: 'activo', label: 'Activo', type: 'switch', defaultValue: true },
]

const columns: ColumnDef<Cliente>[] = [
  { header: 'Nombre', cell: (r) => <span className="font-medium">{r.nombre}</span> },
  { header: 'CUIT', cell: (r) => <span className="font-mono text-xs">{r.cuit ?? '—'}</span> },
  { header: 'Estado', cell: (r) => <ActivoBadge activo={r.activo} /> },
]

export function ClientesClient({ rows }: { rows: Cliente[] }) {
  return (
    <CrudManager<Cliente>
      rows={rows}
      columns={columns}
      fields={fields}
      entityLabel="cliente"
      searchKeys={['nombre', 'cuit']}
      toFormValues={(r) => ({ nombre: r.nombre, cuit: r.cuit, activo: r.activo })}
      createAction={crearCliente}
      updateAction={actualizarCliente}
      deleteAction={eliminarCliente}
      deleteLabel="Desactivar"
    />
  )
}
