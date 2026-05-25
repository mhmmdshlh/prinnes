import { Link, Outlet } from 'react-router-dom'
import { Printer } from 'lucide-react'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-outline border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Printer className="h-6 w-6 text-primary" />
            <span className="font-heading text-xl font-bold text-primary">
              PrinNes
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-body text-muted hover:text-primary transition-colors"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              Daftar
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-outline border-t py-6 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} PrinNes &mdash; UNNES</p>
      </footer>
    </div>
  )
}
