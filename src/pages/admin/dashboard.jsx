import { useActiveQueue } from '../../hooks/use-queue'
import { formatCurrency } from '../../lib/utils/format'
import StatCard from '../../components/ui/StatCard'
import QueueItem from '../../components/features/QueueItem'

export default function AdminDashboard() {
  const { queue, stats, loading } = useActiveQueue()

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const statCards = [
    { label: 'Pesanan Hari Ini', value: stats?.total ?? 0, color: 'bg-blue-50 text-blue-700' },
    { label: 'Menunggu', value: stats?.menunggu ?? 0, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Diproses', value: stats?.diproses ?? 0, color: 'bg-purple-50 text-purple-700' },
    { label: 'Siap Diambil', value: stats?.siap_diambil ?? 0, color: 'bg-green-50 text-green-700' },
    { label: 'Pendapatan Hari Ini', value: formatCurrency(stats?.revenue ?? 0), color: 'bg-emerald-50 text-emerald-700' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <section>
        <h2 className="font-heading mb-4 text-lg font-semibold">
          Antrian Aktif
        </h2>
        {queue.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center text-sm text-muted">
            Tidak ada antrian aktif
          </div>
        ) : (
          <div className="space-y-2">
            {queue.map((item) => (
              <QueueItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}