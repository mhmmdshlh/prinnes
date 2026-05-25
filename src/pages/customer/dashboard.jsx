import { Link } from 'react-router-dom'
import { PlusCircle, ClipboardList, Clock } from 'lucide-react'
import { useAuth } from '../../hooks/use-auth-context'
import { useActiveOrders } from '../../hooks/use-orders'

export default function CustomerDashboard() {
  const { profile } = useAuth()
  const { orders, loading } = useActiveOrders()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">
          Halo, {profile?.name}
        </h1>
        <p className="text-muted mt-1">Selamat datang di PrinNes</p>
      </div>

      <Link
        to="/pesanan/buat"
        className="bg-primary hover:bg-primary-dark flex items-center justify-center gap-3 rounded-xl px-6 py-5 text-white transition-colors"
      >
        <PlusCircle className="h-6 w-6" />
        <span className="font-heading text-lg font-semibold">
          Buat Pesanan Baru
        </span>
      </Link>

      <section>
        <h2 className="font-heading mb-4 text-lg font-semibold">
          Pesanan Aktif
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <ClipboardList className="text-muted h-12 w-12" />
            <p className="text-muted mt-4">Belum ada pesanan aktif</p>
            <Link
              to="/pesanan/buat"
              className="text-primary mt-2 text-sm font-medium hover:underline"
            >
              Buat pesanan sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/pesanan/${order.id}`}
                className="border-outline hover:border-primary block rounded-xl border bg-white p-4 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-heading text-primary text-lg font-bold">
                      {order.queue_number}
                    </span>
                    <p className="text-muted mt-0.5 text-sm">
                      {order.print_type === 'bw' ? 'Hitam Putih' : 'Berwarna'}{' '}
                      &middot; {order.paper_size} &middot; {order.copies} copy
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted h-4 w-4" />
                    <span className="text-sm font-medium capitalize">
                      {order.status === 'menunggu'
                        ? 'Menunggu'
                        : order.status === 'diproses'
                          ? 'Diproses'
                          : 'Selesai'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
