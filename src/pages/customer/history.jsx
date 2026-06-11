import { useNavigate } from 'react-router-dom'
import { History as HistoryIcon } from 'lucide-react'
import { useOrders } from '../../hooks/use-orders'
import { formatCurrency, formatDateShort } from '../../lib/utils/format'
import { ORDER_STATUS_LABEL, PRINT_TYPE_LABEL, PAPER_SIZE_LABEL } from '../../lib/constants'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'

export default function History() {
  const { orders, loading } = useOrders()
  const navigate = useNavigate()

  const completedOrders = orders.filter((o) =>
    o.status === 'selesai'
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
        <EmptyState icon={HistoryIcon} title="Belum ada riwayat pesanan" />
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
                  onClick={() => navigate(`/riwayat/${order.id}`)}
                  className="hover:bg-surface/50 cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium">{order.queue_number}</td>
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
                    <Badge
                      variant={order.status === 'selesai' ? 'primary' : 'success'}
                    >
                      {ORDER_STATUS_LABEL[order.status]}
                    </Badge>
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