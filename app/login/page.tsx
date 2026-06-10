import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/login-form'

export default async function LoginPage() {
  const session = await getSession()
  if (session) redirect('/dashboard')

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <LoginForm />
      </div>
      <div className="relative hidden lg:block">
        <img
          src="/images/factory-floor.png"
          alt="Planta de fabricación de engranajes cónicos"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar/90 via-sidebar/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-10">
          <p className="font-mono text-sm uppercase tracking-widest text-accent">Bevel Gear Division</p>
          <h2 className="mt-2 max-w-md text-balance text-3xl font-bold text-white">
            Control total del piso de planta, en tiempo real.
          </h2>
          <p className="mt-3 max-w-md text-pretty text-sm text-white/70">
            Trazabilidad de lotes, ejecución de órdenes de trabajo y métricas de producción para la
            fabricación de engranajes cónicos.
          </p>
        </div>
      </div>
    </main>
  )
}
