export default function StatCard({ label, value, color = 'bg-blue-50 text-blue-700' }) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="font-heading mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}