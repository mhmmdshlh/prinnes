import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Printer, Shield } from 'lucide-react'
import { adminLoginSchema } from '../../lib/utils/validation'
import { useAuthActions } from '../../hooks/use-auth'
import { useState } from 'react'
import FormInput from '../../components/ui/FormInput'

export default function AdminLogin() {
  const { loginAsAdmin } = useAuthActions()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
  })

  async function onSubmit(data) {
    try {
      setError('')
      await loginAsAdmin(data)
    } catch (e) {
      setError(e.message || 'Login gagal. Periksa kredensial Anda.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <Printer className="h-8 w-8 text-primary" />
            <span className="font-heading text-2xl font-bold text-primary">
              PrinNes
            </span>
          </div>
          <div className="bg-primary/10 mx-auto mt-4 flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            Panel Admin
          </div>
        </div>

        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="font-heading text-center text-xl font-bold">
            Login Admin
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <FormInput
              label="Email"
              type="email"
              placeholder="admin@toko.com"
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
              className="bg-primary hover:bg-primary-dark disabled:bg-muted w-full rounded-lg py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Memproses...' : 'Masuk sebagai Admin'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-muted hover:text-primary text-sm transition-colors"
            >
              Login sebagai Pelanggan
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}