'use client'

import { CrudManager, type ColumnDef, type FieldDef } from '@/components/crud-manager'
import { ActivoBadge } from '@/components/activo-badge'
import { Badge } from '@/components/ui/badge'
import { crearUsuario, actualizarUsuario, eliminarUsuario } from '@/app/actions/configuracion'

type Usuario = {
  id: number
  legajo: string
  rfid: string | null
  nombre: string
  apellido: string
  perfil: string
  activo: boolean
}

const fields: FieldDef[] = [
  { name: 'legajo', label: 'Legajo', required: true, placeholder: '1001' },
  { name: 'rfid', label: 'RFID', placeholder: 'RF-0000-000' },
  { name: 'nombre', label: 'Nombre', required: true },
  { name: 'apellido', label: 'Apellido', required: true },
  {
    name: 'perfil',
    label: 'Perfil',
    type: 'select',
    required: true,
    defaultValue: 'Operador',
    options: [
      { value: 'Administrador', label: 'Administrador' },
      { value: 'Operador', label: 'Operador' },
    ],
  },
  { name: 'pin', label: 'PIN', placeholder: 'Dejar vacío para no cambiar', help: 'Solo numérico.' },
  { name: 'activo', label: 'Activo', type: 'switch', defaultValue: true },
]

const columns: ColumnDef<Usuario>[] = [
  { header: 'Legajo', cell: (r) => <span className="font-mono text-xs font-medium">{r.legajo}</span> },
  {
    header: 'Nombre',
    cell: (r) => (
      <span className="font-medium">
        {r.nombre} {r.apellido}
      </span>
    ),
  },
  { header: 'RFID', cell: (r) => <span className="font-mono text-xs">{r.rfid ?? '—'}</span> },
  {
    header: 'Perfil',
    cell: (r) => (
      <Badge variant={r.perfil === 'Administrador' ? 'default' : 'secondary'}>{r.perfil}</Badge>
    ),
  },
  { header: 'Estado', cell: (r) => <ActivoBadge activo={r.activo} /> },
]

export function UsuariosClient({ rows }: { rows: Usuario[] }) {
  return (
    <CrudManager<Usuario>
      rows={rows}
      columns={columns}
      fields={fields}
      entityLabel="usuario"
      searchKeys={['legajo', 'nombre', 'apellido', 'rfid', 'perfil']}
      toFormValues={(r) => ({
        legajo: r.legajo,
        rfid: r.rfid,
        nombre: r.nombre,
        apellido: r.apellido,
        perfil: r.perfil,
        pin: '',
        activo: r.activo,
      })}
      createAction={crearUsuario}
      updateAction={actualizarUsuario}
      deleteAction={eliminarUsuario}
      deleteLabel="Desactivar"
    />
  )
}
