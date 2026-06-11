import { useState } from 'react'
import { Upload } from 'lucide-react'
import { formatCurrency } from '../../lib/utils/format'
import * as queries from '../../lib/supabase/queries'
import { supabase } from '../../lib/supabase/client'
import Badge from '../ui/Badge'

export default function PaymentSection({ order }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status)
  const [proofUrl, setProofUrl] = useState(
    () => order.payments?.[0]?.proof_image
      ? supabase.storage.from('payment-proofs').getPublicUrl(order.payments[0].proof_image).data.publicUrl
      : null
  )

  const canEdit = paymentStatus !== 'lunas'

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
      const result = await queries.uploadPaymentProof(order.id, file)
      setProofUrl(result.public_url)
      setPaymentStatus('menunggu_verifikasi')
    } catch (err) {
      setUploadError(err.message || 'Gagal upload bukti')
    } finally {
      setUploading(false)
    }
  }

  const canShowUpload = order.payment_method === 'qris' && canEdit

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
        {order.payment_method === 'qris' && (
          <div className="flex justify-between">
            <span className="text-muted">Status</span>
            <Badge
              variant={
                paymentStatus === 'lunas'
                  ? 'success'
                  : paymentStatus === 'menunggu_verifikasi'
                    ? 'warning'
                    : paymentStatus === 'ditolak'
                      ? 'error'
                      : 'default'
              }
            >
              {paymentStatus === 'lunas'
                ? 'Lunas'
                : paymentStatus === 'menunggu_verifikasi'
                  ? 'Menunggu Verifikasi'
                  : paymentStatus === 'ditolak'
                    ? 'Ditolak'
                    : 'Belum Dibayar'}
            </Badge>
          </div>
        )}
        <div className="flex justify-between border-t pt-2">
          <span className="font-medium">Total</span>
          <span className="font-heading text-primary text-lg font-bold">
            {formatCurrency(order.total_price)}
          </span>
        </div>
      </div>

      {order.payment_method === 'qris' && (
        <div className="mt-4 border-t pt-4">
          {paymentStatus === 'ditolak' && (
            <p className="mb-3 text-sm text-red-600">
              {order.payments?.[0]?.rejection_note
                ? `Ditolak: ${order.payments[0].rejection_note}`
                : 'Pembayaran ditolak. Upload ulang bukti.'}
            </p>
          )}

          {proofUrl && (
            <div className="mb-3">
              <p className="text-muted mb-2 text-xs">Bukti Pembayaran</p>
              <div className="rounded-lg border p-2 shadow-sm">
                <img
                  src={proofUrl}
                  alt="Bukti Pembayaran"
                  className="max-h-48 w-full rounded object-contain"
                />
              </div>
            </div>
          )}

          {uploadError && <p className="mb-3 text-sm text-red-500">{uploadError}</p>}

          {canShowUpload && (
            <div className={proofUrl ? 'mt-3 flex justify-end' : ''}>
              <label className="bg-primary hover:bg-primary-dark inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors">
                <Upload className="h-4 w-4" />
                {uploading
                  ? 'Mengupload...'
                  : proofUrl
                    ? 'Ganti Bukti Pembayaran'
                    : 'Upload Bukti Pembayaran'}
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
      )}
    </div>
  )
}