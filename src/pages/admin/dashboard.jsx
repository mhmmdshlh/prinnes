import { useActiveQueue } from '../../hooks/use-queue'
import { formatCurrency } from '../../lib/utils/format'

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
    {
      label: 'Pesanan Hari Ini',
      value: stats?.total ?? 0,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Menunggu',
      value: stats?.menunggu ?? 0,
      color: 'bg-yellow-50 text-yellow-700',
    },
    {
      label: 'Diproses',
      value: stats?.diproses ?? 0,
      color: 'bg-purple-50 text-purple-700',
    },
    {
      label: 'Siap Diambil',
      value: stats?.siap_diambil ?? 0,
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Pendapatan Hari Ini',
      value: formatCurrency(stats?.revenue ?? 0),
      color: 'bg-emerald-50 text-emerald-700',
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border p-4 ${card.color}`}
          >
            <p className="text-sm font-medium opacity-75">{card.label}</p>
            <p className="font-heading mt-1 text-2xl font-bold">{card.value}</p>
          </div>
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
              <div
                key={item.id}
                className="border-outline flex items-center justify-between rounded-xl border bg-white p-4"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`font-heading text-lg font-bold ${
                      item.status === 'diproses'
                        ? 'text-primary'
                        : 'text-muted'
                    }`}
                  >
                    {item.queue_number}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{item.users?.name}</p>
                    <p className="text-muted text-xs capitalize">
                      {item.status === 'menunggu' ? 'Menunggu' : 'Diproses'}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    item.status === 'diproses'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {item.status === 'diproses' ? 'Diproses' : 'Menunggu'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
