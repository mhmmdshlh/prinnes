import { PRINT_TYPE_LABEL, PAPER_SIZE_LABEL } from '../../lib/constants'

export default function QueueItem({ item, onProcess, onComplete, onDetail }) {
  const fileNames = item.order_files?.map((f) => f.file_name).join(', ') || ''

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onDetail?.(item.id)}
      onKeyDown={(e) => e.key === 'Enter' && onDetail?.(item.id)}
      className={`border-outline flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-shadow hover:shadow-sm ${
        item.status === 'diproses' ? 'border-primary border-2 bg-blue-50' : 'bg-white'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span
            className={`font-heading text-lg font-bold ${
              item.status === 'diproses' ? 'text-primary' : 'text-muted'
            }`}
          >
            {item.queue_number}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.users?.name}</p>
            <p className="text-muted text-xs">
              {PRINT_TYPE_LABEL[item.print_type]} &middot; {PAPER_SIZE_LABEL[item.paper_size]} &middot; {item.copies}x
            </p>
            {fileNames && (
              <p className="mt-0.5 truncate text-xs text-gray-400">{fileNames}</p>
            )}
          </div>
        </div>
      </div>
      {onProcess && item.status === 'menunggu' && (
        <button
          onClick={(e) => { e.stopPropagation(); onProcess(item.id) }}
          className="bg-primary hover:bg-primary-dark rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          Proses
        </button>
      )}
      {onComplete && item.status === 'diproses' && (
        <button
          onClick={(e) => { e.stopPropagation(); onComplete(item.id) }}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          Selesai
        </button>
      )}
    </div>
  )
}