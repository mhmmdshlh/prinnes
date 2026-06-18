import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth-context'
import * as queries from '../lib/supabase/queries'
import { supabase } from '../lib/supabase/client'
import { queryKeys } from '../lib/query/keys'

export function useOrders() {
  const { user } = useAuth()

  const { data: orders = [], isLoading } = useQuery({
    queryKey: queryKeys.orders.byUser(user?.id),
    queryFn: () => queries.getOrdersByUser(user.id),
    enabled: !!user,
  })

  return { orders, loading: isLoading }
}

export function useActiveOrders() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: orders = [], isLoading } = useQuery({
    queryKey: queryKeys.orders.active(user?.id),
    queryFn: () => queries.getActiveOrdersByUser(user.id),
    enabled: !!user,
  })

  useEffect(() => {
    if (!user) return

    const subscription = supabase
      .channel('active-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.orders.active(user.id),
          })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, queryClient])

  return { orders, loading: isLoading }
}

export function useOrderDetail(orderId) {
  const { data: order = null, isLoading } = useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => queries.getOrderById(orderId),
    enabled: !!orderId,
  })

  return { order, loading: isLoading }
}

export function useAllOrders(filters) {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: queryKeys.orders.all(filters),
    queryFn: () => queries.getAllOrders(filters),
  })

  return { orders, loading: isLoading }
}