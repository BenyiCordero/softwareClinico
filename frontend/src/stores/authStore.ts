import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  usuario: string | null
  nombre: string | null
  rol: string | null
  login: (payload: { token: string; usuario: string; nombre: string; rol: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      nombre: null,
      rol: null,
      login: ({ token, usuario, nombre, rol }) => set({ token, usuario, nombre, rol }),
      logout: () => set({ token: null, usuario: null, nombre: null, rol: null }),
    }),
    {
      name: 'quirurgia-auth',
    },
  ),
)
