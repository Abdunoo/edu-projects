import { useAuthStore } from "~/stores/auth";
import type { Permission } from "~~/types/permissions";

/**
 * Vue directive for permission-based element visibility
 *
 * Usage:
 * - v-can="'user:create'"                     // Single permission
 * - v-can="['user:create', 'user:update']"    // All permissions required
 * - v-can="{ any: ['user:create', 'user:update'] }"  // Any permission
 * - v-can="{ all: ['user:read', 'user:update'] }"    // All permissions
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("can", {
    mounted(el, binding) {
      toggleVisibility(el, binding.value);
    },
    updated(el, binding) {
      toggleVisibility(el, binding.value);
    },
  });
});

function toggleVisibility(
  el: HTMLElement,
  value: Permission | Permission[] | { any?: Permission[]; all?: Permission[] },
) {
  const auth = useAuthStore();
  let hasPermission = false;

  if (typeof value === "string") {
    // Single permission
    hasPermission = auth.has(value as Permission);
  } else if (Array.isArray(value)) {
    // Array of permissions (all required)
    hasPermission = auth.hasAll(value);
  } else if (value && typeof value === "object") {
    // Object with 'any' or 'all' properties
    const anyPermissions = value.any || [];
    const allPermissions = value.all || [];

    hasPermission =
      (anyPermissions.length === 0 || auth.hasAny(anyPermissions)) &&
      (allPermissions.length === 0 || auth.hasAll(allPermissions));
  }

  if (!value) {
    el.style.display = "";
    return;
  }

  el.style.display = hasPermission ? "" : "none";
}
