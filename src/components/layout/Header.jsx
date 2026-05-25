import { Link, useLocation } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { cn } from '../../lib/utils/cn'

export default function Header({ variant = 'public', navItems, onLogout }) {
  const loc = useLocation()
  const currentPath = loc?.pathname || '/'

  const renderNav = () => (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {navItems?.map((item) => {
        const Icon = item.icon
        const isActive = currentPath === item.to
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors',
              isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:text-primary'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        )
      })}
      {onLogout && (
        <button
          onClick={onLogout}
          className="text-muted hover:text-error ml-2 flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      )}
    </nav>
  )

  if (variant === 'public') {
    return (
      <header className="border-outline border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="PrinNes" className="h-5 w-5" />
            <span className="font-heading font-bold text-primary">PrinNes</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-muted hover:text-primary">Masuk</Link>
            <Link to="/register" className="text-sm font-medium text-primary">Daftar</Link>
          </nav>
        </div>
      </header>
    )
  }

  if (variant === 'customer') {
    return (
      <header className="border-outline sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/logo.svg" alt="PrinNes" className="h-5 w-5" />
            <span className="font-heading font-bold text-primary">PrinNes</span>
          </Link>
          {renderNav()}
        </div>
      </header>
    )
  }

  if (variant === 'admin') {
    return (
      <header className="border-outline border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <img src="/logo.svg" alt="PrinNes" className="h-5 w-5" />
            <span className="font-heading font-bold text-primary">PrinNes</span>
          </Link>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-muted hover:text-error flex items-center gap-1.5 text-sm transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          )}
        </div>
      </header>
    )
  }

  return null
}