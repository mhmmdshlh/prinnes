import { useState } from 'react'
import { Upload } from 'lucide-react'
import { useUploadPaymentProof } from '../../hooks/use-mutations'
import { QRCodeSVG } from 'qrcode.react'
import OrderSuccess from './OrderSuccess'

const qrisPayload = import.meta.env.VITE_QRIS_MERCHANT_PAYLOAD || 'QRIS-PRINNES-DEFAULT'

export default function QrPaymentStep({ order }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploaded, setUploaded] = useState(false)
  const uploadMutation = useUploadPaymentProof()

  async function handleProofUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5 MB')
      return
    }

    setUploading(true)
    setError('')
    try {
      await uploadMutation.mutateAsync({ orderId: order.id, file })
      setUploaded(true)
    } catch (err) {
      setError(err.message || 'Gagal upload bukti')
    } finally {
      setUploading(false)
    }
  }

  if (uploaded) {
    return (
      <OrderSuccess
        order={order}
        onViewDetail={() => window.location.assign(`/pesanan/${order.id}`)}
        onGoDashboard={() => window.location.assign('/dashboard')}
        note="Pembayaran akan diverifikasi admin terlebih dahulu."
      />
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
        <h2 className="font-heading mb-4 text-lg font-semibold">
          Pembayaran QRIS
        </h2>

        <p className="text-muted mb-4 text-sm">
          Scan QR code berikut untuk melakukan pembayaran, lalu upload bukti
          transfer.
        </p>

        <div className="mb-4 flex items-center justify-center rounded-lg p-4">
          <div className="h-48 w-48">
            <QRCodeSVG value={qrisPayload} size={192} level="M" />
          </div>
        </div>

        <p className="font-heading text-primary mb-4 text-lg font-bold">
          {order.queue_number}
        </p>

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <label className="bg-primary hover:bg-primary-dark inline-flex cursor-pointer items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors">
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
    </div>
  )
}
