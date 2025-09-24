<template>
  <div v-if="loading" class="flex h-full items-center justify-center">
    <Icon name="i-lucide-loader-circle" class="animate-spin" />
  </div>
  <div v-else class="page-container">
    <header class="page-header">
      <h1 class="page-title">Create Enrollment</h1>
    </header>

    <div class="page-content">
      <form class="space-y-4 max-w-2xl" @submit.prevent="onSubmit">
        <div class="space-y-1">
          <label for="studentId" class="block text-sm font-medium text-zinc-700"
            >Student</label
          >
          <select
            id="studentId"
            v-model="form.studentId"
            class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            required
          >
            <option value="" disabled>Select Student</option>
            <option v-for="s in studentsOptions" :key="s.id" :value="s.id">
              {{ s.name }}
            </option>
          </select>
        </div>

        <div class="space-y-1">
          <label for="classId" class="block text-sm font-medium text-zinc-700"
            >Class</label
          >
          <select
            id="classId"
            v-model="form.classId"
            class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            required
          >
            <option value="" disabled>Select Class</option>
            <option v-for="c in classesOptions" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>

        <div
          v-if="formErrors.length"
          class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800"
        >
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="(err, idx) in formErrors" :key="idx">
              {{ err.path }}: {{ err.message }}
            </li>
          </ul>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <Icon
              v-if="submitting"
              name="i-lucide-loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            Create
          </button>
          <NuxtLink
            to="/enrollments"
            class="ml-3 inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/30"
          >
            Cancel
          </NuxtLink>
        </div>
      </form>
    </div>
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
    router.push("/enrollments");
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
