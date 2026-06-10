'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SelectNative } from '@/components/ui/select-native'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Search, Inbox } from 'lucide-react'
import { toast } from 'sonner'

export type Option = { value: string; label: string }

export type FieldDef = {
  name: string
  label: string
  type?: 'text' | 'number' | 'textarea' | 'select' | 'switch'
  placeholder?: string
  required?: boolean
  options?: Option[]
  defaultValue?: string | number | boolean
  help?: string
  // hide this field based on current form values
  hidden?: (values: Record<string, unknown>) => boolean
}

export type ColumnDef<Row> = {
  header: string
  cell: (row: Row) => React.ReactNode
  align?: 'left' | 'right'
  className?: string
}

type ActionResult = { error?: string } | void

export type CrudManagerProps<Row extends { id: number }> = {
  rows: Row[]
  columns: ColumnDef<Row>[]
  fields: FieldDef[]
  entityLabel: string // singular, e.g. "cliente"
  searchKeys?: (keyof Row)[]
  toFormValues: (row: Row) => Record<string, string | number | boolean | null | undefined>
  createAction: (data: Record<string, string>) => Promise<ActionResult>
  updateAction: (id: number, data: Record<string, string>) => Promise<ActionResult>
  deleteAction: (id: number) => Promise<ActionResult>
  canMutate?: boolean
  deleteLabel?: string
}

export function CrudManager<Row extends { id: number }>({
  rows,
  columns,
  fields,
  entityLabel,
  searchKeys,
  toFormValues,
  createAction,
  updateAction,
  deleteAction,
  canMutate = true,
  deleteLabel = 'Eliminar',
}: CrudManagerProps<Row>) {
  const [query, setQuery] = React.useState('')
  const [editing, setEditing] = React.useState<Row | null>(null)
  const [open, setOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState<Row | null>(null)
  const [pending, startTransition] = React.useTransition()
  const [values, setValues] = React.useState<Record<string, unknown>>({})

  const filtered = React.useMemo(() => {
    if (!query.trim()) return rows
    const q = query.toLowerCase()
    const keys = searchKeys ?? (Object.keys(rows[0] ?? {}) as (keyof Row)[])
    return rows.filter((r) =>
      keys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)),
    )
  }, [rows, query, searchKeys])

  function openCreate() {
    const init: Record<string, unknown> = {}
    for (const f of fields) init[f.name] = f.defaultValue ?? (f.type === 'switch' ? false : '')
    setValues(init)
    setEditing(null)
    setOpen(true)
  }

  function openEdit(row: Row) {
    setValues(toFormValues(row) as Record<string, unknown>)
    setEditing(row)
    setOpen(true)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const data: Record<string, string> = {}
    for (const f of fields) {
      const v = values[f.name]
      data[f.name] = f.type === 'switch' ? (v ? 'true' : 'false') : String(v ?? '')
    }
    startTransition(async () => {
      const res = editing ? await updateAction(editing.id, data) : await createAction(data)
      if (res && 'error' in res && res.error) {
        toast.error(res.error)
        return
      }
      toast.success(editing ? `${cap(entityLabel)} actualizado` : `${cap(entityLabel)} creado`)
      setOpen(false)
    })
  }

  function confirmDelete() {
    if (!deleting) return
    startTransition(async () => {
      const res = await deleteAction(deleting.id)
      if (res && 'error' in res && res.error) {
        toast.error(res.error)
        return
      }
      toast.success(`${cap(entityLabel)} eliminado`)
      setDeleting(null)
    })
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-2 border-b border-border p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar…"
            className="pl-8"
          />
        </div>
        {canMutate ? (
          <Button onClick={openCreate} size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4" /> Nuevo
          </Button>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              {columns.map((c, i) => (
                <th
                  key={i}
                  className={`px-4 py-2.5 font-medium ${c.align === 'right' ? 'text-right' : ''}`}
                >
                  {c.header}
                </th>
              ))}
              {canMutate ? <th className="px-4 py-2.5 text-right font-medium">Acciones</th> : null}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (canMutate ? 1 : 0)}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  <Inbox className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  No hay registros.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                  {columns.map((c, i) => (
                    <td
                      key={i}
                      className={`px-4 py-2.5 ${c.align === 'right' ? 'text-right' : ''} ${c.className ?? ''}`}
                    >
                      {c.cell(row)}
                    </td>
                  ))}
                  {canMutate ? (
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(row)} aria-label="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive"
                          onClick={() => setDeleting(row)}
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? `Editar ${entityLabel}` : `Nuevo ${entityLabel}`}
            </DialogTitle>
            <DialogDescription>
              Complete los campos y guarde los cambios.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid max-h-[60vh] grid-cols-1 gap-4 overflow-y-auto pr-1">
              {fields.map((f) => {
                if (f.hidden?.(values)) return null
                return (
                  <div key={f.name} className="flex flex-col gap-1.5">
                    {f.type === 'switch' ? (
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={Boolean(values[f.name])}
                          onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.checked }))}
                          className="h-4 w-4 rounded border-input accent-primary"
                        />
                        {f.label}
                      </label>
                    ) : (
                      <>
                        <Label htmlFor={f.name}>
                          {f.label}
                          {f.required ? <span className="text-destructive"> *</span> : null}
                        </Label>
                        {f.type === 'textarea' ? (
                          <Textarea
                            id={f.name}
                            value={String(values[f.name] ?? '')}
                            placeholder={f.placeholder}
                            required={f.required}
                            onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                          />
                        ) : f.type === 'select' ? (
                          <SelectNative
                            id={f.name}
                            value={String(values[f.name] ?? '')}
                            required={f.required}
                            onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                          >
                            <option value="">— Seleccione —</option>
                            {f.options?.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </SelectNative>
                        ) : (
                          <Input
                            id={f.name}
                            type={f.type === 'number' ? 'number' : 'text'}
                            step="any"
                            value={String(values[f.name] ?? '')}
                            placeholder={f.placeholder}
                            required={f.required}
                            onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                          />
                        )}
                        {f.help ? <p className="text-xs text-muted-foreground">{f.help}</p> : null}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? 'Guardando…' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{deleteLabel} {entityLabel}</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. ¿Desea continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={pending}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={pending}>
              {pending ? 'Eliminando…' : deleteLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
