import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as queries from '../lib/supabase/queries'
import { queryKeys } from '../lib/query/keys'

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, status }) => queries.updateOrderStatus(orderId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.queue })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.stats })
    },
  })
}

export function useVerifyPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ paymentId, adminId, action, rejectionNote }) =>
      queries.verifyPayment(paymentId, adminId, action, rejectionNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments })
      queryClient.invalidateQueries({ queryKey: queryKeys.rejectedPayments })
    },
  })
}

export function useUpdateServicePrice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, pricePerPage }) => queries.updateServicePrice(id, pricePerPage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prices })
    },
  })
}

export function useUploadPaymentProof() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, file }) => queries.uploadPaymentProof(orderId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(variables.orderId),
      })
    },
  })
}
