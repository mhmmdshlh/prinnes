import { useState } from 'react'
import { Check, X } from 'lucide-react'

export default function VerificationModal({ proofUrl, onVerify, onClose }) {
  const [rejectionNote, setRejectionNote] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  async function handleAction(action) {
    setActionLoading(true)
    await onVerify(action, rejectionNote)
    setActionLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="font-heading mb-4 text-lg font-semibold">Verifikasi Pembayaran</h2>

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
          <label className="text-sm font-medium">Catatan (jika ditolak)</label>
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
            onClick={() => handleAction('setujui')}
            disabled={actionLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            Setujui
          </button>
          <button
            onClick={() => handleAction('tolak')}
            disabled={actionLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Tolak
          </button>
          <button
            onClick={onClose}
            className="border-outline text-muted flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}