import { defineStore } from 'pinia'

export interface UserState {
  id: string | null
  name: string | null
  email: string | null
  role: 'admin' | 'copywriter' | null
  isAuthenticated: boolean
}

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: null,
    name: null,
    email: null,
    role: null,
    isAuthenticated: false,
  }),

  getters: {
    isAdmin: (state) => state.role === 'admin',
  },

  actions: {
    hydrate() {
      const token = localStorage.getItem('access_token')
      if (!token) return
      const decoded = decodeJwt(token)
      this.isAuthenticated = true
      this.id = (decoded?.userId as string) || null
      this.email = (decoded?.email as string) || null
      this.role = (decoded?.accountType as 'admin' | 'copywriter') || null
    },

    setUser(payload: { id?: string; name?: string; email?: string; role?: 'admin' | 'copywriter' }) {
      if (payload.id !== undefined) {
        this.id = payload.id
        try { localStorage.setItem('user_id', payload.id) } catch {}
      }
      if (payload.name) this.name = payload.name
      if (payload.email) this.email = payload.email
      if (payload.role) this.role = payload.role
      this.isAuthenticated = true
    },

    clear() {
      this.id = null
      this.name = null
      this.email = null
      this.role = null
      this.isAuthenticated = false
      try {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_id')
      } catch {}
    },
  },
})
