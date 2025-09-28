<template>
  <div class="mx-auto max-w-3xl p-6">
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
              class="i-lucide-graduation-cap text-gray-600 dark:text-gray-300"
              aria-hidden="true"
            ></i>
          </div>
          <div>
            <h1 class="text-lg font-semibold">Create Student</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Fill in the form to add a new student.
            </p>
          </div>
        </div>

        <NuxtLink
          to="/students"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
        >
          <i class="i-lucide-arrow-left text-base" aria-hidden="true"></i>
          Back to Students
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
            <p class="text-base font-medium">Student Details</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Provide the student information below.
            </p>
          </div>
        </div>
      </header>

      <!-- Form -->
      <form class="space-y-5 p-6" @submit.prevent="onSubmit">
        <!-- NISN -->
        <div>
          <label for="nisn" class="mb-1 block text-sm font-medium">NISN</label>
          <input
            id="nisn"
            v-model="form.nisn"
            type="text"
            placeholder="NISN"
            class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter the student's NISN (National Student ID Number)
          </p>
        </div>

        <!-- Name -->
        <div>
          <label for="name" class="mb-1 block text-sm font-medium">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Full name"
            class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter the student's full name
          </p>
        </div>

        <!-- Date of Birth -->
        <div>
          <label for="dob" class="mb-1 block text-sm font-medium"
            >Date of Birth</label
          >
          <input
            id="dob"
            v-model="dobInput"
            type="date"
            class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Select the student's date of birth
          </p>
        </div>

        <!-- Guardian Contact -->
        <div>
          <label for="guardianContact" class="mb-1 block text-sm font-medium"
            >Guardian Contact</label
          >
          <input
            id="guardianContact"
            v-model="form.guardianContact"
            type="text"
            placeholder="Parent/Guardian phone or email"
            class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter parent or guardian contact information
          </p>
        </div>

        <!-- Active -->
        <div class="flex items-center gap-2">
          <input
            id="isActive"
            v-model="form.isActive"
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
            to="/students"
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
        Tip: Make sure to enter accurate contact information for the guardian.
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRouter } from "#imports";
import { validateForm } from "~~/utils/validation";
import { studentSchema, type IStudent } from "~~/schemas/student.schema";
import type { IBaseApiResponse } from "~~/types/api";
import { ENDPOINTS } from "~~/utils/constant";
import { Permission } from "~~/types/permissions";

definePageMeta({
  requiresAuth: true,
  permissionsAny: [Permission.STUDENT_CREATE],
});

const router = useRouter();
const { $api } = useNuxtApp();
const toast = useCustomToast();

const submitting = ref(false);
const formErrors = ref<Array<{ path?: string; message: string }>>([]);

const form = reactive<IStudent>({
  id: "",
  nisn: "",
  name: "",
  dob: new Date(),
  guardianContact: "",
  isActive: true,
  createdAt: undefined,
  updatedAt: undefined,
});

// For create we allow missing id/createdAt/updatedAt
const createStudentSchema = studentSchema.partial({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Helper to bind date to input type="date"
const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
const dobInput = computed<string>({
  get() {
    const d = form.dob instanceof Date ? form.dob : new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  },
  set(v: string) {
    if (v) form.dob = new Date(v);
  },
});

const onSubmit = async () => {
  formErrors.value = [];
  submitting.value = true;
  try {
    const { success, data, errors } = validateForm(createStudentSchema, form);
    if (!success) {
      formErrors.value =
        (errors as Array<{ path?: string; message: string }>) || [];
      return;
    }

    const payload = {
      nisn: data!.nisn,
      name: data!.name,
      dob: (data!.dob as Date).toISOString().slice(0, 10),
      guardianContact: data!.guardianContact,
      isActive: data!.isActive,
    };

    await $api<IBaseApiResponse<IStudent>>(ENDPOINTS.STUDENTS.BASE, {
      method: "POST",
      body: payload,
    });

    toast.success("Student created successfully");
    router.back();
  } catch (err: unknown) {
    const message =
      (err as { data?: { message?: string } })?.data?.message ||
      "Failed to create student";
    toast.error(message);
  } finally {
    submitting.value = false;
  }
};
</script>
