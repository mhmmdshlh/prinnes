import { Link } from 'react-router-dom'
import { ClipboardList, Clock } from 'lucide-react'
import { useOrders } from '../../hooks/use-orders'
import { formatCurrency, formatDate } from '../../lib/utils/format'
import { ORDER_STATUS_LABEL, PRINT_TYPE_LABEL, PAPER_SIZE_LABEL } from '../../lib/constants'

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
        <div className="flex flex-col items-center py-16 text-center">
          <ClipboardList className="text-muted h-16 w-16" />
          <p className="text-muted mt-4">Tidak ada pesanan aktif</p>
          <Link
            to="/pesanan/buat"
            className="text-primary mt-2 text-sm font-medium hover:underline"
          >
            Buat pesanan baru
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {activeOrders.map((order) => (
            <Link
              key={order.id}
              to={`/pesanan/${order.id}`}
              className="border-outline hover:border-primary block rounded-xl border bg-white p-4 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-primary text-lg font-bold">
                      {order.queue_number}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === 'menunggu'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <p className="text-muted mt-1 text-sm">
                    {PRINT_TYPE_LABEL[order.print_type]} &middot;{' '}
                    {PAPER_SIZE_LABEL[order.paper_size]} &middot;{' '}
                    {order.copies} copy &middot;{' '}
                    {formatCurrency(order.total_price)}
                  </p>
                  <p className="text-muted mt-0.5 text-xs">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <Clock className="text-muted h-5 w-5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
