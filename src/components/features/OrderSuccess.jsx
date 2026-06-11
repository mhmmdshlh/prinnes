import { Check } from 'lucide-react'

export default function OrderSuccess({ order, onViewDetail, onGoDashboard, note }) {
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
          {order.queue_number}
        </p>
        {note ? (
          <p className="text-muted mt-4 text-sm">{note}</p>
        ) : (
          <p className="text-muted mt-4 text-sm">
            Simpan nomor antrian ini untuk tracking pesanan Anda.
          </p>
        )}
        <div className="mt-6 space-y-3">
          <button
            onClick={onViewDetail}
            className="bg-primary hover:bg-primary-dark w-full rounded-lg py-2.5 text-sm font-medium text-white transition-colors"
          >
            Lihat Detail Pesanan
          </button>
          <button
            onClick={onGoDashboard}
            className="border-outline text-primary hover:bg-surface w-full rounded-lg border py-2.5 text-sm font-medium transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}