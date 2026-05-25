import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Check, Upload, FileText } from 'lucide-react'
import { orderConfigSchema, paymentMethodSchema, allowedFileTypes, MAX_FILE_SIZE } from '../../lib/utils/validation'
import { formatCurrency, formatFileSize } from '../../lib/utils/format'
import { useAuth } from '../../hooks/use-auth-context'
import { useCalculatePrice } from '../../hooks/use-prices'
import * as queries from '../../lib/supabase/queries'
import { PRINT_TYPE_LABEL, PAPER_SIZE_LABEL } from '../../lib/constants'

export default function CreateOrder() {
  const [searchParams, setSearchParams] = useSearchParams()
  const step = parseInt(searchParams.get('step') || '1', 10)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { prices, calculate } = useCalculatePrice()

  const [files, setFiles] = useState([])
  const [fileError, setFileError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [orderResult, setOrderResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const configForm = useForm({
    resolver: zodResolver(orderConfigSchema),
    defaultValues: { print_type: 'bw', paper_size: 'A4', copies: 1, notes: '' },
  })

  const paymentForm = useForm({
    resolver: zodResolver(paymentMethodSchema),
  })

  const watchedConfig = useWatch({ control: configForm.control })

  function handleFileUpload(e) {
    const selected = Array.from(e.target.files || [])
    setFileError('')

    const invalidFormat = selected.find(
      (f) => !allowedFileTypes.includes(f.type)
    )
    if (invalidFormat) {
      setFileError('Format file tidak didukung. Gunakan PDF, DOCX, DOC, JPG, atau PNG.')
      return
    }

    const oversized = selected.find((f) => f.size > MAX_FILE_SIZE)
    if (oversized) {
      setFileError('Ukuran file maksimal 20 MB.')
      return
    }

    setFiles((prev) => [...prev, ...selected])
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function goToStep(s) {
    setSearchParams({ step: s.toString() })
    window.scrollTo(0, 0)
  }

  function handleConfigNext(data) {
    const price = calculate(data)
    setTotalPrice(price)
    goToStep(3)
  }

  async function handleConfirmPayment(data) {
    if (files.length === 0) {
      setFileError('Minimal upload 1 file.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const config = configForm.getValues()
      const queueNumber = await queries.getNextQueueNumber()

      const order = await queries.createOrder({
        queue_number: queueNumber,
        user_id: user.id,
        print_type: config.print_type,
        paper_size: config.paper_size,
        copies: config.copies,
        notes: config.notes || null,
        total_price: totalPrice,
        status: 'menunggu',
        payment_method: data.payment_method,
        payment_status: data.payment_method === 'qris' ? 'belum_dibayar' : 'belum_dibayar',
      })

      const uploaded = []
      for (const file of files) {
        const result = await queries.uploadOrderFile(order.id, file)
        uploaded.push(result)
      }
      setUploadedFiles(uploaded)
      setOrderResult(order)
      goToStep(4)
    } catch (e) {
      setError(e.message || 'Gagal membuat pesanan.')
    } finally {
      setSubmitting(false)
    }
  }

  if (orderResult) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-8">
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-heading mt-4 text-2xl font-bold">
            Pesanan Berhasil!
          </h1>
          <p className="text-muted mt-2">Nomor antrian Anda</p>
          <p className="font-heading text-primary mt-2 text-4xl font-bold">
            {orderResult.queue_number}
          </p>
          <p className="text-muted mt-4 text-sm">
            Simpan nomor antrian ini untuk tracking pesanan Anda.
          </p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate(`/pesanan/${orderResult.id}`)}
              className="bg-primary hover:bg-primary-dark w-full rounded-lg py-2.5 text-sm font-medium text-white transition-colors"
            >
              Lihat Detail Pesanan
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="border-outline text-primary hover:bg-surface w-full rounded-lg border py-2.5 text-sm font-medium transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Pesanan Baru</h1>
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className={step >= 1 ? 'text-primary font-medium' : ''}>
            File
          </span>
          <span>&rarr;</span>
          <span className={step >= 2 ? 'text-primary font-medium' : ''}>
            Konfigurasi
          </span>
          <span>&rarr;</span>
          <span className={step >= 3 ? 'text-primary font-medium' : ''}>
            Pembayaran
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center">
              <Upload className="text-muted h-12 w-12" />
              <p className="text-muted mt-4 text-sm">
                Format: PDF, DOCX, DOC, JPG, PNG (maks. 20 MB/file)
              </p>
              <label className="bg-primary hover:bg-primary-dark mt-4 cursor-pointer rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors">
                Pilih File
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {fileError && (
              <p className="mt-4 text-center text-sm text-red-500">
                {fileError}
              </p>
            )}

            {files.length > 0 && (
              <div className="mt-6 space-y-2">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="border-outline flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="text-muted h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-muted text-xs">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                if (files.length === 0) {
                  setFileError('Minimal upload 1 file.')
                  return
                }
                goToStep(2)
              }}
              className="bg-primary hover:bg-primary-dark flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors"
            >
              Selanjutnya
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={configForm.handleSubmit(handleConfigNext)} className="space-y-4">
          <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
            <div>
              <label className="text-sm font-medium">Jenis Cetak</label>
              <div className="mt-2 flex gap-3">
                {['bw', 'color'].map((type) => (
                  <label
                    key={type}
                    className={`flex-1 cursor-pointer rounded-lg border p-4 text-center text-sm font-medium transition-colors ${
                      watchedConfig.print_type === type
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-outline hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      {...configForm.register('print_type')}
                      value={type}
                      className="hidden"
                    />
                    {PRINT_TYPE_LABEL[type]}
                  </label>
                ))}
              </div>
              {configForm.formState.errors.print_type && (
                <p className="mt-1 text-xs text-red-500">
                  {configForm.formState.errors.print_type.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Ukuran Kertas</label>
              <div className="mt-2 flex gap-3">
                {['A4', 'F4', 'A3'].map((size) => (
                  <label
                    key={size}
                    className={`flex-1 cursor-pointer rounded-lg border p-4 text-center text-sm font-medium transition-colors ${
                      watchedConfig.paper_size === size
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-outline hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      {...configForm.register('paper_size')}
                      value={size}
                      className="hidden"
                    />
                    {PAPER_SIZE_LABEL[size]}
                  </label>
                ))}
              </div>
              {configForm.formState.errors.paper_size && (
                <p className="mt-1 text-xs text-red-500">
                  {configForm.formState.errors.paper_size.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Jumlah Copy</label>
              <input
                type="number"
                {...configForm.register('copies', { valueAsNumber: true })}
                min={1}
                max={999}
                className="border-outline mt-1 block w-32 rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {configForm.formState.errors.copies && (
                <p className="mt-1 text-xs text-red-500">
                  {configForm.formState.errors.copies.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Catatan (opsional)</label>
              <textarea
                {...configForm.register('notes')}
                rows={3}
                className="border-outline mt-1 block w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Contoh: jilid spiral, print bolak-balik, dll."
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="border-outline text-muted hover:bg-surface flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors"
            >
              Selanjutnya
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={paymentForm.handleSubmit(handleConfirmPayment)} className="space-y-4">
          <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">File</span>
                <span>{files.length} file</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Jenis Cetak</span>
                <span>{PRINT_TYPE_LABEL[configForm.getValues().print_type]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Ukuran Kertas</span>
                <span>{PAPER_SIZE_LABEL[configForm.getValues().paper_size]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Jumlah Copy</span>
                <span>{configForm.getValues().copies}x</span>
              </div>
              <div className="border-outline flex justify-between border-t pt-2 font-medium">
                <span>Total Estimasi</span>
                <span className="text-primary font-heading text-lg">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="font-heading mb-4 text-lg font-semibold">
              Metode Pembayaran
            </h2>
            <div className="space-y-3">
              {[
                { value: 'toko', label: 'Bayar di Toko', desc: 'Bayar tunai saat mengambil pesanan' },
                { value: 'qris', label: 'QRIS', desc: 'Scan QR code dan upload bukti pembayaran' },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`block cursor-pointer rounded-lg border p-4 transition-colors ${
                    paymentForm.watch('payment_method') === method.value
                      ? 'border-primary bg-primary/5'
                      : 'border-outline hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      {...paymentForm.register('payment_method')}
                      value={method.value}
                      className="text-primary accent-primary"
                    />
                    <div>
                      <p className="text-sm font-medium">{method.label}</p>
                      <p className="text-muted text-xs">{method.desc}</p>
                    </div>
                  </div>
                </label>
              ))}
              {paymentForm.formState.errors.payment_method && (
                <p className="text-xs text-red-500">
                  {paymentForm.formState.errors.payment_method.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="border-outline text-muted hover:bg-surface flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary-dark disabled:bg-muted flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed"
            >
              {submitting ? 'Memproses...' : 'Konfirmasi Pesanan'}
              <Check className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
