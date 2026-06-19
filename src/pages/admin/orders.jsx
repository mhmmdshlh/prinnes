import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter } from 'lucide-react'
import { useAllOrders } from '../../hooks/use-orders'
import { formatCurrency, formatDate } from '../../lib/utils/format'
import { PRINT_TYPE_LABEL, PAPER_SIZE_LABEL, PAYMENT_METHOD_LABEL } from '../../lib/constants'

const paymentOptions = [
  { value: '', label: 'Semua' },
  { value: 'qris', label: 'QRIS' },
  { value: 'toko', label: 'Bayar di Toko' },
]

export default function AdminOrders() {
  const [showFilter, setShowFilter] = useState(false)
  const [localPaymentMethod, setLocalPaymentMethod] = useState('')
  const [localStartDate, setLocalStartDate] = useState('')
  const [localEndDate, setLocalEndDate] = useState('')
  const [appliedPaymentMethod, setAppliedPaymentMethod] = useState('')
  const [appliedStartDate, setAppliedStartDate] = useState('')
  const [appliedEndDate, setAppliedEndDate] = useState('')

  const filters = {
    status: 'selesai',
    ...(appliedPaymentMethod && { payment_method: appliedPaymentMethod }),
    ...(appliedStartDate && { startDate: new Date(appliedStartDate).toISOString() }),
    ...(appliedEndDate && { endDate: new Date(appliedEndDate + 'T23:59:59').toISOString() }),
  }

  const { orders, loading } = useAllOrders(filters)
  const navigate = useNavigate()

  const activeFilterCount =
    (appliedPaymentMethod ? 1 : 0) + (appliedStartDate || appliedEndDate ? 1 : 0)

  function openFilter() {
    setLocalPaymentMethod(appliedPaymentMethod)
    setLocalStartDate(appliedStartDate)
    setLocalEndDate(appliedEndDate)
    setShowFilter(true)
  }

  function handleReset() {
    setLocalPaymentMethod('')
    setLocalStartDate('')
    setLocalEndDate('')
    setAppliedPaymentMethod('')
    setAppliedStartDate('')
    setAppliedEndDate('')
  }

  function handleApply() {
    setAppliedPaymentMethod(localPaymentMethod)
    setAppliedStartDate(localStartDate)
    setAppliedEndDate(localEndDate)
    setShowFilter(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Riwayat Pesanan</h1>
        <button
          onClick={showFilter ? () => setShowFilter(false) : openFilter}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            showFilter || activeFilterCount > 0
              ? 'bg-primary text-white'
              : 'bg-white text-muted hover:bg-surface border border-gray-200'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filter
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {showFilter && (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted">Pembayaran</p>
              <div className="flex gap-1">
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLocalPaymentMethod(opt.value)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      localPaymentMethod === opt.value
                        ? 'bg-primary text-white'
                        : 'bg-surface text-muted hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted">Tanggal</p>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={localStartDate}
                  onChange={(e) => setLocalStartDate(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-primary"
                />
                <span className="text-muted text-sm">—</span>
                <input
                  type="date"
                  value={localEndDate}
                  onChange={(e) => setLocalEndDate(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleApply}
                className="bg-primary hover:bg-primary-dark rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-colors"
              >
                Terapkan
              </button>
              {(localPaymentMethod || localStartDate || localEndDate) && (
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-surface"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
                  className="cursor-pointer transition-shadow hover:bg-gray-200"
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
                    {PAYMENT_METHOD_LABEL[order.payment_method] || order.payment_method}
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