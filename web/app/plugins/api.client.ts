import { ofetch } from 'ofetch'

export default defineNuxtPlugin(() => {
  const api = ofetch.create({
    baseURL: '/api/bridge',
    retry: 0,
  })

  return { provide: { api } }
})
