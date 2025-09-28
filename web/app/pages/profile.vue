<template>
  <div class="flex flex-col items-center p-6">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"
      ></div>
    </div>
    <div v-else class="flex flex-col items-center">
      <div class="flex flex-col items-center space-y-4">
        <img
          :src="avatar"
          alt="Avatar"
          class="w-24 h-24 rounded-full mx-auto"
        />
        <h1 class="text-2xl font-bold text-gray-900">{{ profile?.name }}</h1>
        <p class="text-gray-600">{{ profile?.email }}</p>
        <p class="text-gray-600">Role: {{ profile?.role?.name }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IUser } from "~~/schemas/user.schema";

const loading = ref(false);
const toast = useCustomToast();
const profile = ref<IUser | null>(null);
const avatar = ref("");

const authStore = useAuthStore();

try {
  loading.value = true;
  profile.value = authStore.user;
  avatar.value =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
} catch (error) {
  toast.error(error as string);
} finally {
  loading.value = false;
}
</script>
