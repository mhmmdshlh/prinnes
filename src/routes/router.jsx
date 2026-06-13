import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from './protected-route'
import { AdminRoute } from './admin-route'

import PublicLayout from '../layouts/public-layout'
import CustomerLayout from '../layouts/customer-layout'
import AdminLayout from '../layouts/admin-layout'

import Landing from '../pages/public/landing'
import Login from '../pages/public/login'
import Register from '../pages/public/register'

import CustomerDashboard from '../pages/customer/dashboard'
import CreateOrder from '../pages/customer/create-order'
import Orders from '../pages/customer/orders'
import OrderDetail from '../pages/customer/order-detail'
import History from '../pages/customer/history'
import HistoryDetail from '../pages/customer/history-detail'
import Profile from '../pages/customer/profile'

import AdminLogin from '../pages/admin/login'
import AdminDashboard from '../pages/admin/dashboard'
import AdminOrders from '../pages/admin/orders'
import AdminOrderDetail from '../pages/admin/order-detail'
import AdminQueue from '../pages/admin/queue'
import AdminPayments from '../pages/admin/payments'
import AdminPrices from '../pages/admin/prices'
import AdminReport from '../pages/admin/AdminReport'

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Landing /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    element: (
      <ProtectedRoute>
        <CustomerLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <CustomerDashboard /> },
      { path: '/pesanan/buat', element: <CreateOrder /> },
      { path: '/pesanan', element: <Orders /> },
      { path: '/pesanan/:id', element: <OrderDetail /> },
      { path: '/riwayat', element: <History /> },
      { path: '/riwayat/:id', element: <HistoryDetail /> },
      { path: '/profil', element: <Profile /> },
    ],
  },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: '/admin/dashboard', element: <AdminDashboard /> },
      { path: '/admin/pesanan', element: <AdminOrders /> },
      { path: '/admin/pesanan/:id', element: <AdminOrderDetail /> },
      { path: '/admin/antrian', element: <AdminQueue /> },
      { path: '/admin/pembayaran', element: <AdminPayments /> },
      { path: '/admin/harga', element: <AdminPrices /> },
      { path: '/admin/laporan', element: <AdminReport /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
