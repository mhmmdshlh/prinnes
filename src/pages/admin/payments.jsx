import { useCallback, useEffect, useState } from 'react'
import { Check, X, ExternalLink } from 'lucide-react'
import { useAuth } from '../../hooks/use-auth-context'
import * as queries from '../../lib/supabase/queries'
import { supabase } from '../../lib/supabase/client'
import { formatCurrency, formatDate } from '../../lib/utils/format'

export default function AdminPayments() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [rejectionNote, setRejectionNote] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [proofUrl, setProofUrl] = useState('')

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    try {
      const data = await queries.getPendingPayments()
      setPayments(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  function viewProof(payment) {
    setSelectedPayment(payment)
    setRejectionNote('')
    const { data } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(payment.proof_image)
    setProofUrl(data.publicUrl)
  }

  async function handleVerify(action) {
    if (!selectedPayment || !user) return
    setActionLoading(true)
    try {
      await queries.verifyPayment(
        selectedPayment.id,
        user.id,
        action,
        rejectionNote
      )
      setSelectedPayment(null)
      setRejectionNote('')
      fetchPayments()
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">
        Verifikasi Pembayaran QRIS
      </h1>

      {payments.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-sm text-muted">
          Tidak ada pembayaran yang menunggu verifikasi
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="border-outline flex items-center justify-between rounded-xl border bg-white p-4"
            >
              <div>
                <p className="font-medium">
                  {payment.orders?.users?.name}
                </p>
                <p className="text-muted text-sm">
                  Antrian {payment.orders?.queue_number} &middot;{' '}
                  {payment.orders?.total_price
                    ? formatCurrency(payment.orders.total_price)
                    : '-'}
                </p>
                <p className="text-muted text-xs">
                  {formatDate(payment.orders?.created_at)}
                </p>
              </div>
              <button
                onClick={() => viewProof(payment)}
                className="bg-primary hover:bg-primary-dark flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Lihat Bukti
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="font-heading mb-4 text-lg font-semibold">
              Verifikasi Pembayaran
            </h2>

            <div className="bg-surface mb-4 flex items-center justify-center rounded-lg p-4">
              {proofUrl ? (
                <img
                  src={proofUrl}
                  alt="Bukti Pembayaran"
                  className="max-h-80 rounded-lg object-contain"
                />
              ) : (
                <p className="text-muted text-sm">Tidak ada bukti</p>
              )}
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium">
                Catatan (jika ditolak)
              </label>
              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                rows={2}
                className="border-outline mt-1 block w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Alasan penolakan..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleVerify('setujui')}
                disabled={actionLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                Setujui
              </button>
              <button
                onClick={() => handleVerify('tolak')}
                disabled={actionLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Tolak
              </button>
              <button
                onClick={() => setSelectedPayment(null)}
                className="border-outline text-muted flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors hover:bg-surface"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
