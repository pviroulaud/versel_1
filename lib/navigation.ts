import {
  LayoutDashboard,
  ClipboardList,
  Boxes,
  Factory,
  Users,
  Truck,
  Wrench,
  Cog,
  Package,
  Send,
  UserCog,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  adminOnly?: boolean
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'General',
    items: [{ title: 'Tablero', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Producción',
    items: [
      { title: 'Órdenes de trabajo', href: '/ordenes', icon: ClipboardList },
      { title: 'Servicios externos', href: '/remitos', icon: Send },
    ],
  },
  {
    label: 'Inventario',
    items: [
      { title: 'Stock / Materia prima', href: '/stock', icon: Boxes },
      { title: 'Productos', href: '/productos', icon: Package },
    ],
  },
  {
    label: 'Configuración',
    items: [
      { title: 'Operaciones', href: '/operaciones', icon: Cog },
      { title: 'Máquinas', href: '/maquinas', icon: Factory },
      { title: 'Clientes', href: '/clientes', icon: Users },
      { title: 'Proveedores', href: '/proveedores', icon: Truck },
      { title: 'Servicios', href: '/servicios', icon: Wrench },
      { title: 'Usuarios', href: '/usuarios', icon: UserCog, adminOnly: true },
    ],
  },
]

export const brandIcon = Cog
