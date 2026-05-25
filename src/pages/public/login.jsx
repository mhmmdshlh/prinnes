import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../lib/utils/validation'
import { useAuthActions } from '../../hooks/use-auth'
import { useState } from 'react'
import FormInput from '../../components/ui/FormInput'

export default function Login() {
  const { login } = useAuthActions()
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data) {
    try {
      setError('')
      await login(data)
    } catch (e) {
      setError(e.message || 'Login gagal. Periksa email dan password Anda.')
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">
                  Keamanan Terjamin
                </p>
                <p className="text-xs text-gray-500">
                  Data Anda aman dengan enkripsi end-to-end
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
              Masuk
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Masukkan kredensial akun Anda
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <FormInput
              label="Email"
              type="email"
              placeholder="contoh@mail.com"
              error={errors.email}
              registration={register('email')}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="********"
              error={errors.password}
              registration={register('password')}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isSubmitting ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary hover:text-primary-dark"
              >
                Daftar
              </Link>
            </p>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6 text-center">
            <Link
              to="/admin/login"
              className="text-xs text-gray-400 transition-colors hover:text-primary"
            >
              Login Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}