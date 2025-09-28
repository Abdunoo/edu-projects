<template>
  <div v-if="loading" class="flex h-full items-center justify-center">
    <i
      class="i-lucide-loader-circle text-3xl animate-spin"
      aria-hidden="true"
    />
  </div>
  <div v-else class="mx-auto max-w-3xl p-6">
    <!-- Top Card -->
    <section
      class="rounded-xl border border-gray-200/60 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex items-start justify-between gap-4 p-6">
        <div class="flex items-center gap-3">
          <!-- Icon -->
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <i
              class="i-lucide-book-open text-gray-600 dark:text-gray-300"
              aria-hidden="true"
            ></i>
          </div>
          <div>
            <h1 class="text-lg font-semibold">Edit Class</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Update class information.
            </p>
          </div>
        </div>

        <NuxtLink
          to="/classes"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
        >
          <i class="i-lucide-arrow-left text-base" aria-hidden="true"></i>
          Back to Classes
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
            <p class="text-base font-medium">Class Details</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Update the information below.
            </p>
          </div>
        </div>
      </header>

      <!-- Form -->
      <form class="space-y-5 p-6" @submit.prevent="onSubmit">
        <!-- Name -->
        <div>
          <label for="name" class="mb-1 block text-sm font-medium">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Class name"
            class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter the class name
          </p>
        </div>

        <!-- Year -->
        <div>
          <label for="year" class="mb-1 block text-sm font-medium">Year</label>
          <input
            id="year"
            v-model="form.year"
            type="text"
            placeholder="e.g. 2024/2025 or 2025"
            class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter the academic year
          </p>
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
            Update
          </button>

          <NuxtLink
            to="/classes"
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
        Tip: Make sure the class name is descriptive and the year format is
        consistent.
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import { validateForm } from "~~/utils/validation";
import { classSchema, type IClass } from "~~/schemas/class.schema";
import type { IBaseApiResponse } from "~~/types/api";
import { ENDPOINTS } from "~~/utils/constant";
import { Permission } from "~~/types/permissions";

definePageMeta({
  requiresAuth: true,
  permissionsAny: [Permission.CLASS_UPDATE],
});

const router = useRouter();
const route = useRoute();
const { $api } = useNuxtApp();
const toast = useCustomToast();

const classId = computed(() => route.params.id as string);
const loading = ref(true);
const submitting = ref(false);
const formErrors = ref<Array<{ path?: string; message: string }>>([]);

const form = reactive<IClass>({
  id: "",
  name: "",
  year: 2025,
  createdAt: undefined,
  updatedAt: undefined,
});

const updateSchema = classSchema.partial({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const fetchClassData = async () => {
  try {
    loading.value = true;
    const response = await $api<IBaseApiResponse<IClass>>(
      `${ENDPOINTS.CLASSES.BASE}/${classId.value}`,
      { method: "GET" },
    );

    const classData = response.data;

    form.id = classData.id;
    form.name = classData.name;
    form.year = classData.year;
  } catch (err: unknown) {
    const message =
      (err as { data?: { message?: string } })?.data?.message ||
      "Failed to fetch class data";
    toast.error(message);
    router.back();
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchClassData();
});

const onSubmit = async () => {
  formErrors.value = [];
  submitting.value = true;
  try {
    const { success, data, errors } = validateForm(updateSchema, form);
    if (!success) {
      formErrors.value =
        (errors as Array<{ path?: string; message: string }>) || [];
      return;
    }

    const payload = {
      name: data!.name,
      year: data!.year,
    };

    await $api<IBaseApiResponse<IClass>>(
      `${ENDPOINTS.CLASSES.BASE}/${classId.value}`,
      {
        method: "PUT",
        body: payload,
      },
    );

    toast.success("Class updated successfully");
    router.back();
  } catch (err: unknown) {
    const message =
      (err as { data?: { message?: string } })?.data?.message ||
      "Failed to update class";
    toast.error(message);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
/* No custom styles needed; Tailwind handles layout & states. */
</style>
