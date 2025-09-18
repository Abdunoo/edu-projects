import { defineStore } from 'pinia'
import type { IUser } from '~~/schemas/user.schema'
import type { IBaseApiResponse } from '~~/types/api'
import { ENDPOINTS } from '~~/utils/constant'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null as IUser | null, loading: false }),
  getters: { isAuthenticated: (s) => !!s.user },
  actions: {
    async hydrate() {
      this.loading = true
      try { this.user = (await $fetch<IBaseApiResponse<IUser>>(ENDPOINTS.AUTH.PUBLIC.ME)).data }
      catch { this.user = null }
      finally { this.loading = false }
    },
    async login(payload: { email: string; password: string }) {
      this.user = (await $fetch<IBaseApiResponse<IUser>>(ENDPOINTS.AUTH.PUBLIC.LOGIN, { method: 'POST', body: payload })).data
      await this.hydrate()
    },
    async logout() {
      await $fetch<IBaseApiResponse<void>>(ENDPOINTS.AUTH.PUBLIC.LOGOUT, { method: 'POST' })
      this.user = null
    },
  },
})
