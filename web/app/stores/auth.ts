import { defineStore } from "pinia";
import type { IUser } from "~~/schemas/user.schema";
import type { IBaseApiResponse } from "~~/types/api";
import { ENDPOINTS } from "~~/utils/constant";
import { ROLE_PERMISSIONS } from "~~/types/permissions";
import type { Role, Permission } from "~~/types/permissions";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as IUser | null,
    loading: false,
    permissions: [] as Permission[],
  }),
  getters: {
    isAuthenticated: (s) => !!s.user,
    role: (s): Role | null => s.user?.role?.name as Role | null,
    has: (s) => (p: Permission) => s.permissions.includes(p),
    hasAny: (s) => (ps: Permission[]) =>
      ps.some((p) => s.permissions.includes(p)),
    hasAll: (s) => (ps: Permission[]) =>
      ps.every((p) => s.permissions.includes(p)),
  },
  actions: {
    async hydrate() {
      this.loading = true;
      try {
        this.user = (
          await $fetch<IBaseApiResponse<IUser>>(ENDPOINTS.AUTH.PUBLIC.ME)
        ).data;

        // Set permissions based on user role
        if (this.user && this.user.role) {
          this.permissions = this.mapRoleToPermissions(
            this.user.role.name as Role,
          );
        } else {
          this.permissions = [];
        }
      } catch {
        this.user = null;
        this.permissions = [];
      } finally {
        this.loading = false;
      }
    },

    mapRoleToPermissions(role: Role): Permission[] {
      // Map role to permissions using the ROLE_PERMISSIONS mapping
      return [...ROLE_PERMISSIONS[role]];
    },

    async login(payload: { email: string; password: string }) {
      this.user = (
        await $fetch<IBaseApiResponse<IUser>>(ENDPOINTS.AUTH.PUBLIC.LOGIN, {
          method: "POST",
          body: payload,
        })
      ).data;
      await this.hydrate();
    },
    async logout() {
      await $fetch<IBaseApiResponse<void>>(ENDPOINTS.AUTH.PUBLIC.LOGOUT, {
        method: "POST",
      });
      this.user = null;
      this.permissions = [];
    },
  },
});
