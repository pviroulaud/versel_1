'use client'

import { CrudManager, type ColumnDef, type FieldDef } from '@/components/crud-manager'
import { ActivoBadge } from '@/components/activo-badge'
import { crearServicio, actualizarServicio, eliminarServicio } from '@/app/actions/configuracion'

type Servicio = { id: number; nombre: string; activo: boolean }

const fields: FieldDef[] = [
  { name: 'nombre', label: 'Nombre', required: true, placeholder: 'Ej. Brochado' },
  { name: 'activo', label: 'Activo', type: 'switch', defaultValue: true },
]

const columns: ColumnDef<Servicio>[] = [
  { header: 'Servicio', cell: (r) => <span className="font-medium">{r.nombre}</span> },
  { header: 'Estado', cell: (r) => <ActivoBadge activo={r.activo} /> },
]

export function ServiciosClient({ rows }: { rows: Servicio[] }) {
  return (
    <CrudManager<Servicio>
      rows={rows}
      columns={columns}
      fields={fields}
      entityLabel="servicio"
      searchKeys={['nombre']}
      toFormValues={(r) => ({ nombre: r.nombre, activo: r.activo })}
      createAction={crearServicio}
      updateAction={actualizarServicio}
      deleteAction={eliminarServicio}
      deleteLabel="Desactivar"
    />
  )
}
