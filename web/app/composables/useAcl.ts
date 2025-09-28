import { useAuthStore } from "~/stores/auth";
import type { Permission } from "~~/types/permissions";

/**
 * Composable for checking user permissions
 */
export function useAcl() {
  const auth = useAuthStore();

  return {
    /**
     * Check if user has a specific permission
     */
    can: (permission: Permission): boolean => auth.has(permission),

    /**
     * Check if user has any of the specified permissions
     */
    canAny: (permissions: Permission[]): boolean => auth.hasAny(permissions),

    /**
     * Check if user has all of the specified permissions
     */
    canAll: (permissions: Permission[]): boolean => auth.hasAll(permissions),

    /**
     * Get the current user's role
     */
    role: (): string | null => auth.role,
  };
}
