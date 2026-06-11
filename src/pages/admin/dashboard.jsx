import { useEffect, useState } from 'react'
import { Store, FileText, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../lib/utils/format'
import { PRINT_TYPE_LABEL, PAPER_SIZE_LABEL } from '../../lib/constants'
import { useActiveQueue } from '../../hooks/use-queue'
import { useStoreStatus } from '../../hooks/use-store-status'
import * as queries from '../../lib/supabase/queries'
import StatCard from '../../components/ui/StatCard'

export default function AdminDashboard() {
  const { stats, loading } = useActiveQueue()
  const { isOpen, toggle } = useStoreStatus()
  const [paperEstimates, setPaperEstimates] = useState([])
  const [hourlyData, setHourlyData] = useState([])
  const [estimatesLoading, setEstimatesLoading] = useState(true)
  const [hourlyLoading, setHourlyLoading] = useState(true)

  useEffect(() => {
    queries
      .getTodayPaperEstimates()
      .then(setPaperEstimates)
      .catch(console.error)
      .finally(() => setEstimatesLoading(false))
  }, [])

  useEffect(() => {
    queries
      .getTodayHourlyOrders()
      .then(setHourlyData)
      .catch(console.error)
      .finally(() => setHourlyLoading(false))
  }, [])

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
    { label: 'Selesai', value: stats?.selesai ?? 0, color: 'bg-green-50 text-green-700' },
    { label: 'Pendapatan Hari Ini', value: formatCurrency(stats?.revenue ?? 0), color: 'bg-emerald-50 text-emerald-700' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isOpen ? 'bg-green-500 focus:ring-green-500' : 'bg-gray-300 focus:ring-gray-400'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                isOpen ? 'translate-x-[1.375rem]' : 'translate-x-[0.1875rem]'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isOpen ? 'text-green-700' : 'text-red-600'}`}>
            {isOpen ? 'Toko Buka' : 'Toko Tutup'}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-heading mb-1 flex items-center gap-2 text-lg font-semibold">
          <FileText className="h-5 w-5 text-muted" />
          Estimasi Kertas Hari Ini
        </h2>
        <p className="text-muted mb-4 text-sm">
          Total lembar yang harus dicetak dari antrian menunggu & diproses
        </p>
        {estimatesLoading ? (
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-40 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : paperEstimates.length === 0 ? (
          <p className="text-muted text-sm">Belum ada data</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {paperEstimates.map((e) => (
              <div
                key={`${e.print_type}_${e.paper_size}`}
                className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3"
              >
                <span className="text-sm font-medium">
                  {PRINT_TYPE_LABEL[e.print_type]} {PAPER_SIZE_LABEL[e.paper_size]}
                </span>
                <span className="font-heading text-primary text-lg font-bold">
                  {e.total_sheets.toLocaleString()}
                </span>
                <span className="text-muted text-xs">lembar</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-heading mb-1 flex items-center gap-2 text-lg font-semibold">
          <BarChart3 className="h-5 w-5 text-muted" />
          Jam Sibuk Hari Ini
        </h2>
        <p className="text-muted mb-4 text-sm">
          Jumlah pesanan masuk per jam
        </p>
        {hourlyLoading ? (
          <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
        ) : hourlyData.length === 0 ? (
          <p className="text-muted text-sm">Belum ada data</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hourlyData} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="hour"
                tickFormatter={(h) => `${h.toString().padStart(2, '0')}:00`}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip
                formatter={(value) => [`${value} pesanan`, 'Jumlah']}
                labelFormatter={(h) => `${h.toString().padStart(2, '0')}:00`}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
