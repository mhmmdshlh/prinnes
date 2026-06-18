import { createContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase/client'
import { getProfile } from '../lib/supabase/auth'
import { queryKeys } from '../lib/query/keys'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [sessionLoading, setSessionLoading] = useState(true)

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: queryKeys.user.profile(user?.id),
    queryFn: () => getProfile(user.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })

  const loading = sessionLoading || (!!user && profileLoading)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null)
      setSessionLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => listener?.subscription.unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      user,
      profile: profile ?? null,
      loading,
      isAdmin: profile?.role === 'admin',
      isCustomer: profile?.role === 'customer',
    }),
    [user, profile, loading]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


