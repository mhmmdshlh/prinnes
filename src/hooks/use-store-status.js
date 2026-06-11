import { useCallback, useEffect, useState } from 'react'
import * as queries from '../lib/supabase/queries'
import { supabase } from '../lib/supabase/client'

export function useStoreStatus() {
  const [isOpen, setIsOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  const fetchStatus = useCallback(async () => {
    try {
      const status = await queries.getStoreStatus()
      setIsOpen(status)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

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
        () => fetchStatus()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchStatus])

  async function toggle() {
    const next = !isOpen
    setIsOpen(next)
    try {
      await queries.setStoreStatus(next)
    } catch (e) {
      setIsOpen(!next)
      console.error(e)
    }
  }

  return { isOpen, loading, toggle }
}
