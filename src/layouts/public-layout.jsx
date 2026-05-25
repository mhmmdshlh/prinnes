import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="public" />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-outline border-t py-6 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} PrinNes &mdash; UNNES</p>
      </footer>
    </div>
  )
}