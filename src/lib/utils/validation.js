import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    phone: z
      .string()
      .min(10, 'Nomor WA minimal 10 digit')
      .regex(/^[0-9]+$/, 'Nomor WA hanya angka'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  })

export const adminLoginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
})

export const orderConfigSchema = z.object({
  print_type: z.enum(['bw', 'color'], {
    required_error: 'Pilih jenis cetak',
  }),
  paper_size: z.enum(['A4', 'F4', 'A3'], {
    required_error: 'Pilih ukuran kertas',
  }),
  copies: z
    .number()
    .min(1, 'Minimal 1 copy')
    .max(999, 'Maksimal 999 copy'),
  notes: z.string().optional(),
})

export const paymentMethodSchema = z.object({
  payment_method: z.enum(['toko', 'qris'], {
    required_error: 'Pilih metode pembayaran',
  }),
})

export const allowedFileTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'image/jpeg',
  'image/png',
]

export const MAX_FILE_SIZE = 20 * 1024 * 1024
