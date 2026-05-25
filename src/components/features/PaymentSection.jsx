import { useState } from 'react'
import { Upload } from 'lucide-react'
import { formatCurrency } from '../../lib/utils/format'
import * as queries from '../../lib/supabase/queries'
import Badge from '../ui/Badge'

export default function PaymentSection({ order }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleProofUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 5 MB')
      return
    }

    setUploading(true)
    setUploadError('')
    try {
      await queries.uploadPaymentProof(order.id, file)
      window.location.reload()
    } catch (err) {
      setUploadError(err.message || 'Gagal upload bukti')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="font-heading mb-4 text-lg font-semibold">Pembayaran</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Metode</span>
          <dd className="font-medium">
            {order.payment_method === 'toko' ? 'Bayar di Toko' : 'QRIS'}
          </dd>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Status</span>
          <Badge
            variant={
              order.payment_status === 'lunas'
                ? 'success'
                : order.payment_status === 'menunggu_verifikasi'
                  ? 'warning'
                  : order.payment_status === 'ditolak'
                    ? 'error'
                    : 'default'
            }
          >
            {order.payment_status === 'lunas'
              ? 'Lunas'
              : order.payment_status === 'menunggu_verifikasi'
                ? 'Menunggu Verifikasi'
                : order.payment_status === 'ditolak'
                  ? 'Ditolak'
                  : 'Belum Dibayar'}
          </Badge>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="font-medium">Total</span>
          <span className="font-heading text-primary text-lg font-bold">
            {formatCurrency(order.total_price)}
          </span>
        </div>
      </div>

      {order.payment_method === 'qris' && order.payment_status !== 'lunas' && (
        <div className="mt-4 border-t pt-4">
          {order.payment_status === 'ditolak' && (
            <p className="mb-3 text-sm text-red-600">
              {order.payments?.[0]?.rejection_note
                ? `Ditolak: ${order.payments[0].rejection_note}`
                : 'Pembayaran ditolak. Upload ulang bukti.'}
            </p>
          )}

          <p className="text-muted mb-3 text-sm">
            Scan QR code berikut untuk melakukan pembayaran, lalu upload bukti transfer.
          </p>

          <div className="bg-surface mb-4 flex items-center justify-center rounded-lg p-6">
            <div className="flex h-40 w-40 items-center justify-center border-2 border-dashed border-gray-300">
              <p className="text-muted text-center text-xs">
                QR Code<br />(Tempel di sini)
              </p>
            </div>
          </div>

          {uploadError && <p className="mb-3 text-sm text-red-500">{uploadError}</p>}

          <label className="bg-primary hover:bg-primary-dark inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors">
            <Upload className="h-4 w-4" />
            {uploading ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleProofUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  )
}