import { PUBLIC_ROUTES } from "~~/utils/constant";
import type { Permission } from "~~/types/permissions";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  const publicRoutes = new Set(PUBLIC_ROUTES);

  // Allow access to public routes without authentication
  if (publicRoutes.has(to.path)) return;

  // Try to hydrate user if not already loaded
  if (!auth.user) {
    try {
      await auth.hydrate();
    } catch {
      /* empty */
    }
  }

  // Redirect to login if not authenticated
  if (!auth.user) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  // Check permission requirements from route meta
  const permissionsAny = (to.meta.permissionsAny as Permission[]) || [];
  const permissionsAll = (to.meta.permissionsAll as Permission[]) || [];

  // Check if user has required permissions
  if (permissionsAny.length && !auth.hasAny(permissionsAny)) {
    return navigateTo("/403");
  }

  if (permissionsAll.length && !auth.hasAll(permissionsAll)) {
    return navigateTo("/403");
  }
});
