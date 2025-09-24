export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  const publicRoutes = new Set(["/login", "/register"]);
  if (publicRoutes.has(to.path)) return;

  // Always ensure we hydrate once when user is null to avoid premature redirects
  if (!auth.user) {
    try {
      await auth.hydrate();
    } catch {
      /* empty */
    }
  }
  // If still unauthenticated, send to login and preserve intended destination
  if (!auth.user)
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
});
