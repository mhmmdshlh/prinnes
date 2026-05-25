import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useOrderDetail } from '../../hooks/use-orders'
import { formatCurrency, formatDate, formatFileSize } from '../../lib/utils/format'
import {
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  PRINT_TYPE_LABEL,
  PAPER_SIZE_LABEL,
} from '../../lib/constants'

export default function HistoryDetail() {
  const { id } = useParams()
  const { order, loading } = useOrderDetail(id)

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">Pesanan tidak ditemukan</p>
        <Link to="/riwayat" className="text-primary mt-2 inline-block text-sm hover:underline">
          Kembali
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/riwayat"
        className="text-muted hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Link>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted text-sm">Nomor Antrian</p>
            <p className="font-heading text-primary text-3xl font-bold">
              {order.queue_number}
            </p>
          </div>
          <span className="bg-green-100 text-green-800 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
            {ORDER_STATUS_LABEL[order.status]}
          </span>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-heading mb-4 text-lg font-semibold">
          Detail Pesanan
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Jenis Cetak</dt>
            <dd className="font-medium">
              {PRINT_TYPE_LABEL[order.print_type]}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Ukuran Kertas</dt>
            <dd className="font-medium">
              {PAPER_SIZE_LABEL[order.paper_size]}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Jumlah Copy</dt>
            <dd className="font-medium">{order.copies}x</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Total Biaya</dt>
            <dd className="font-heading text-primary text-lg font-bold">
              {formatCurrency(order.total_price)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Pembayaran</dt>
            <dd className="font-medium">
              {PAYMENT_METHOD_LABEL[order.payment_method]} &middot;{' '}
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  order.payment_status === 'lunas'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {PAYMENT_STATUS_LABEL[order.payment_status]}
              </span>
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Dibuat</dt>
            <dd className="font-medium">{formatDate(order.created_at)}</dd>
          </div>
        </dl>
      </div>

      {order.order_files?.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-heading mb-4 text-lg font-semibold">
            File Dokumen
          </h2>
          <div className="space-y-2">
            {order.order_files.map((file) => (
              <div
                key={file.id}
                className="border-outline flex items-center justify-between rounded-lg border p-3"
              >
                <p className="text-sm font-medium">{file.file_name}</p>
                <p className="text-muted text-xs">
                  {formatFileSize(file.file_size)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
