export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path !== '/login') return
    const auth = useAuthStore()
    if (!auth.user && !auth.loading) { try { await auth.hydrate() } catch { /* empty */ } }
    if (auth.user) return navigateTo((to.query.redirect as string) || '/')
  })
  