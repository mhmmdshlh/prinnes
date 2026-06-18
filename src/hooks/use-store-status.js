import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as queries from '../lib/supabase/queries'
import { supabase } from '../lib/supabase/client'
import { queryKeys } from '../lib/query/keys'

export function useStoreStatus() {
  const queryClient = useQueryClient()

  const { data: isOpen = true, isLoading } = useQuery({
    queryKey: queryKeys.store,
    queryFn: queries.getStoreStatus,
    staleTime: 60_000,
  })

  useEffect(() => {
    const subscription = supabase
      .channel('store-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'store_settings',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.store })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  const toggleMutation = useMutation({
    mutationFn: (next) => queries.setStoreStatus(next),
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.store })
      const previous = queryClient.getQueryData(queryKeys.store)
      queryClient.setQueryData(queryKeys.store, next)
      return { previous }
    },
    onError: (_err, _next, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKeys.store, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.store })
    },
  })

  function toggle() {
    toggleMutation.mutate(!isOpen)
  }

  return { isOpen, loading: isLoading, toggle }
}