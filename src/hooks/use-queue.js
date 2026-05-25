import { useCallback, useEffect, useState } from 'react'
import * as queries from '../lib/supabase/queries'
import { supabase } from '../lib/supabase/client'

export function useActiveQueue() {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  const fetchQueue = useCallback(async () => {
    try {
      const [queueData, statsData] = await Promise.all([
        queries.getActiveQueue(),
        queries.getTodayOrderStats(),
      ])
      setQueue(queueData)
      setStats(statsData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

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
        () => fetchQueue()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchQueue])

  return { queue, stats, loading, refetch: fetchQueue }
}
