import { PRINT_TYPE_LABEL, PAPER_SIZE_LABEL } from '../../lib/constants'

export default function OrderConfigForm({ register, errors, watchedConfig }) {
  return (
    <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
      <div>
        <label className="text-sm font-medium">Jenis Cetak</label>
        <div className="mt-2 flex gap-3">
          {['bw', 'color'].map((type) => (
            <label
              key={type}
              className={`flex-1 cursor-pointer rounded-lg border p-4 text-center text-sm font-medium transition-colors ${
                watchedConfig.print_type === type
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-outline hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                {...register('print_type')}
                value={type}
                className="hidden"
              />
              {PRINT_TYPE_LABEL[type]}
            </label>
          ))}
        </div>
        {errors.print_type && (
          <p className="mt-1 text-xs text-red-500">{errors.print_type.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Ukuran Kertas</label>
        <div className="mt-2 flex gap-3">
          {['A4', 'F4', 'A3'].map((size) => (
            <label
              key={size}
              className={`flex-1 cursor-pointer rounded-lg border p-4 text-center text-sm font-medium transition-colors ${
                watchedConfig.paper_size === size
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-outline hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                {...register('paper_size')}
                value={size}
                className="hidden"
              />
              {PAPER_SIZE_LABEL[size]}
            </label>
          ))}
        </div>
        {errors.paper_size && (
          <p className="mt-1 text-xs text-red-500">{errors.paper_size.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Jumlah Copy</label>
        <input
          type="number"
          {...register('copies', { valueAsNumber: true })}
          min={1}
          max={999}
          className="border-outline mt-1 block w-32 rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {errors.copies && (
          <p className="mt-1 text-xs text-red-500">{errors.copies.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Catatan (opsional)</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="border-outline mt-1 block w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Contoh: jilid spiral, print bolak-balik, dll."
        />
      </div>
    </div>
  )
}