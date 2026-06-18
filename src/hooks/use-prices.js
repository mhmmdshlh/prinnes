import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as queries from '../lib/supabase/queries'
import { queryKeys } from '../lib/query/keys'

export function useServicePrices() {
  const { data: prices = [], isLoading, refetch } = useQuery({
    queryKey: queryKeys.prices,
    queryFn: queries.getServicePrices,
    staleTime: 5 * 60 * 1000,
  })

  return { prices, loading: isLoading, refetch }
}

export function useCalculatePrice() {
  const { prices, loading } = useServicePrices()

  const calculate = useCallback(
    ({ print_type, paper_size, pages, copies }) => {
      const price = prices.find(
        (p) => p.print_type === print_type && p.paper_size === paper_size
      )
      if (!price) return 0
      return Number(price.price_per_page) * pages * copies
    },
    [prices]
  )

  return { prices, calculate, loading }
}