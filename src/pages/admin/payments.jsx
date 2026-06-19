import { useCallback, useEffect, useState } from 'react'
import { ExternalLink, CheckCircle, Clock } from 'lucide-react'
import { useAuth } from '../../hooks/use-auth-context'
import { useVerifyPayment } from '../../hooks/use-mutations'
import * as queries from '../../lib/supabase/queries'
import { supabase } from '../../lib/supabase/client'
import { formatCurrency, formatDate } from '../../lib/utils/format'
import { PAYMENT_STATUS_LABEL } from '../../lib/constants'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import VerificationModal from '../../components/features/VerificationModal'
import { queryKeys } from '../../lib/query/keys'
import { useQueryClient } from '@tanstack/react-query'

const tabs = [
  { key: 'pending', label: 'Menunggu' },
  { key: 'rejected', label: 'Ditolak' },
]

export default function AdminPayments() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('pending')
  const [pendingPayments, setPendingPayments] = useState([])
  const [rejectedPayments, setRejectedPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [proofUrl, setProofUrl] = useState('')
  const verifyMutation = useVerifyPayment()

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [pending, rejected] = await Promise.all([
        queries.getPendingPayments(),
        queries.getRejectedPayments(),
      ])
      setPendingPayments(pending)
      setRejectedPayments(rejected)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

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
      queryClient.invalidateQueries({ queryKey: queryKeys.rejectedPayments })
      fetchAll()
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

  const list = activeTab === 'pending' ? pendingPayments : rejectedPayments

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">
        Verifikasi Pembayaran QRIS
      </h1>

      <div className="flex gap-1 rounded-lg bg-surface p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-foreground border border-gray-200'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {tab.label}
            {tab.key === 'pending' && pendingPayments.length > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {pendingPayments.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          title={
            activeTab === 'pending'
              ? 'Tidak ada pembayaran yang menunggu verifikasi'
              : 'Belum ada penolakan'
          }
        />
      ) : (
        <div className="space-y-3">
          {list.map((payment) => {
            const order = payment.orders
            const hasReuploaded =
              activeTab === 'rejected' && order?.payment_status === 'menunggu_verifikasi'

            return (
              <div
                key={payment.id}
                className="border-outline flex items-center justify-between rounded-xl border bg-white p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium">{order?.users?.name}</p>
                  <p className="text-muted text-sm">
                    Antrian {order?.queue_number} &middot;{' '}
                    {order?.total_price ? formatCurrency(order.total_price) : '-'}
                  </p>
                  {activeTab === 'rejected' && payment.rejection_note && (
                    <p className="mt-1 text-xs text-red-600">
                      Ditolak: {payment.rejection_note}
                    </p>
                  )}
                  <p className="text-muted mt-0.5 text-xs">
                    {formatDate(activeTab === 'rejected' ? payment.verified_at : order?.created_at)}
                  </p>
                  {activeTab === 'rejected' && (
                    <div className="mt-1.5">
                      {hasReuploaded ? (
                        <Badge variant="success">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Sudah diganti
                        </Badge>
                      ) : (
                        <Badge variant="error">
                          <Clock className="mr-1 h-3 w-3" />
                          Menunggu upload ulang
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => viewProof(payment)}
                  className="bg-primary hover:bg-primary-dark shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            )
          })}
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