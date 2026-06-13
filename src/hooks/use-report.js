import { useCallback, useEffect, useMemo, useState } from 'react'
import * as queries from '../lib/supabase/queries'

const presets = {
  today: () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const end = new Date(start)
    end.setDate(end.getDate() + 1)
    return { startDate: start.toISOString(), endDate: end.toISOString(), label: 'Hari Ini' }
  },
  '7days': () => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    end.setDate(end.getDate() + 1)
    return { startDate: start.toISOString(), endDate: end.toISOString(), label: '7 Hari Terakhir' }
  },
  month: () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return { startDate: start.toISOString(), endDate: end.toISOString(), label: 'Bulan Ini' }
  },
  all: () => ({ startDate: null, endDate: null, label: 'Semua Waktu' }),
}

export function useReportData() {
  const [preset, setPreset] = useState('today')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const { startDate, endDate } = presets[preset]()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await queries.getReportOrders({ startDate, endDate })
      setOrders(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const summary = useMemo(() => {
    const revenue = orders.reduce((sum, o) => sum + Number(o.total_price), 0)
    return { totalRevenue: revenue, totalOrders: orders.length }
  }, [orders])

  const printBreakdown = useMemo(() => {
    const groups = {}
    for (const o of orders) {
      const key = `${o.print_type}_${o.paper_size}`
      if (!groups[key]) {
        groups[key] = { print_type: o.print_type, paper_size: o.paper_size, count: 0 }
      }
      groups[key].count++
    }
    return Object.values(groups).sort((a, b) => {
      if (a.print_type !== b.print_type) return a.print_type.localeCompare(b.print_type)
      return a.paper_size.localeCompare(b.paper_size)
    })
  }, [orders])

  const revenueTrend = useMemo(() => {
    const daily = {}
    for (const o of orders) {
      const dateKey = new Date(o.created_at).toISOString().split('T')[0]
      if (!daily[dateKey]) daily[dateKey] = 0
      daily[dateKey] += Number(o.total_price)
    }
    return Object.entries(daily)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [orders])

  const presetLabel = presets[preset]().label

  return {
    orders,
    loading,
    preset,
    setPreset,
    presetLabel,
    summary,
    printBreakdown,
    revenueTrend,
    refetch: fetchData,
  }
}
