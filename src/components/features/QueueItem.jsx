export default function QueueItem({ item, onProcess, onComplete }) {
  return (
    <div
      className={`border-outline flex items-center justify-between rounded-xl border p-4 ${
        item.status === 'diproses' ? 'border-primary border-2 bg-blue-50' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-4">
        <span
          className={`font-heading text-lg font-bold ${
            item.status === 'diproses' ? 'text-primary' : 'text-muted'
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
      {onProcess && item.status === 'menunggu' && (
        <button
          onClick={() => onProcess(item.id)}
          className="bg-primary hover:bg-primary-dark rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          Proses
        </button>
      )}
      {onComplete && item.status === 'diproses' && (
        <button
          onClick={() => onComplete(item.id)}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          Selesai
        </button>
      )}
    </div>
  )
}