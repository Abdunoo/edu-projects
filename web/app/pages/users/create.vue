<template>
  <div class="mx-auto max-w-3xl p-6">
    <!-- Top Card -->
    <section
      class="rounded-xl border border-gray-200/60 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex items-start justify-between gap-4 p-6">
        <div class="flex items-center gap-3">
          <!-- Optional avatar/icon -->
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <!-- If you use unocss/lucide, keep this. Otherwise remove/replace with your svg -->
            <i
              class="i-lucide-user-plus text-gray-600 dark:text-gray-300"
              aria-hidden="true"
            ></i>
          </div>
          <div>
            <h1 class="text-lg font-semibold">Create User</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Fill in the form to add a new user.
            </p>
          </div>
        </div>

        <NuxtLink
          to="/users"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
        >
          <i class="i-lucide-arrow-left text-base" aria-hidden="true"></i>
          Back to Users
        </NuxtLink>
      </div>
    </section>

    <!-- Form Card -->
    <section
      class="mt-4 rounded-xl border border-gray-200/60 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <!-- Header -->
      <header class="border-b border-gray-100 p-6 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-base font-medium">User Details</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Provide the basic information below.
            </p>
          </div>
        </div>
      </header>

      <!-- Form -->
      <form class="space-y-5 p-6" @submit.prevent="onSubmit">
        <!-- Name -->
        <div>
          <label for="name" class="mb-1 block text-sm font-medium"
            >Full name</label
          >
          <input
            id="name"
            v-model="uiState.name"
            type="text"
            autocomplete="name"
            placeholder="Full name"
            class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter the user’s full name
          </p>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="mb-1 block text-sm font-medium"
            >Email</label
          >
          <input
            id="email"
            v-model="uiState.email"
            type="email"
            autocomplete="email"
            placeholder="email@example.com"
            class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            We’ll use this for login
          </p>
        </div>

        <!-- Role -->
        <div>
          <label for="role" class="mb-1 block text-sm font-medium">Role</label>
          <div class="flex items-center gap-3">
            <select
              id="role"
              v-model="uiState.roleId"
              :disabled="rolesLoading"
              class="w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            >
              <option value="" disabled>Select a role</option>
              <option
                v-for="opt in rolesOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>

            <!-- Skeleton -->
            <div
              v-if="rolesLoading"
              class="h-9 w-40 animate-pulse rounded-lg bg-gray-200/70 dark:bg-gray-800"
            />
          </div>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Select the user role
          </p>
        </div>

        <!-- Active -->
        <div class="flex items-center gap-2">
          <input
            id="isActive"
            v-model="uiState.isActive"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900/20 dark:border-gray-700 dark:bg-gray-950"
          />
          <label for="isActive" class="text-sm">Active</label>
        </div>

        <!-- Error list -->
        <div
          v-if="formErrors.length"
          class="rounded-lg border border-red-200 bg-red-50/80 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
          aria-live="polite"
        >
          <div class="flex items-center gap-2">
            <i class="i-lucide-triangle-alert" aria-hidden="true"></i>
            <p class="font-medium">Please fix the following</p>
          </div>
          <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li v-for="(err, idx) in formErrors" :key="idx">
              <span v-if="err.path" class="font-medium">{{ err.path }}:</span>
              <span> {{ err.message }}</span>
            </li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            class="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-gray-900/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90"
            :disabled="submitting"
          >
            <span
              v-if="submitting"
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent align-[-2px]"
              aria-hidden="true"
            />
            <i v-else class="i-lucide-check text-base" aria-hidden="true"></i>
            Create
          </button>

          <NuxtLink
            to="/users"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <i class="i-lucide-x text-base" aria-hidden="true"></i>
            Cancel
          </NuxtLink>
        </div>
      </form>

      <!-- Footer -->
      <footer
        class="border-t border-gray-100 p-6 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400"
      >
        Tip: Roles load once. If you don’t see a role, refresh the page after
        updating roles.
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { validateForm } from "~~/utils/validation";
import { userSchema, type IUser, type IRole } from "~~/schemas/user.schema";
import type { IBaseApiResponse, IPaginatedData } from "~~/types/api";
import { ENDPOINTS } from "~~/utils/constant";
import { Permission } from "~~/types/permissions";

definePageMeta({
  requiresAuth: true,
  permissionsAny: [Permission.USER_CREATE],
});

const router = useRouter();
const { $api } = useNuxtApp();
const toast = useCustomToast();

const submitting = ref(false);
const formErrors = ref<Array<{ path?: string; message: string }>>([]);

// UI state
const uiState = reactive<{
  name: string;
  email: string;
  roleId: string;
  isActive: boolean;
}>({
  name: "",
  email: "",
  roleId: "",
  isActive: true,
});

// Build the schema for create (id/createdAt/updatedAt optional)
const createUserSchema = userSchema.partial({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ---- Roles loading
const rolesLoading = ref(true);
const roles = ref<IRole[]>([]);

try {
  const rolesRes = await $api<
    IBaseApiResponse<IRole[] | IPaginatedData<IRole>>
  >(ENDPOINTS.ROLES.BASE, { method: "GET" });
  const raw = rolesRes?.data as any;
  roles.value = Array.isArray(raw?.data) ? raw.data : (raw as IRole[]) || [];
} catch {
  roles.value = [];
} finally {
  rolesLoading.value = false;
}

const rolesOptions = computed(() =>
  roles.value.map((r) => ({ label: r.name, value: String(r.id) })),
);

const onSubmit = async () => {
  formErrors.value = [];
  submitting.value = true;
  try {
    const generatePassword = () => Math.random().toString(36).slice(-8);

    const candidate: IUser = {
      id: "", // ignored by partial schema
      name: uiState.name,
      email: uiState.email,
      roleId: Number(uiState.roleId),
      isActive: uiState.isActive,
      password: generatePassword(),
      createdAt: undefined,
      updatedAt: undefined,
    };

    const { success, data, errors } = validateForm(createUserSchema, candidate);
    if (!success) {
      formErrors.value =
        (errors as Array<{ path?: string; message: string }>) || [];
      return;
    }

    const payload = {
      name: data!.name,
      email: data!.email,
      roleId: data!.roleId,
      isActive: data!.isActive,
      password: data!.password,
    };

    await $api<IBaseApiResponse<IUser>>(ENDPOINTS.USERS.BASE, {
      method: "POST",
      body: payload,
    });

    toast.success("User created successfully");

    // Action toast: copy password
    toast.action(`New User Password: ${payload.password}`, "Copy", [
      {
        label: "Copy",
        color: "primary",
        icon: "i-lucide-copy",
        onClick: async (e?: Event) => {
          e?.stopPropagation?.();
          await navigator.clipboard.writeText(payload.password);
        },
      },
    ]);

    router.back();
  } catch (err: unknown) {
    const message =
      (err as { data?: { message?: string } })?.data?.message ||
      "Failed to create user";
    toast.error(message);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
/* No custom styles needed; Tailwind handles layout & states. */
</style>
