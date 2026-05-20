import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getStoredToken } from '@/services/api/client'
import type { User } from '@/types/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  setUser: (user: User | null) => void
  setHydrated: (value: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user && !!getStoredToken(),
        }),
      setHydrated: (isHydrated) => set({ isHydrated }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'saas-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (getStoredToken()) {
            state.isAuthenticated = true
          } else {
            state.logout()
          }
          state.setHydrated(true)
        }
      },
    },
  ),
)
