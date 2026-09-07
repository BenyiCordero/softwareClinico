import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  username: string | null
  displayName: string | null
  role: string | null
  login: (payload: { token: string; username: string; displayName: string; role: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      displayName: null,
      role: null,
      login: ({ token, username, displayName, role }) => set({ token, username, displayName, role }),
      logout: () => set({ token: null, username: null, displayName: null, role: null }),
    }),
    {
      name: 'quirurgia-auth',
    },
  ),
)
