export const queryKeys = {
  user: {
    profile: (userId) => ['user', 'profile', userId],
  },
  prices: ['prices'],
  orders: {
    byUser: (userId) => ['orders', 'byUser', userId],
    active: (userId) => ['orders', 'active', userId],
    detail: (orderId) => ['orders', 'detail', orderId],
    all: (filters) => ['orders', 'all', filters],
    queue: ['orders', 'queue'],
    stats: ['orders', 'stats'],
  },
  reports: (preset) => ['reports', preset],
  store: ['store', 'status'],
  payments: ['payments', 'pending'],
  rejectedPayments: ['payments', 'rejected'],
}
