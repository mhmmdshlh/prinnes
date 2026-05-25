import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useOrderDetail } from '../../hooks/use-orders'
import { formatCurrency, formatDate } from '../../lib/utils/format'
import {
  ORDER_STATUS_LABEL,
  PRINT_TYPE_LABEL,
  PAPER_SIZE_LABEL,
} from '../../lib/constants'
import Badge from '../../components/ui/Badge'
import OrderStatusSteps from '../../components/features/OrderStatusSteps'
import FileList from '../../components/features/FileList'
import PaymentSection from '../../components/features/PaymentSection'

export default function OrderDetail() {
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
        <Link to="/pesanan" className="text-primary mt-2 inline-block text-sm hover:underline">
          Kembali
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/pesanan"
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
          <Badge
            variant={
              order.status === 'menunggu'
                ? 'warning'
                : order.status === 'diproses'
                  ? 'info'
                  : order.status === 'selesai'
                    ? 'primary'
                    : 'success'
            }
          >
            {ORDER_STATUS_LABEL[order.status]}
          </Badge>
        </div>

        <div className="mt-6">
          <OrderStatusSteps status={order.status} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-heading mb-4 text-lg font-semibold">Detail Pesanan</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Jenis Cetak</dt>
              <dd className="font-medium">{PRINT_TYPE_LABEL[order.print_type]}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Ukuran Kertas</dt>
              <dd className="font-medium">{PAPER_SIZE_LABEL[order.paper_size]}</dd>
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
            {order.notes && (
              <div className="flex justify-between">
                <dt className="text-muted">Catatan</dt>
                <dd className="max-w-xs text-right font-medium">{order.notes}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Dibuat</dt>
              <dd className="font-medium">{formatDate(order.created_at)}</dd>
            </div>
          </dl>
        </div>

        <FileList files={order.order_files} />
        <PaymentSection order={order} />
      </div>
    </div>
  )
}