import { useActiveQueue } from '../../hooks/use-queue'
import * as queries from '../../lib/supabase/queries'

export default function AdminQueue() {
  const { queue, stats, loading, refetch } = useActiveQueue()

  async function handleProcess(orderId) {
    await queries.markAsProcessing(orderId)
    refetch()
  }

  async function handleComplete(orderId) {
    await queries.markAsCompleted(orderId)
    refetch()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const waiting = queue.filter((o) => o.status === 'menunggu')
  const processing = queue.filter((o) => o.status === 'diproses')

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Manajemen Antrian</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-muted text-sm">Menunggu</p>
          <p className="font-heading text-primary text-3xl font-bold">
            {waiting.length}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-muted text-sm">Diproses</p>
          <p className="font-heading text-primary text-3xl font-bold">
            {processing.length}
          </p>
        </div>
      </div>

      {processing.length > 0 && (
        <section>
          <h2 className="font-heading mb-4 text-lg font-semibold">
            Sedang Diproses
          </h2>
          <div className="space-y-2">
            {processing.map((item) => (
              <div
                key={item.id}
                className="border-primary flex items-center justify-between rounded-xl border-2 bg-blue-50 p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="font-heading text-primary text-2xl font-bold">
                    {item.queue_number}
                  </span>
                  <p className="text-sm font-medium">{item.users?.name}</p>
                </div>
                <button
                  onClick={() => handleComplete(item.id)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  Selesai
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-heading mb-4 text-lg font-semibold">
          Menunggu Antrian
        </h2>
        {waiting.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center text-sm text-muted">
            Tidak ada antrian yang menunggu
          </div>
        ) : (
          <div className="space-y-2">
            {waiting.map((item) => (
              <div
                key={item.id}
                className="border-outline flex items-center justify-between rounded-xl border bg-white p-4 transition-colors hover:border-primary/50"
              >
                <div className="flex items-center gap-4">
                  <span className="font-heading text-muted text-lg font-bold">
                    {item.queue_number}
                  </span>
                  <p className="text-sm font-medium">{item.users?.name}</p>
                </div>
                <button
                  onClick={() => handleProcess(item.id)}
                  className="bg-primary hover:bg-primary-dark rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                  Proses
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
