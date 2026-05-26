import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  ListOrdered,
  CreditCard,
  DollarSign,
  LogOut,
} from 'lucide-react'
import { useAuthActions } from '../hooks/use-auth'
import { cn } from '../lib/utils/cn'

const sidebarItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/pesanan', label: 'Pesanan', icon: ClipboardList },
  { to: '/admin/antrian', label: 'Antrian', icon: ListOrdered },
  { to: '/admin/pembayaran', label: 'Verifikasi QRIS', icon: CreditCard },
  { to: '/admin/harga', label: 'Kelola Harga', icon: DollarSign },
]

export default function AdminLayout() {
  const location = useLocation()
  const { logout } = useAuthActions()

  return (
    <div className="flex min-h-screen">
      <aside className="border-outline hidden w-64 flex-shrink-0 border-r bg-white md:flex md:flex-col">
        <div className="border-outline flex h-16 items-center gap-2 border-b px-6">
          <img src="/logo.svg" alt="PrinNes" className="h-6 w-auto" />
          <span className="font-heading text-lg font-bold text-primary">
            PrinNes Admin
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-muted hover:bg-surface hover:text-primary'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-outline border-t p-4">
          <button
            onClick={logout}
            className="text-muted hover:text-error flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-outline flex h-16 items-center justify-between border-b bg-white px-6 md:hidden">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <img src="/logo.svg" alt="PrinNes" className="h-5 w-auto" />
            <span className="font-heading font-bold text-primary">
              PrinNes Admin
            </span>
          </Link>
          <button
            onClick={logout}
            className="text-muted hover:text-error transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        <nav className="border-outline flex gap-2 overflow-x-auto border-b bg-white px-4 py-2 md:hidden">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:text-primary'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <main className="flex-1 bg-surface p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
