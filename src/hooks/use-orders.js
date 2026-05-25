import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './use-auth-context'
import * as queries from '../lib/supabase/queries'
import { supabase } from '../lib/supabase/client'

export function useOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    queries
      .getOrdersByUser(user.id)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  return { orders, loading }
}

export function useActiveOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    if (!user) return
    try {
      const data = await queries.getActiveOrdersByUser(user.id)
      setOrders(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

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
        () => fetchOrders()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, fetchOrders])

  return { orders, loading }
}

export function useOrderDetail(orderId) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    queries
      .getOrderById(orderId)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [orderId])

  return { order, loading }
}

export function useAllOrders(filters) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await queries.getAllOrders(filters)
      setOrders(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return { orders, loading, refetch: fetchOrders }
}
