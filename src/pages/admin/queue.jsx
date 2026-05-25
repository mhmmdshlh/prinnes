import { useActiveQueue } from '../../hooks/use-queue'
import * as queries from '../../lib/supabase/queries'
import QueueItem from '../../components/features/QueueItem'
import EmptyState from '../../components/ui/EmptyState'

export default function AdminQueue() {
  const { queue, loading, refetch } = useActiveQueue()

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
              <QueueItem
                key={item.id}
                item={item}
                onComplete={handleComplete}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-heading mb-4 text-lg font-semibold">
          Menunggu Antrian
        </h2>
        {waiting.length === 0 ? (
          <EmptyState title="Tidak ada antrian yang menunggu" />
        ) : (
          <div className="space-y-2">
            {waiting.map((item) => (
              <QueueItem key={item.id} item={item} onProcess={handleProcess} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}