import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  History,
  User,
} from 'lucide-react'
import { useAuthActions } from '../hooks/use-auth'
import Header from '../components/layout/Header'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pesanan/buat', label: 'Pesanan Baru', icon: PlusCircle },
  { to: '/pesanan', label: 'Pesanan Aktif', icon: ClipboardList },
  { to: '/riwayat', label: 'Riwayat', icon: History },
  { to: '/profil', label: 'Profil', icon: User },
]

export default function CustomerLayout() {
  const { logout } = useAuthActions()

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="customer" navItems={navItems} onLogout={logout} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}