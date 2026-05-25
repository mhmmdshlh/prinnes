import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Upload } from 'lucide-react'
import { useOrderDetail } from '../../hooks/use-orders'
import { formatCurrency, formatDate, formatFileSize } from '../../lib/utils/format'
import {
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  PRINT_TYPE_LABEL,
  PAPER_SIZE_LABEL,
} from '../../lib/constants'
import * as queries from '../../lib/supabase/queries'

const statusSteps = ['menunggu', 'diproses', 'selesai', 'siap_diambil']
const statusStepLabels = ['Menunggu', 'Diproses', 'Selesai', 'Siap Diambil']

export default function OrderDetail() {
  const { id } = useParams()
  const { order, loading } = useOrderDetail(id)
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
      await queries.uploadPaymentProof(id, file)
      window.location.reload()
    } catch (err) {
      setUploadError(err.message || 'Gagal upload bukti')
    } finally {
      setUploading(false)
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
      <div className="text-center py-16">
        <p className="text-muted">Pesanan tidak ditemukan</p>
        <Link to="/pesanan" className="text-primary mt-2 inline-block text-sm hover:underline">
          Kembali
        </Link>
      </div>
    )
  }

  const currentStep = statusSteps.indexOf(order.status)

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
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
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
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            {statusStepLabels.map((label, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    i <= currentStep
                      ? 'bg-primary text-white'
                      : 'bg-outline/30 text-muted'
                  }`}
                >
                  {i + 1}
                </div>
                <p
                  className={`mt-1 text-xs ${
                    i <= currentStep ? 'text-primary font-medium' : 'text-muted'
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-outline/30 relative mt-2 h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{
                width: `${(currentStep / (statusSteps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
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
            {order.notes && (
              <div className="flex justify-between">
                <dt className="text-muted">Catatan</dt>
                <dd className="max-w-xs text-right font-medium">
                  {order.notes}
                </dd>
              </div>
            )}
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
                  <div>
                    <p className="text-sm font-medium">{file.file_name}</p>
                    <p className="text-muted text-xs">
                      {formatFileSize(file.file_size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-heading mb-4 text-lg font-semibold">
            Pembayaran
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Metode</dt>
              <dd className="font-medium">
                {PAYMENT_METHOD_LABEL[order.payment_method]}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Status</dt>
              <dd>
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
              </dd>
            </div>
          </dl>

          {order.payment_method === 'qris' &&
            order.payment_status !== 'lunas' && (
              <div className="mt-4 border-t pt-4">
                {order.payment_status === 'ditolak' && (
                  <p className="mb-3 text-sm text-red-600">
                    {order.payments?.[0]?.rejection_note
                      ? `Ditolak: ${order.payments[0].rejection_note}`
                      : 'Pembayaran ditolak. Upload ulang bukti.'}
                  </p>
                )}

                <p className="text-muted mb-3 text-sm">
                  Scan QR code berikut untuk melakukan pembayaran, lalu upload
                  bukti transfer.
                </p>

                <div className="bg-surface mb-4 flex items-center justify-center rounded-lg p-6">
                  <div className="flex h-40 w-40 items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-muted text-center text-xs">
                      QR Code
                      <br />
                      (Tempel di sini)
                    </p>
                  </div>
                </div>

                {uploadError && (
                  <p className="mb-3 text-sm text-red-500">{uploadError}</p>
                )}

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
      </div>
    </div>
  )
}
