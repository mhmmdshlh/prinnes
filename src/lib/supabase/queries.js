import { supabase } from './client'

/* ───────── ORDERS ───────── */

export async function createOrder(orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getOrdersByUser(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_files(*), payments(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getActiveOrdersByUser(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_files(*)')
    .eq('user_id', userId)
    .in('status', ['menunggu', 'diproses'])
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getOrderById(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_files(*), payments(*)')
    .eq('id', orderId)
    .single()
  if (error) throw error
  return data
}

export async function getAllOrders(filters = {}) {
  let query = supabase
    .from('orders')
    .select('*, order_files(*), payments(*), users(name, phone)')
    .order('created_at', { ascending: false })

  if (filters.status) query = query.eq('status', filters.status)
  if (filters.payment_method)
    query = query.eq('payment_method', filters.payment_method)
  if (filters.date) query = query.gte('created_at', filters.date)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getNextQueueNumber() {
  const { data, error } = await supabase.rpc('get_next_queue_number')

  if (error) throw error

  return data
}

export async function getTodayOrderStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data, error } = await supabase
    .from('orders')
    .select('status, total_price')
    .gte('created_at', today.toISOString())
    .lt('created_at', tomorrow.toISOString())

  if (error) throw error

  return {
    total: data.length,
    menunggu: data.filter((o) => o.status === 'menunggu').length,
    diproses: data.filter((o) => o.status === 'diproses').length,
    selesai: data.filter((o) => o.status === 'selesai').length,
    revenue: data
      .filter((o) => o.status === 'selesai')
      .reduce((sum, o) => sum + Number(o.total_price), 0),
  }
}

/* ───────── ORDER FILES ───────── */

export async function uploadOrderFile(orderId, file) {
  const fileExt = file.name.split('.').pop()
  const filePath = `${orderId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('order-files')
    .upload(filePath, file)
  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage
    .from('order-files')
    .getPublicUrl(filePath)

  const { data, error } = await supabase
    .from('order_files')
    .insert({
      order_id: orderId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
    })
    .select()
    .single()

  if (error) throw error
  return { ...data, public_url: urlData.publicUrl }
}

export async function deleteOrderFile(fileId, filePath) {
  const { error: storageError } = await supabase.storage
    .from('order-files')
    .remove([filePath])
  if (storageError) throw storageError

  const { error } = await supabase
    .from('order_files')
    .delete()
    .eq('id', fileId)
  if (error) throw error
}

/* ───────── PAYMENTS ───────── */

export async function uploadPaymentProof(orderId, file) {
  const fileExt = file.name.split('.').pop()
  const filePath = `payments/${orderId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('payment-proofs')
    .upload(filePath, file)
  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage
    .from('payment-proofs')
    .getPublicUrl(filePath)

  const { data, error } = await supabase
    .from('payments')
    .upsert({
      order_id: orderId,
      proof_image: filePath,
    })
    .select()
    .single()

  if (error) throw error

  await supabase
    .from('orders')
    .update({ payment_status: 'menunggu_verifikasi', updated_at: new Date().toISOString() })
    .eq('id', orderId)

  return { ...data, public_url: urlData.publicUrl }
}

export async function getPendingPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*, orders!inner(id, queue_number, users!inner(name, phone))')
    .is('verified_by', null)

  if (error) throw error
  return data
}

export async function verifyPayment(paymentId, adminId, action, rejectionNote) {
  const updateData = {
    verified_by: adminId,
    verified_at: new Date().toISOString(),
  }

  if (action === 'tolak' && rejectionNote) {
    updateData.rejection_note = rejectionNote
  }

  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', paymentId)
    .select()
    .single()

  if (paymentError) throw paymentError

  const paymentStatus = action === 'setujui' ? 'lunas' : 'ditolak'
  const { error: orderError } = await supabase
    .from('orders')
    .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
    .eq('id', payment.order_id)

  if (orderError) throw orderError

  return payment
}

/* ───────── SERVICE PRICES ───────── */

export async function getServicePrices() {
  const { data, error } = await supabase
    .from('service_prices')
    .select('*')
    .order('print_type')
    .order('paper_size')
  if (error) throw error
  return data
}

export async function updateServicePrice(id, pricePerPage) {
  const { data, error } = await supabase
    .from('service_prices')
    .update({ price_per_page: pricePerPage })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/* ───────── QUEUE ───────── */

export async function getActiveQueue() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, queue_number, status, user_id, users(name), print_type, paper_size, copies, order_files(file_name)')
    .in('status', ['menunggu', 'diproses'])
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function markAsProcessing(orderId) {
  return updateOrderStatus(orderId, 'diproses')
}

export async function markAsCompleted(orderId) {
  return updateOrderStatus(orderId, 'selesai')
}

export async function getLatestOrderNumberToday() {
  const dateStr = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('queue_sequence')
    .select('last_number')
    .eq('date', dateStr)
    .maybeSingle()

  if (error) throw error

  if (!data) return 'A001'

  const num = Number(data.last_number) + 1
  return `A${String(num).padStart(3, '0')}`
}

export async function getLastCompletedOrder() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data, error } = await supabase
    .from('orders')
    .select('queue_number')
    .eq('status', 'selesai')
    .gte('created_at', today.toISOString())
    .lt('created_at', tomorrow.toISOString())
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error

  return data
}

export async function markPaymentAsPaid(orderId) {
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: 'lunas', updated_at: new Date().toISOString() })
    .eq('id', orderId)
  if (error) throw error
}

/* ───────── STORE SETTINGS ───────── */

export async function getStoreStatus() {
  const { data, error } = await supabase
    .from('store_settings')
    .select('is_open')
    .single()
  if (error) throw error
  return data.is_open
}

export async function setStoreStatus(isOpen) {
  const { error } = await supabase
    .from('store_settings')
    .update({ is_open: isOpen })
    .eq('id', 1)
  if (error) throw error
}

/* ───────── PAPER ESTIMATES ───────── */

export async function getTodayPaperEstimates() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data, error } = await supabase
    .from('orders')
    .select('print_type, paper_size, pages, copies')
    .in('status', ['menunggu', 'diproses'])
    .gte('created_at', today.toISOString())
    .lt('created_at', tomorrow.toISOString())

  if (error) throw error

  const groups = {}
  for (const o of data) {
    const key = `${o.print_type}_${o.paper_size}`
    if (!groups[key]) {
      groups[key] = { print_type: o.print_type, paper_size: o.paper_size, total_sheets: 0 }
    }
    groups[key].total_sheets += Number(o.pages) * Number(o.copies)
  }

  return Object.values(groups).sort((a, b) => {
    if (a.print_type !== b.print_type) return a.print_type.localeCompare(b.print_type)
    return a.paper_size.localeCompare(b.paper_size)
  })
}

/* ───────── HOURLY STATS ───────── */

export async function getTodayHourlyOrders() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data, error } = await supabase
    .from('orders')
    .select('created_at')
    .gte('created_at', today.toISOString())
    .lt('created_at', tomorrow.toISOString())

  if (error) throw error

  const hourly = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }))
  for (const o of data) {
    const h = new Date(o.created_at).getHours()
    hourly[h].count++
  }

  return hourly.filter((h) => h.count > 0)
}

/* ───────── REPORTS ───────── */

export async function getReportOrders({ startDate, endDate }) {
  let query = supabase
    .from('orders')
    .select('*, users!inner(name, phone)')
    .eq('status', 'selesai')
    .order('created_at', { ascending: true })

  if (startDate) query = query.gte('created_at', startDate)
  if (endDate) query = query.lt('created_at', endDate)

  const { data, error } = await query
  if (error) throw error
  return data
}
