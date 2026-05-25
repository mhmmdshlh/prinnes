import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  History,
  User,
  LogOut,
  Printer,
} from 'lucide-react'
import { useAuthActions } from '../hooks/use-auth'
import { cn } from '../lib/utils/cn'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pesanan/buat', label: 'Pesanan Baru', icon: PlusCircle },
  { to: '/pesanan', label: 'Pesanan Aktif', icon: ClipboardList },
  { to: '/riwayat', label: 'Riwayat', icon: History },
  { to: '/profil', label: 'Profil', icon: User },
]

export default function CustomerLayout() {
  const location = useLocation()
  const { logout } = useAuthActions()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-outline sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-primary">
              PrinNes
            </span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted hover:text-primary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
            <button
              onClick={logout}
              className="text-muted hover:text-error ml-2 flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
