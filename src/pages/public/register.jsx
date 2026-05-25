import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../lib/utils/validation'
import { useAuthActions } from '../../hooks/use-auth'
import { useState } from 'react'
import FormInput from '../../components/ui/FormInput'

export default function Register() {
  const { register: registerUser } = useAuthActions()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data) {
    try {
      setError('')
      await registerUser(data)
    } catch (e) {
      setError(e.message || 'Registrasi gagal. Silakan coba lagi.')
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-center bg-primary/10 p-16 lg:flex">
        <div className="mx-auto max-w-md">
          <div className="mb-12">
            <h1 className="font-heading text-3xl font-bold text-primary">
              PrinNes
            </h1>
          </div>

          <div className="relative">
            <div className="mb-8">
              <h2 className="font-heading text-4xl font-bold leading-tight text-primary">
                Solusi Cerdas
                <br />
                untuk Bisnismu
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Kelola pesanan, lacak progress, dan tingkatkan
                produktivitas usaha percetakan Anda dalam satu
                platform terintegrasi.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white/60 p-6 backdrop-blur-sm">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">
                  Bergabung Gratis
                </p>
                <p className="text-xs text-gray-500">
                  Daftar sekarang dan nikmati kemudahan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-primary">
              Daftar
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Buat akun baru Anda
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <FormInput
              label="Nama Lengkap"
              type="text"
              placeholder="Nama Anda"
              error={errors.name}
              registration={register('name')}
            />

            <FormInput
              label="Email"
              type="email"
              placeholder="contoh@mail.com"
              error={errors.email}
              registration={register('email')}
            />

            <FormInput
              label="Nomor WhatsApp"
              type="tel"
              placeholder="081234567890"
              error={errors.phone}
              registration={register('phone')}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="Minimal 6 karakter"
              error={errors.password}
              registration={register('password')}
            />

            <FormInput
              label="Konfirmasi Password"
              type="password"
              placeholder="Ulangi password"
              error={errors.confirmPassword}
              registration={register('confirmPassword')}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isSubmitting ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary hover:text-primary-dark"
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}