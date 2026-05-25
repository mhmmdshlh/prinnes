import { useCallback, useEffect, useState } from 'react'
import * as queries from '../lib/supabase/queries'

export function useServicePrices() {
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPrices = useCallback(async () => {
    setLoading(true)
    try {
      const data = await queries.getServicePrices()
      setPrices(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  return { prices, loading, refetch: fetchPrices }
}

export function useCalculatePrice() {
  const { prices } = useServicePrices()

  const calculate = useCallback(
    ({ print_type, paper_size, copies }) => {
      const price = prices.find(
        (p) => p.print_type === print_type && p.paper_size === paper_size
      )
      if (!price) return 0
      return Number(price.price_per_page) * copies
    },
    [prices]
  )

  return { prices, calculate }
}
