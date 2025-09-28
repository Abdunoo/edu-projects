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
              class="i-lucide-user-plus-2 text-gray-600 dark:text-gray-300"
              aria-hidden="true"
            ></i>
          </div>
          <div>
            <h1 class="text-lg font-semibold">Create Enrollment</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Enroll a student in a class.
            </p>
          </div>
        </div>

        <NuxtLink
          to="/enrollments"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
        >
          <i class="i-lucide-arrow-left text-base" aria-hidden="true"></i>
          Back to Enrollments
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
            <p class="text-base font-medium">Enrollment Details</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Select a student and class below.
            </p>
          </div>
        </div>
      </header>

      <!-- Form -->
      <form class="space-y-5 p-6" @submit.once="onSubmit">
        <!-- Student -->
        <div>
          <label for="studentId" class="mb-1 block text-sm font-medium"
            >Student</label
          >
          <select
            id="studentId"
            v-model="form.studentId"
            class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            required
          >
            <option value="" disabled>Select Student</option>
            <option v-for="s in studentsOptions" :key="s.id" :value="s.id">
              {{ s.name }}
            </option>
          </select>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Choose the student to enroll
          </p>
        </div>

        <!-- Class -->
        <div>
          <label for="classId" class="mb-1 block text-sm font-medium"
            >Class</label
          >
          <select
            id="classId"
            v-model="form.classId"
            class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            required
          >
            <option value="" disabled>Select Class</option>
            <option v-for="c in classesOptions" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Choose the class for enrollment
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
            Create
          </button>

          <NuxtLink
            to="/enrollments"
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
        Tip: A student can be enrolled in multiple classes.
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "#imports";
import { validateForm } from "~~/utils/validation";
import {
  enrollmentSchema,
  type IEnrollment,
} from "~~/schemas/enrollment.schema";
import type { IBaseApiResponse } from "~~/types/api";
import { ENDPOINTS } from "~~/utils/constant";
import type { IStudent } from "~~/schemas/student.schema";
import type { IClass } from "~~/schemas/class.schema";
import { Permission } from "~~/types/permissions";

definePageMeta({
  requiresAuth: true,
  permissionsAny: [Permission.ENROLLMENT_CREATE],
});

const router = useRouter();
const { $api } = useNuxtApp();
const toast = useCustomToast();
const loading = ref(false);

const submitting = ref(false);
const formErrors = ref<Array<{ path?: string; message: string }>>([]);

const form = reactive<IEnrollment>({
  id: "",
  studentId: "",
  classId: "",
});

const studentsOptions = ref<IStudent[]>([]);
const classesOptions = ref<IClass[]>([]);

try {
  loading.value = true;
  const response = await $api<IBaseApiResponse<IStudent[]>>(
    ENDPOINTS.STUDENTS.BASE,
  );
  studentsOptions.value = response.data;

  const response2 = await $api<IBaseApiResponse<IClass[]>>(
    ENDPOINTS.CLASSES.BASE,
  );
  classesOptions.value = response2.data;
} catch (err: unknown) {
  const message =
    (err as { data?: { message?: string } })?.data?.message ||
    "Failed to fetch students or classes";
  toast.error(message);
} finally {
  loading.value = false;
}

const createSchema = enrollmentSchema.partial({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const onSubmit = async () => {
  formErrors.value = [];
  submitting.value = true;
  try {
    const { success, data, errors } = validateForm(createSchema, form);
    if (!success) {
      formErrors.value =
        (errors as Array<{ path?: string; message: string }>) || [];
      return;
    }

    const payload = {
      studentId: data!.studentId,
      classId: data!.classId,
    };

    await $api<IBaseApiResponse<IEnrollment>>(ENDPOINTS.ENROLLMENTS.BASE, {
      method: "POST",
      body: payload,
    });

    toast.success("Enrollment created successfully");
    router.back();
  } catch (err: unknown) {
    const message =
      (err as { data?: { message?: string } })?.data?.message ||
      "Failed to create enrollment";
    toast.error(message);
  } finally {
    submitting.value = false;
  }
};
</script>
