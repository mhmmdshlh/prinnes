import { Link } from 'react-router-dom'
import { Clock, AlertTriangle } from 'lucide-react'
import { ORDER_STATUS_LABEL, PRINT_TYPE_LABEL, PAPER_SIZE_LABEL, PAYMENT_STATUS_LABEL } from '../../lib/constants'
import Badge from '../ui/Badge'

const paymentBadgeVariant = {
  menunggu_verifikasi: 'warning',
  ditolak: 'error',
  lunas: 'success',
}

export default function OrderItem({ order, showUser = false }) {
  const showPayment =
    order.payment_method === 'qris' &&
    order.payment_status &&
    order.payment_status !== 'belum_dibayar'

  return (
    <Link
      to={`/pesanan/${order.id}`}
      className="border-outline hover:border-primary block rounded-xl border bg-white p-4 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="font-heading text-primary text-lg font-bold">
            {order.queue_number}
          </span>
          {showUser && order.users?.name && (
            <p className="text-muted mt-0.5 text-sm">{order.users.name}</p>
          )}
          <p className="text-muted mt-1 text-sm">
            {PRINT_TYPE_LABEL[order.print_type] || order.print_type} &middot;{' '}
            {PAPER_SIZE_LABEL[order.paper_size] || order.paper_size} &middot;{' '}
            {order.pages} hlm &middot; {order.copies} copy
            {order.total_price && ` · ${new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(order.total_price)}`}
          </p>
          {order.created_at && (
            <p className="text-muted mt-0.5 text-xs">
              {new Date(order.created_at).toLocaleDateString('id-ID')}
            </p>
          )}
          {showPayment && (
            <div className="mt-1.5">
              <Badge variant={paymentBadgeVariant[order.payment_status] || 'default'}>
                {PAYMENT_STATUS_LABEL[order.payment_status]}
              </Badge>
              {order.payment_status === 'ditolak' && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  Pembayaran bermasalah
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Clock className="text-muted h-4 w-4" />
          <span className="text-sm font-medium capitalize">
            {ORDER_STATUS_LABEL[order.status] || order.status}
          </span>
        </div>
      </div>
    </Link>
  )
}