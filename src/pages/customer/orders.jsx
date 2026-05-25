import { Link } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { useOrders } from '../../hooks/use-orders'
import EmptyState from '../../components/ui/EmptyState'
import OrderItem from '../../components/features/OrderItem'

export default function Orders() {
  const { orders, loading } = useOrders()

  const activeOrders = orders.filter((o) =>
    ['menunggu', 'diproses'].includes(o.status)
  )

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Pesanan Aktif</h1>

      {activeOrders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Tidak ada pesanan aktif"
          action={
            <Link
              to="/pesanan/buat"
              className="text-primary mt-2 text-sm font-medium hover:underline"
            >
              Buat pesanan baru
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {activeOrders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}