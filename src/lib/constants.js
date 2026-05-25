export const ORDER_STATUS = {
  MENUNGGU: 'menunggu',
  DIPROSES: 'diproses',
  SELESAI: 'selesai',
  SIAP_DIAMBIL: 'siap_diambil',
}

export const ORDER_STATUS_LABEL = {
  menunggu: 'Menunggu',
  diproses: 'Diproses',
  selesai: 'Selesai',
  siap_diambil: 'Siap Diambil',
}

export const PAYMENT_STATUS = {
  BELUM_DIBAYAR: 'belum_dibayar',
  MENUNGGU_VERIFIKASI: 'menunggu_verifikasi',
  LUNAS: 'lunas',
  DITOLAK: 'ditolak',
}

export const PAYMENT_STATUS_LABEL = {
  belum_dibayar: 'Belum Dibayar',
  menunggu_verifikasi: 'Menunggu Verifikasi',
  lunas: 'Lunas',
  ditolak: 'Ditolak',
}

export const PAYMENT_METHOD_LABEL = {
  toko: 'Bayar di Toko',
  qris: 'QRIS',
}

export const PRINT_TYPE_LABEL = {
  bw: 'Hitam Putih',
  color: 'Berwarna',
}

export const PAPER_SIZE_LABEL = {
  A4: 'A4',
  F4: 'F4',
  A3: 'A3',
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CUSTOMER_DASHBOARD: '/dashboard',
  CREATE_ORDER: '/pesanan/buat',
  ORDERS: '/pesanan',
  ORDER_DETAIL: '/pesanan/:id',
  HISTORY: '/riwayat',
  HISTORY_DETAIL: '/riwayat/:id',
  PROFILE: '/profil',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ORDERS: '/admin/pesanan',
  ADMIN_ORDER_DETAIL: '/admin/pesanan/:id',
  ADMIN_QUEUE: '/admin/antrian',
  ADMIN_PAYMENTS: '/admin/pembayaran',
  ADMIN_PRICES: '/admin/harga',
}
