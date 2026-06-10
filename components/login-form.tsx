'use client'

import { useActionState, useState } from 'react'
import { loginAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Cog, IdCard, ScanLine, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Modo = 'legajo' | 'rfid'

export function LoginForm() {
  const [modo, setModo] = useState<Modo>('legajo')
  const [state, formAction, pending] = useActionState(loginAction, null as { error?: string } | null)

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Cog className="h-7 w-7" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-mono text-xl font-bold tracking-tight text-foreground">INZILLO MES</h1>
          <p className="text-sm text-muted-foreground">Sistema de Ejecución de Manufactura</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-card-foreground">Iniciar sesión</h2>
        <p className="mt-1 text-sm text-muted-foreground">Acceda con su legajo o tarjeta RFID.</p>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-md bg-muted p-1">
          <button
            type="button"
            onClick={() => setModo('legajo')}
            className={cn(
              'flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors',
              modo === 'legajo'
                ? 'bg-card text-card-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <IdCard className="h-4 w-4" /> Legajo
          </button>
          <button
            type="button"
            onClick={() => setModo('rfid')}
            className={cn(
              'flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors',
              modo === 'rfid'
                ? 'bg-card text-card-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <ScanLine className="h-4 w-4" /> RFID
          </button>
        </div>

        <form action={formAction} className="mt-5 flex flex-col gap-4">
          <input type="hidden" name="modo" value={modo} />

          {modo === 'legajo' ? (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="legajo">Número de legajo</Label>
                <Input
                  id="legajo"
                  name="legajo"
                  inputMode="numeric"
                  placeholder="Ej. 1001"
                  autoComplete="off"
                  className="font-mono"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  name="pin"
                  type="password"
                  inputMode="numeric"
                  placeholder="••••"
                  autoComplete="off"
                  className="font-mono"
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Label htmlFor="rfid">Tarjeta RFID</Label>
              <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border bg-muted/40 px-4 py-6 text-center">
                <ScanLine className="h-8 w-8 text-accent" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Acerque la tarjeta o ingrese el código.</p>
                <Input
                  id="rfid"
                  name="rfid"
                  placeholder="RF-XXXX-000"
                  autoComplete="off"
                  className="text-center font-mono"
                  autoFocus
                />
              </div>
            </div>
          )}

          {state?.error ? (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          ) : null}

          <Button type="submit" disabled={pending} className="mt-1 w-full">
            {pending ? 'Verificando…' : 'Ingresar'}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Demo — Admin: legajo <span className="font-mono text-foreground">1001</span> / PIN{' '}
        <span className="font-mono text-foreground">1234</span> · Operador:{' '}
        <span className="font-mono text-foreground">2001</span> / PIN{' '}
        <span className="font-mono text-foreground">1111</span>
      </p>
    </div>
  )
}
