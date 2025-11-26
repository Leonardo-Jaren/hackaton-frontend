import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Tipos para el usuario
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
}

// Tipos para el estado de autenticación
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Acciones
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        })
        localStorage.removeItem('auth-storage')
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: !!user })
      },

      setToken: (token: string) => {
        set({ token })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
