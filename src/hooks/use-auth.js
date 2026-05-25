import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './use-auth-context'
import * as authService from '../lib/supabase/auth'

export function useAuthActions() {
  const navigate = useNavigate()

  const login = useCallback(
    async ({ email, password }) => {
      await authService.signIn({ email, password })
      navigate('/dashboard')
    },
    [navigate]
  )

  const register = useCallback(
    async ({ name, email, phone, password }) => {
      await authService.signUp({ name, email, phone, password })
      navigate('/dashboard')
    },
    [navigate]
  )

  const loginAsAdmin = useCallback(
    async ({ email, password }) => {
      await authService.signInAsAdmin({ email, password })
      navigate('/admin/dashboard')
    },
    [navigate]
  )

  const logout = useCallback(async () => {
    await authService.signOut()
    navigate('/')
  }, [navigate])

  return { login, register, loginAsAdmin, logout }
}
