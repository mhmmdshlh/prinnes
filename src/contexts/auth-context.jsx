import { createContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client'
import { getProfile } from '../lib/supabase/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user ?? null)
      if (user) {
        try {
          const p = await getProfile(user.id)
          setProfile(p)
        } catch (e) {
          console.error(e)
        }
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          try {
            const p = await getProfile(session.user.id)
            setProfile(p)
          } catch {
            setProfile(null)
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => listener?.subscription.unsubscribe()
  }, [])

  const isAdmin = profile?.role === 'admin'
  const isCustomer = profile?.role === 'customer'

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, isAdmin, isCustomer }}
    >
      {children}
    </AuthContext.Provider>
  )
}


