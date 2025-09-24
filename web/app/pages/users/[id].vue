<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-title">Edit User</h1>
      <p class="page-description">Update the user information</p>
    </header>

    <div class="page-content">
      <form class="space-y-4 max-w-2xl" @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">ID</label>
            <input
              v-model="form.id"
              type="text"
              disabled
              class="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Role</label>
          <select
            v-model="selectedRoleId"
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="''" disabled>Select a role</option>
            <option v-for="r in roles" :key="r.id" :value="String(r.id)">
              {{ r.name }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="isActive"
            v-model="form.isActive"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label for="isActive" class="text-sm text-gray-700">Active</label>
        </div>

        <div
          v-if="formErrors.length"
          class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="(err, idx) in formErrors" :key="idx">
              {{ err.path || "" }}{{ err.path ? ": " : "" }}{{ err.message }}
            </li>
          </ul>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <span
              v-if="submitting"
              class="i-lucide-loader-circle mr-2 animate-spin"
            />
            Save Changes
          </button>
          <NuxtLink
            to="/users"
            class="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >Cancel</NuxtLink
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "#imports";
import { validateForm } from "~~/utils/validation";
import { userSchema, type IUser, type IRole } from "~~/schemas/user.schema";
import type { IBaseApiResponse, IPaginatedData } from "~~/types/api";
import { ENDPOINTS } from "~~/utils/constant";

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();
const toast = useCustomToast();

const submitting = ref(false);
const formErrors = ref<Array<{ path?: string; message: string }>>([]);
const selectedRoleId = ref<string>("");

const form = reactive<IUser>({
  id: "",
  name: "",
  email: "",
  role: { id: "", name: "" },
  isActive: true,
  createdAt: undefined,
  updatedAt: undefined,
});

const userId = route.params.id as string;

// Fetch user and roles
let userData: IBaseApiResponse<IUser> | null = null;
let userError: unknown = null;
try {
  userData = await $api<IBaseApiResponse<IUser>>(
    `${ENDPOINTS.USERS.BASE}/${userId}`,
    { method: "GET" },
  );
} catch (e) {
  userError = e;
}

const rolesRes = await $api<IBaseApiResponse<IRole[] | IPaginatedData<IRole>>>(
  ENDPOINTS.ROLES.BASE,
  { method: "GET" },
);
const roles = computed<IRole[]>(() => (rolesRes?.data as IRole[]) || []);

// Initialize form and selected role after data resolves
if (userError) {
  toast.error("Failed to load user");
  router.push("/users");
} else if (userData) {
  const u = userData.data;
  form.id = u.id;
  form.name = u.name;
  form.email = u.email;
  form.role = { ...u.role };
  form.isActive = u.isActive;
  form.createdAt = u.createdAt;
  form.updatedAt = u.updatedAt;
  selectedRoleId.value = String(u.role?.id ?? "");
}

const editUserSchema = userSchema.partial({ createdAt: true, updatedAt: true });

const onSubmit = async () => {
  formErrors.value = [];
  submitting.value = true;
  try {
    const { success, data, errors } = validateForm(editUserSchema, form);
    if (!success) {
      formErrors.value =
        (errors as Array<{ path?: string; message: string }>) || [];
      return;
    }

    const selectedRole = roles.value.find(
      (r) => String(r.id) === String(selectedRoleId.value),
    );
    const payload = {
      name: data!.name,
      email: data!.email,
      role: selectedRole ? selectedRole.name : data!.role.name,
      isActive: data!.isActive,
    };

    await $api<IBaseApiResponse<IUser>>(`${ENDPOINTS.USERS.BASE}/${userId}`, {
      method: "PUT",
      body: payload,
    });

    toast.success("User updated successfully");
    router.push("/users");
  } catch (err: unknown) {
    const message =
      (err as { data?: { message?: string } })?.data?.message ||
      "Failed to update user";
    toast.error(message);
  } finally {
    submitting.value = false;
  }
};
</script>
