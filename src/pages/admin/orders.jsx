import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllOrders } from '../../hooks/use-orders'
import { formatCurrency, formatDate } from '../../lib/utils/format'
import {
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  PRINT_TYPE_LABEL,
  PAPER_SIZE_LABEL,
} from '../../lib/constants'
import Badge from '../../components/ui/Badge'

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'menunggu', label: 'Menunggu' },
  { value: 'diproses', label: 'Diproses' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'siap_diambil', label: 'Siap Diambil' },
]

function statusBadgeVariant(status) {
  if (status === 'menunggu') return 'warning'
  if (status === 'diproses') return 'info'
  if (status === 'selesai') return 'primary'
  if (status === 'siap_diambil') return 'success'
  return 'default'
}

function paymentBadgeVariant(paymentStatus) {
  if (paymentStatus === 'lunas') return 'success'
  if (paymentStatus === 'menunggu_verifikasi') return 'warning'
  if (paymentStatus === 'ditolak') return 'error'
  return 'default'
}

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState('')
  const { orders, loading } = useAllOrders(
    statusFilter ? { status: statusFilter } : {}
  )
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Semua Pesanan</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border-outline rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
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
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/admin/pesanan/${order.id}`)}
                  className="hover:bg-surface/50 cursor-pointer"
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
                    <Badge variant={paymentBadgeVariant(order.payment_status)}>
                      {PAYMENT_STATUS_LABEL[order.payment_status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant(order.status)}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </Badge>
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