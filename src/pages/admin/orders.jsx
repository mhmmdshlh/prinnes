import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAllOrders } from '../../hooks/use-orders'
import { formatCurrency, formatDate } from '../../lib/utils/format'
import {
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  PRINT_TYPE_LABEL,
  PAPER_SIZE_LABEL,
} from '../../lib/constants'

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState('')
  const { orders, loading, refetch } = useAllOrders(
    statusFilter ? { status: statusFilter } : {}
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Semua Pesanan</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border-outline rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">Semua Status</option>
          <option value="menunggu">Menunggu</option>
          <option value="diproses">Diproses</option>
          <option value="selesai">Selesai</option>
          <option value="siap_diambil">Siap Diambil</option>
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
                  className="hover:bg-surface/50 cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/admin/pesanan/${order.id}`)
                  }
                >
                  <td className="px-4 py-3 font-medium">
                    {order.queue_number}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.users?.name}</p>
                    <p className="text-muted text-xs">{order.users?.phone}</p>
                  </td>
                  <td className="text-muted px-4 py-3">
                    {PRINT_TYPE_LABEL[order.print_type]} &middot;{' '}
                    {PAPER_SIZE_LABEL[order.paper_size]} &middot;{' '}
                    {order.copies}x
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatCurrency(order.total_price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.payment_status === 'lunas'
                          ? 'bg-green-100 text-green-800'
                          : order.payment_status === 'menunggu_verifikasi'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.payment_status === 'ditolak'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {PAYMENT_STATUS_LABEL[order.payment_status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === 'menunggu'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'diproses'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'selesai'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
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
