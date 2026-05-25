import { Link } from 'react-router-dom'
import { PlusCircle, ClipboardList } from 'lucide-react'
import { useAuth } from '../../hooks/use-auth-context'
import { useActiveOrders } from '../../hooks/use-orders'
import EmptyState from '../../components/ui/EmptyState'
import OrderItem from '../../components/features/OrderItem'

export default function CustomerDashboard() {
  const { profile } = useAuth()
  const { orders, loading } = useActiveOrders()

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">
          Halo, {profile?.name}
        </h1>
        <p className="text-muted mt-1">Selamat datang di PrinNes</p>
      </div>

      <Link
        to="/pesanan/buat"
        className="bg-primary hover:bg-primary-dark flex items-center justify-center gap-3 rounded-xl px-6 py-5 text-white transition-colors"
      >
        <PlusCircle className="h-6 w-6" />
        <span className="font-heading text-lg font-semibold">
          Buat Pesanan Baru
        </span>
      </Link>

      <section>
        <h2 className="font-heading mb-4 text-lg font-semibold">
          Pesanan Aktif
        </h2>
        {orders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Belum ada pesanan aktif"
            action={
              <Link
                to="/pesanan/buat"
                className="text-primary mt-2 text-sm font-medium hover:underline"
              >
                Buat pesanan sekarang
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}