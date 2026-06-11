import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useOrderDetail } from '../../hooks/use-orders'
import { formatCurrency, formatDate } from '../../lib/utils/format'
import {
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  PRINT_TYPE_LABEL,
  PAPER_SIZE_LABEL,
} from '../../lib/constants'
import * as queries from '../../lib/supabase/queries'
import Badge from '../../components/ui/Badge'
import FileList from '../../components/features/FileList'

const statusTransitions = {
  menunggu: 'diproses',
  diproses: 'selesai',
  selesai: null,
}

function statusBadgeVariant(status) {
  if (status === 'menunggu') return 'warning'
  if (status === 'diproses') return 'info'
  if (status === 'selesai') return 'success'
  return 'default'
}

export default function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { order, loading } = useOrderDetail(id)
  const [updating, setUpdating] = useState(false)

  async function handleStatusUpdate() {
    if (!order || !statusTransitions[order.status]) return
    setUpdating(true)
    try {
      await queries.updateOrderStatus(id, statusTransitions[order.status])
      window.location.reload()
    } catch (e) {
      console.error(e)
    } finally {
      setUpdating(false)
    }
  }

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
      </div>
    )
  }

  const nextStatus = statusTransitions[order.status]

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-muted hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </button>

      <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <p className="text-muted text-sm">Nomor Antrian</p>
          <p className="font-heading text-primary text-3xl font-bold">
            {order.queue_number}
          </p>
          <p className="text-muted mt-1 text-sm">
            {order.users?.name} &middot; {order.users?.phone}
          </p>
        </div>
        <div className="text-right">
          <Badge variant={statusBadgeVariant(order.status)}>
            {ORDER_STATUS_LABEL[order.status]}
          </Badge>

          {nextStatus && (
            <button
              onClick={handleStatusUpdate}
              disabled={updating}
              className="bg-primary hover:bg-primary-dark disabled:bg-muted mt-3 block w-full rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed"
            >
              {updating
                ? 'Memproses...'
                : `Tandai ${ORDER_STATUS_LABEL[nextStatus]}`}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
              <dt className="text-muted">Jumlah Halaman</dt>
              <dd className="font-medium">{order.pages}</dd>
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

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-heading mb-4 text-lg font-semibold">Pembayaran</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Metode</dt>
              <dd className="font-medium">{PAYMENT_METHOD_LABEL[order.payment_method]}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Status</dt>
              <dd>
                {order.payment_method === 'qris' ? (
                  <Badge
                    variant={
                      order.payment_status === 'lunas'
                        ? 'success'
                        : order.payment_status === 'menunggu_verifikasi'
                          ? 'warning'
                          : 'default'
                    }
                  >
                    {PAYMENT_STATUS_LABEL[order.payment_status]}
                  </Badge>
                ) : (
                  <span className="font-medium">&mdash;</span>
                )}
              </dd>
            </div>
          </dl>

          {order.payments?.[0]?.proof_image && (
            <div className="mt-4 border-t pt-4">
              <p className="mb-2 text-sm font-medium">Bukti Pembayaran</p>
              <a
                href={order.payments[0].public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline"
              >
                Lihat Bukti
              </a>
            </div>
          )}

          {order.payments?.[0]?.rejection_note && (
            <div className="mt-4 border-t pt-4">
              <p className="text-sm text-red-600">
                Catatan tolak: {order.payments[0].rejection_note}
              </p>
            </div>
          )}
        </div>
      </div>

      <FileList files={order.order_files} />
    </div>
  )
}