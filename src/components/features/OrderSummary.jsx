import { formatCurrency } from '../../lib/utils/format'
import { PRINT_TYPE_LABEL, PAPER_SIZE_LABEL } from '../../lib/constants'

export default function OrderSummary({ config, filesCount, totalPages, totalPrice, paymentForm }) {
  return (
    <>
      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold">Ringkasan Pesanan</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">File</span>
            <span>{filesCount} file</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Jenis Cetak</span>
            <span>{PRINT_TYPE_LABEL[config.print_type]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Ukuran Kertas</span>
            <span>{PAPER_SIZE_LABEL[config.paper_size]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Jumlah Halaman</span>
            <span>{totalPages}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Jumlah Copy</span>
            <span>{config.copies}x</span>
          </div>
          <div className="border-outline flex justify-between border-t pt-2 font-medium">
            <span>Total Estimasi</span>
            <span className="text-primary font-heading text-lg">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-heading mb-4 text-lg font-semibold">Metode Pembayaran</h2>
        <div className="space-y-3">
          {[
            { value: 'toko', label: 'Bayar di Toko', desc: 'Bayar tunai saat mengambil pesanan' },
            { value: 'qris', label: 'QRIS', desc: 'Scan QR code dan upload bukti pembayaran' },
          ].map((method) => (
            <label
              key={method.value}
              className={`block cursor-pointer rounded-lg border p-4 transition-colors ${
                paymentForm.watch('payment_method') === method.value
                  ? 'border-primary bg-primary/5'
                  : 'border-outline hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  {...paymentForm.register('payment_method')}
                  value={method.value}
                  className="text-primary accent-primary"
                />
                <div>
                  <p className="text-sm font-medium">{method.label}</p>
                  <p className="text-muted text-xs">{method.desc}</p>
                </div>
              </div>
            </label>
          ))}
          {paymentForm.formState.errors.payment_method && (
            <p className="text-xs text-red-500">
              {paymentForm.formState.errors.payment_method.message}
            </p>
          )}
        </div>
      </div>
    </>
  )
}