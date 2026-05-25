import { Link } from 'react-router-dom'
import { Printer, Upload, QrCode, Clock } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: 'Upload File',
    desc: 'Unggah dokumen yang ingin dicetak (PDF, DOCX, JPG, PNG)',
  },
  {
    icon: Printer,
    title: 'Konfigurasi Cetak',
    desc: 'Pilih jenis cetak, ukuran kertas, dan jumlah copy',
  },
  {
    icon: QrCode,
    title: 'Pilih Pembayaran',
    desc: 'Bayar di toko atau via QRIS',
  },
  {
    icon: Clock,
    title: 'Ambil Pesanan',
    desc: 'Datang ke toko saat pesanan sudah siap',
  },
]

const services = [
  { name: 'Fotokopi Hitam Putih A4', price: 'Rp 150/lembar' },
  { name: 'Fotokopi Berwarna A4', price: 'Rp 500/lembar' },
  { name: 'Fotokopi Hitam Putih F4', price: 'Rp 200/lembar' },
  { name: 'Fotokopi Berwarna F4', price: 'Rp 600/lembar' },
  { name: 'Cetak Hitam Putih A3', price: 'Rp 300/lembar' },
  { name: 'Cetak Berwarna A3', price: 'Rp 1.000/lembar' },
]

export default function Landing() {
  return (
    <>
      <section className="from-primary/5 bg-linear-to-b to-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-primary md:text-5xl">
            Printing Tanpa Antre
          </h1>
          <p className="text-muted mt-4 text-lg">
            Pesan cetak dan fotokopi online. Upload file, atur spesifikasi, dan
            ambil pesanan saat sudah siap.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-primary hover:bg-primary-dark rounded-lg px-8 py-3 font-medium text-white transition-colors"
            >
              Mulai Sekarang
            </Link>
            <Link
              to="/login"
              className="border-outline text-primary hover:bg-surface rounded-lg border px-8 py-3 font-medium transition-colors"
            >
              Masuk
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-heading text-center text-2xl font-bold">
            Cara Kerja
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="text-center">
                  <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="text-muted mt-2 text-sm">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-heading text-center text-2xl font-bold">
            Daftar Harga
          </h2>
          <div className="mt-8 overflow-hidden rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-3 font-medium">Layanan</th>
                  <th className="px-6 py-3 font-medium">Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {services.map((s, i) => (
                  <tr key={i} className="hover:bg-surface/50">
                    <td className="px-6 py-3">{s.name}</td>
                    <td className="px-6 py-3 font-medium">{s.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted mt-4 text-center text-sm">
            * Harga dapat berubah sewaktu-waktu
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-heading text-2xl font-bold">
            Informasi Toko
          </h2>
          <div className="mt-6 space-y-2 text-muted">
            <p>Jl. Raya Sekaran, Gunungpati, Semarang</p>
            <p>Senin &ndash; Jumat: 08.00 &ndash; 17.00</p>
            <p>Sabtu: 08.00 &ndash; 14.00</p>
            <p>WhatsApp: 0812-3456-7890</p>
          </div>
        </div>
      </section>
    </>
  )
}
