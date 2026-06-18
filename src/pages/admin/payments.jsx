import { useCallback, useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useAuth } from '../../hooks/use-auth-context'
import { useVerifyPayment } from '../../hooks/use-mutations'
import * as queries from '../../lib/supabase/queries'
import { supabase } from '../../lib/supabase/client'
import { formatCurrency, formatDate } from '../../lib/utils/format'
import EmptyState from '../../components/ui/EmptyState'
import VerificationModal from '../../components/features/VerificationModal'
import { queryKeys } from '../../lib/query/keys'
import { useQueryClient } from '@tanstack/react-query'

export default function AdminPayments() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [proofUrl, setProofUrl] = useState('')
  const verifyMutation = useVerifyPayment()

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
    const { data } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(payment.proof_image)
    setProofUrl(data.publicUrl)
  }

  async function handleVerify(action, rejectionNote) {
    if (!selectedPayment || !user) return
    try {
      await verifyMutation.mutateAsync({
        paymentId: selectedPayment.id,
        adminId: user.id,
        action,
        rejectionNote,
      })
      setSelectedPayment(null)
      queryClient.invalidateQueries({ queryKey: queryKeys.payments })
      fetchPayments()
    } catch (e) {
      console.error(e)
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
        <EmptyState title="Tidak ada pembayaran yang menunggu verifikasi" />
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="border-outline flex items-center justify-between rounded-xl border bg-white p-4"
            >
              <div>
                <p className="font-medium">{payment.orders?.users?.name}</p>
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
        <VerificationModal
          proofUrl={proofUrl}
          onVerify={handleVerify}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  )
}