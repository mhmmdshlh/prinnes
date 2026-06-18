import { useState, useEffect, useRef } from 'react'
import { Upload, X, Check, AlertTriangle } from 'lucide-react'
import { useUploadPaymentProof } from '../../hooks/use-mutations'
import { formatCurrency } from '../../lib/utils/format'
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
  const [pendingFile, setPendingFile] = useState(null)
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState(null)
  const justUploaded = useRef(false)
  const inputRef = useRef(null)
  const uploadMutation = useUploadPaymentProof()

  const canEdit = paymentStatus !== 'lunas'

  useEffect(() => {
    if (justUploaded.current) {
      justUploaded.current = false
      return
    }
    setPaymentStatus(order.payment_status)
    setProofUrl(
      order.payments?.[0]?.proof_image
        ? supabase.storage.from('payment-proofs').getPublicUrl(order.payments[0].proof_image).data.publicUrl
        : null
    )
  }, [order.payment_status, order.payments])

  useEffect(() => {
    return () => {
      if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl)
    }
  }, [pendingPreviewUrl])

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 5 MB')
      return
    }

    setUploadError('')
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl)
    setPendingFile(file)
    setPendingPreviewUrl(URL.createObjectURL(file))
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleConfirm() {
    if (!pendingFile) return
    setUploading(true)
    setUploadError('')
    try {
      const result = await uploadMutation.mutateAsync({ orderId: order.id, file: pendingFile })
      justUploaded.current = true
      setProofUrl(result.public_url)
      setPaymentStatus('menunggu_verifikasi')
      setPendingFile(null)
      if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl)
      setPendingPreviewUrl(null)
    } catch (err) {
      setUploadError(err.message || 'Gagal upload bukti')
    } finally {
      setUploading(false)
    }
  }

  function handleCancel() {
    setPendingFile(null)
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl)
    setPendingPreviewUrl(null)
    setUploadError('')
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
          {paymentStatus === 'ditolak' && !pendingPreviewUrl && (
            <div className="mb-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {order.payments?.[0]?.rejection_note
                  ? `Pembayaran ditolak: ${order.payments[0].rejection_note}`
                  : 'Pembayaran ditolak. Upload ulang bukti.'}
              </span>
            </div>
          )}

          {proofUrl && !pendingPreviewUrl && (
            <div className="mb-3">
              <p className="text-muted mb-2 text-xs">Bukti Pembayaran</p>
              <div className="rounded-lg border p-2 shadow-sm">
                <img
                  src={proofUrl}
                  alt="Bukti Pembayaran"
                  loading="lazy"
                  className="max-h-48 w-full rounded object-contain"
                />
              </div>
            </div>
          )}

          {pendingPreviewUrl && (
            <div className="mb-3">
              <p className="text-muted mb-2 text-xs">Bukti Baru</p>
              <div className="rounded-lg border border-primary p-2 shadow-sm">
                <img
                  src={pendingPreviewUrl}
                  alt="Preview Bukti Baru"
                  className="max-h-48 w-full rounded object-contain"
                />
              </div>
            </div>
          )}

          {uploadError && <p className="mb-3 text-sm text-red-500">{uploadError}</p>}

          {canEdit && !pendingFile && (
            <div className={proofUrl ? 'mt-3 flex justify-end' : ''}>
              <label className="bg-primary hover:bg-primary-dark inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors">
                <Upload className="h-4 w-4" />
                {proofUrl ? 'Upload Bukti Baru' : 'Upload Bukti Pembayaran'}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          )}

          {canEdit && pendingFile && (
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={handleCancel}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Batal
              </button>
              <button
                onClick={handleConfirm}
                disabled={uploading}
                className="bg-primary hover:bg-primary-dark inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Mengupload...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Konfirmasi
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}