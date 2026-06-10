import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
        <footer className="border-t border-border px-6 py-4 text-xs text-muted-foreground">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p>
              Inzillo MES · División Engranajes Cónicos · v1.0
            </p>
            <p className="font-mono">
              {user.nombre} {user.apellido} — {user.perfil}
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
