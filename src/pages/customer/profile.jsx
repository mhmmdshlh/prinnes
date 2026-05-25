import { useAuth } from '../../hooks/use-auth-context'
import { formatDate } from '../../lib/utils/format'
import { User } from 'lucide-react'

export default function Profile() {
  const { profile } = useAuth()

  if (!profile) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-heading text-2xl font-bold">Profil</h1>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center pb-6">
          <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-heading mt-4 text-xl font-bold">
            {profile.name}
          </h2>
          <p className="text-muted text-sm">{profile.role === 'customer' ? 'Pelanggan' : 'Admin'}</p>
        </div>

        <dl className="space-y-3 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Email</dt>
            <dd className="font-medium">{profile.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">WhatsApp</dt>
            <dd className="font-medium">{profile.phone}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Bergabung</dt>
            <dd className="font-medium">{formatDate(profile.created_at)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
