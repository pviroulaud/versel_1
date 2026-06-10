'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Fragment } from 'react'
import { navGroups } from '@/lib/navigation'
import type { SessionUser } from '@/lib/auth'
import { MobileNav } from '@/components/mobile-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { logoutAction } from '@/app/actions/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, LogOut } from 'lucide-react'

const allItems = navGroups.flatMap((g) => g.items)

function useCrumbs(pathname: string) {
  const match = allItems.find((i) => pathname === i.href || pathname.startsWith(i.href + '/'))
  const title = match?.title ?? 'Inicio'
  return { title }
}

export function Header({ user }: { user: SessionUser }) {
  const pathname = usePathname()
  const { title } = useCrumbs(pathname)
  const initials = (user.nombre[0] ?? '') + (user.apellido[0] ?? '')

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <MobileNav user={user} />

      <nav aria-label="Migas de pan" className="flex items-center gap-1.5 text-sm">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
          Inicio
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <span className="font-medium text-foreground">{title}</span>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                  {initials.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium leading-tight">
                  {user.nombre} {user.apellido}
                </p>
                <p className="font-mono text-[11px] leading-tight text-muted-foreground">
                  #{user.legajo}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <span>
                  {user.nombre} {user.apellido}
                </span>
                <Badge
                  variant={user.perfil === 'Administrador' ? 'default' : 'secondary'}
                  className="w-fit text-[10px]"
                >
                  {user.perfil}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action={logoutAction}>
              <button type="submit" className="w-full">
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer text-destructive focus:text-destructive"
                  asChild
                >
                  <span className="flex w-full items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </span>
                </DropdownMenuItem>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Fragment />
    </header>
  )
}
