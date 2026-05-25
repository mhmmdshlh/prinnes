import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client'

export function useRealtimeSubscription(channelName, table, filter, callback) {
  useEffect(() => {
    const subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        (payload) => callback?.(payload)
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [channelName, table, JSON.stringify(filter)])
}

export function useStorageDownload(path) {
  const [url, setUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!path) {
      setLoading(false)
      return
    }

    const { data } = supabase.storage.from('order-files').getPublicUrl(path)
    setUrl(data.publicUrl)
    setLoading(false)
  }, [path])

  return { url, loading }
}
