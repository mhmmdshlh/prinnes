import { History as HistoryIcon } from 'lucide-react'
import { useOrders } from '../../hooks/use-orders'
import { formatCurrency, formatDateShort } from '../../lib/utils/format'
import { ORDER_STATUS_LABEL, PRINT_TYPE_LABEL, PAPER_SIZE_LABEL } from '../../lib/constants'

export default function History() {
  const { orders, loading } = useOrders()

  const completedOrders = orders.filter((o) =>
    ['selesai', 'siap_diambil'].includes(o.status)
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
      <h1 className="font-heading text-2xl font-bold">Riwayat Pesanan</h1>

      {completedOrders.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <HistoryIcon className="text-muted h-16 w-16" />
          <p className="text-muted mt-4">Belum ada riwayat pesanan</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 font-medium">Antrian</th>
                <th className="px-4 py-3 font-medium">Spesifikasi</th>
                <th className="px-4 py-3 font-medium">Biaya</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {completedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-surface/50 cursor-pointer"
                  onClick={() => window.location.href = `/riwayat/${order.id}`}
                >
                  <td className="px-4 py-3 font-medium">
                    {order.queue_number}
                  </td>
                  <td className="text-muted px-4 py-3">
                    {PRINT_TYPE_LABEL[order.print_type]} &middot;{' '}
                    {PAPER_SIZE_LABEL[order.paper_size]}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatCurrency(order.total_price)}
                  </td>
                  <td className="text-muted px-4 py-3">
                    {formatDateShort(order.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === 'selesai'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
