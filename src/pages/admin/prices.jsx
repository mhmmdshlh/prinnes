import { useState } from 'react'
import { Save } from 'lucide-react'
import { useServicePrices } from '../../hooks/use-prices'
import { useUpdateServicePrice } from '../../hooks/use-mutations'
import { formatCurrency } from '../../lib/utils/format'
import { PRINT_TYPE_LABEL, PAPER_SIZE_LABEL } from '../../lib/constants'

export default function AdminPrices() {
  const { prices, loading, refetch } = useServicePrices()
  const updatePriceMutation = useUpdateServicePrice()
  const [editValues, setEditValues] = useState({})

  function handleEdit(id, value) {
    setEditValues((prev) => ({ ...prev, [id]: value }))
  }

  async function handleSave(id) {
    const newPrice = editValues[id]
    if (!newPrice || isNaN(newPrice)) return

    try {
      await updatePriceMutation.mutateAsync({ id, pricePerPage: newPrice })
      setEditValues((prev) => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
      refetch()
    } catch (e) {
      console.error(e)
    }
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
      <h1 className="font-heading text-2xl font-bold">Kelola Harga Layanan</h1>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-3 font-medium">Jenis Cetak</th>
              <th className="px-6 py-3 font-medium">Ukuran Kertas</th>
              <th className="px-6 py-3 font-medium">Harga per Lembar</th>
              <th className="px-6 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {prices.map((price) => (
              <tr key={price.id} className="hover:bg-surface/50">
                <td className="px-6 py-4 font-medium">
                  {PRINT_TYPE_LABEL[price.print_type]}
                </td>
                <td className="px-6 py-4">{PAPER_SIZE_LABEL[price.paper_size]}</td>
                <td className="px-6 py-4">
                  {editValues[price.id] !== undefined ? (
                    <div className="flex items-center gap-2">
                      <span className="text-muted">Rp</span>
                      <input
                        type="number"
                        value={editValues[price.id]}
                        onChange={(e) =>
                          handleEdit(price.id, e.target.value)
                        }
                        className="border-outline w-28 rounded-lg border px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        min={0}
                      />
                    </div>
                  ) : (
                    <span className="font-medium">
                      {formatCurrency(price.price_per_page)}/lembar
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editValues[price.id] !== undefined ? (
                    <button
                      onClick={() => handleSave(price.id)}
                      disabled={updatePriceMutation.isPending}
                      className="bg-primary hover:bg-primary-dark disabled:bg-muted flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium text-white transition-colors disabled:cursor-not-allowed"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {updatePriceMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleEdit(price.id, price.price_per_page)
                      }
                      className="border-outline text-muted hover:bg-surface rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
