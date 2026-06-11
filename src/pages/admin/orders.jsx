import { useNavigate } from 'react-router-dom'
import { useAllOrders } from '../../hooks/use-orders'
import { formatCurrency, formatDate } from '../../lib/utils/format'
import { PRINT_TYPE_LABEL, PAPER_SIZE_LABEL } from '../../lib/constants'

export default function AdminOrders() {
  const { orders, loading } = useAllOrders({ status: 'selesai' })
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Riwayat Pesanan</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 font-medium">Antrian</th>
                <th className="px-4 py-3 font-medium">Pelanggan</th>
                <th className="px-4 py-3 font-medium">Spesifikasi</th>
                <th className="px-4 py-3 font-medium">Biaya</th>
                <th className="px-4 py-3 font-medium">Pembayaran</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/admin/pesanan/${order.id}`)}
                  className="transition-shadow hover:bg-gray-200 cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium">{order.queue_number}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.users?.name}</p>
                    <p className="text-muted text-xs">{order.users?.phone}</p>
                  </td>
                  <td className="text-muted px-4 py-3">
                    {PRINT_TYPE_LABEL[order.print_type]} &middot;{' '}
                    {PAPER_SIZE_LABEL[order.paper_size]} &middot; {order.copies}x
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatCurrency(order.total_price)}
                  </td>
                  <td className="px-4 py-3">
                    {order.payment_method === 'qris' ? 'QRIS' : 'Tunai'}
                  </td>
                  <td className="text-muted px-4 py-3 text-xs">
                    {formatDate(order.created_at)}
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