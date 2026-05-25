import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { orderConfigSchema, paymentMethodSchema, allowedFileTypes, MAX_FILE_SIZE } from '../../lib/utils/validation'
import { useAuth } from '../../hooks/use-auth-context'
import { useCalculatePrice } from '../../hooks/use-prices'
import * as queries from '../../lib/supabase/queries'
import FileUpload from '../../components/ui/FileUpload'
import OrderConfigForm from '../../components/features/OrderConfigForm'
import OrderSummary from '../../components/features/OrderSummary'
import OrderSuccess from '../../components/features/OrderSuccess'

export default function CreateOrder() {
  const [searchParams, setSearchParams] = useSearchParams()
  const step = parseInt(searchParams.get('step') || '1', 10)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { calculate } = useCalculatePrice()

  const [files, setFiles] = useState([])
  const [fileError, setFileError] = useState('')
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
        payment_status: 'belum_dibayar',
      })

      for (const file of files) {
        await queries.uploadOrderFile(order.id, file)
      }

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
      <OrderSuccess
        order={orderResult}
        onViewDetail={() => navigate(`/pesanan/${orderResult.id}`)}
        onGoDashboard={() => navigate('/dashboard')}
      />
    )
  }

  const stepLabels = ['File', 'Konfigurasi', 'Pembayaran']

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Pesanan Baru</h1>
        <div className="flex items-center gap-2 text-sm text-muted">
          {stepLabels.map((label, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-1">&rarr;</span>}
              <span className={step >= i + 1 ? 'text-primary font-medium' : ''}>
                {label}
              </span>
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <FileUpload
            files={files}
            onUpload={handleFileUpload}
            onRemove={removeFile}
            error={fileError}
          />
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
          <OrderConfigForm
            register={configForm.register}
            errors={configForm.formState.errors}
            watchedConfig={watchedConfig}
          />
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
          <OrderSummary
            config={configForm.getValues()}
            filesCount={files.length}
            totalPrice={totalPrice}
            paymentForm={paymentForm}
          />
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