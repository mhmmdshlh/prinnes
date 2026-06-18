import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as queries from '../lib/supabase/queries'
import { supabase } from '../lib/supabase/client'
import { queryKeys } from '../lib/query/keys'

export function useActiveQueue() {
  const queryClient = useQueryClient()

  const {
    data: queue = [],
    isLoading: queueLoading,
    refetch: refetchQueue,
  } = useQuery({
    queryKey: queryKeys.orders.queue,
    queryFn: queries.getActiveQueue,
  })

  const {
    data: stats = null,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: queryKeys.orders.stats,
    queryFn: queries.getTodayOrderStats,
  })

  function refetch() {
    refetchQueue()
    refetchStats()
  }

  useEffect(() => {
    const subscription = supabase
      .channel('queue-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            queryClient.invalidateQueries({
              queryKey: queryKeys.orders.queue,
            })
            queryClient.invalidateQueries({
              queryKey: queryKeys.orders.stats,
            })
          } else if (payload.eventType === 'UPDATE') {
            if (payload.old.status !== payload.new.status) {
              queryClient.invalidateQueries({
                queryKey: queryKeys.orders.queue,
              })
              queryClient.invalidateQueries({
                queryKey: queryKeys.orders.stats,
              })
            }
            queryClient.invalidateQueries({
              queryKey: queryKeys.orders.detail(payload.new.id),
            })
          } else if (payload.eventType === 'DELETE') {
            queryClient.invalidateQueries({
              queryKey: queryKeys.orders.queue,
            })
            queryClient.invalidateQueries({
              queryKey: queryKeys.orders.stats,
            })
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  return {
    queue,
    stats,
    loading: queueLoading || statsLoading,
    refetch,
  }
}