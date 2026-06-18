import { useNavigate } from 'react-router-dom'
import { useActiveQueue } from '../../hooks/use-queue'
import { useUpdateOrderStatus } from '../../hooks/use-mutations'
import { formatDateShort } from '../../lib/utils/format'
import QueueItem from '../../components/features/QueueItem'
import EmptyState from '../../components/ui/EmptyState'

function groupByDate(items) {
  const groups = {}
  for (const item of items) {
    const date = new Date(item.created_at).toISOString().split('T')[0]
    if (!groups[date]) groups[date] = []
    groups[date].push(item)
  }
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
}

function DateGroup({ items, renderItem }) {
  const grouped = groupByDate(items)
  const showSeparator = grouped.length > 1

  return (
    <div className="space-y-2">
      {grouped.map(([date, dateItems], idx) => (
        <div key={date}>
          {showSeparator && idx > 0 && (
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface px-3 text-xs text-muted">
                  {formatDateShort(date)}
                </span>
              </div>
            </div>
          )}
          {dateItems.map(renderItem)}
        </div>
      ))}
    </div>
  )
}

export default function AdminQueue() {
  const navigate = useNavigate()
  const { queue, loading, refetch } = useActiveQueue()
  const updateStatusMutation = useUpdateOrderStatus()

  async function handleProcess(orderId) {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status: 'diproses' })
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  async function handleComplete(orderId) {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status: 'selesai' })
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const waiting = queue.filter((o) => o.status === 'menunggu')
  const processing = queue.filter((o) => o.status === 'diproses')

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

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
          <DateGroup
            items={processing}
            renderItem={(item) => (
              <QueueItem
                key={item.id}
                item={item}
                onComplete={handleComplete}
                onDetail={() => navigate(`/admin/pesanan/${item.id}`)}
              />
            )}
          />
        </section>
      )}

      <section>
        <h2 className="font-heading mb-4 text-lg font-semibold">
          Menunggu Antrian
        </h2>
        {waiting.length === 0 ? (
          <EmptyState title="Tidak ada antrian yang menunggu" />
        ) : (
            <DateGroup
              items={waiting}
              renderItem={(item) => (
                <QueueItem key={item.id} item={item} onProcess={handleProcess} onDetail={() => navigate(`/admin/pesanan/${item.id}`)} />
              )}
            />
        )}
      </section>
    </div>
  )
}