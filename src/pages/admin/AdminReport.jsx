import { FileText, Download } from 'lucide-react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts'
import { useReportData } from '../../hooks/use-report'
import { formatCurrency, formatDateShort, exportToCsv } from '../../lib/utils/format'
import { PRINT_TYPE_LABEL, PAPER_SIZE_LABEL } from '../../lib/constants'

const presets = [
  { key: 'today', label: 'Hari Ini' },
  { key: '7days', label: '7 Hari Terakhir' },
  { key: 'month', label: 'Bulan Ini' },
  { key: 'all', label: 'Semua Waktu' },
]

export default function AdminReport() {
  const { orders, loading, preset, setPreset, presetLabel, summary, printBreakdown, revenueTrend } =
    useReportData()

  function handleExport() {
    if (!window.confirm(`Export ${orders.length} data ke CSV?`)) return
    exportToCsv(orders, `laporan-prinnes-${presetLabel.toLowerCase().replace(/\s+/g, '-')}.csv`)
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
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Laporan</h1>
        <button
          onClick={handleExport}
          className="bg-primary hover:bg-primary-dark flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.key}
            onClick={() => setPreset(p.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              preset === p.key
                ? 'bg-primary text-white'
                : 'bg-white text-muted hover:bg-surface border border-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-muted text-sm">Total Pendapatan</p>
          <p className="font-heading text-primary mt-1 text-3xl font-bold">
            {formatCurrency(summary.totalRevenue)}
          </p>
          <p className="text-muted mt-1 text-xs">{presetLabel}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-muted text-sm">Pesanan Sukses</p>
          <p className="font-heading text-primary mt-1 text-3xl font-bold">
            {summary.totalOrders}
          </p>
          <p className="text-muted mt-1 text-xs">{presetLabel}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-heading mb-4 flex items-center gap-2 text-lg font-semibold">
          <FileText className="h-5 w-5 text-muted" />
          Performa Cetak
        </h2>
        {printBreakdown.length === 0 ? (
          <p className="text-muted text-sm">Belum ada data</p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="px-4 py-3 font-medium">Jenis Cetak</th>
                  <th className="px-4 py-3 font-medium">Ukuran Kertas</th>
                  <th className="px-4 py-3 font-medium">Jumlah Pesanan</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white">
                {printBreakdown.map((item) => (
                  <tr key={`${item.print_type}_${item.paper_size}`} className="hover:bg-surface/50">
                    <td className="px-4 py-3">
                      {PRINT_TYPE_LABEL[item.print_type]}
                    </td>
                    <td className="px-4 py-3">
                      {PAPER_SIZE_LABEL[item.paper_size]}
                    </td>
                    <td className="px-4 py-3 font-medium">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-heading mb-4 flex items-center gap-2 text-lg font-semibold">
          Tren Pendapatan
        </h2>
        {revenueTrend.length === 0 ? (
          <p className="text-muted text-sm">Belum ada data</p>
        ) : preset === 'today' ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueTrend} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => formatDateShort(d)}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                tickFormatter={(v) => formatCurrency(v)}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), 'Pendapatan']}
                labelFormatter={(d) => formatDateShort(d)}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrend} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => formatDateShort(d)}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                padding={{ left: 30, right: 30 }}
              />
              <YAxis
                tickFormatter={(v) => formatCurrency(v)}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), 'Pendapatan']}
                labelFormatter={(d) => formatDateShort(d)}
              />
              <Line
                type="linear"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
