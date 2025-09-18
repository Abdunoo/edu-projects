<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-title">Create Student</h1>
      <p class="page-description">Fill in the form to add a new student</p>
    </header>

    <div class="page-content">
      <form class="space-y-4 max-w-2xl" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700">NISN</label>
          <input v-model="form.nisn" type="text" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="NISN">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input v-model="form.name" type="text" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full name">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input v-model="dobInput" type="date" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Guardian Contact</label>
          <input v-model="form.guardianContact" type="text" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Parent/Guardian phone or email">
        </div>

        <div class="flex items-center gap-2">
          <input id="isActive" v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
          <label for="isActive" class="text-sm text-gray-700">Active</label>
        </div>

        <div v-if="formErrors.length" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="(err, idx) in formErrors" :key="idx">{{ err.path }}: {{ err.message }}</li>
          </ul>
        </div>

        <div class="flex items-center gap-3">
          <button type="submit" :disabled="submitting" class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
            <span v-if="submitting" class="i-lucide-loader-circle mr-2 animate-spin" />
            Create
          </button>
          <NuxtLink to="/students" class="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">Cancel</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from '#imports'
import { validateForm } from '~~/utils/validation'
import { studentSchema, type IStudent } from '~~/schemas/student.schema'
import type { IBaseApiResponse } from '~~/types/api'
import { ENDPOINTS } from '~~/utils/constant'

const router = useRouter()
const { $api } = useNuxtApp()
const toast = useCustomToast()

const submitting = ref(false)
const formErrors = ref<Array<{ path?: string; message: string }>>([])

const form = reactive<IStudent>({
  id: '',
  nisn: '',
  name: '',
  dob: new Date(),
  guardianContact: '',
  isActive: true,
  createdAt: undefined,
  updatedAt: undefined,
})

// For create we allow missing id/createdAt/updatedAt
const createStudentSchema = studentSchema.partial({ id: true, createdAt: true, updatedAt: true })

// Helper to bind date to input type="date"
const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
const dobInput = computed<string>({
  get() {
    const d = form.dob instanceof Date ? form.dob : new Date()
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  },
  set(v: string) {
    if (v) form.dob = new Date(v)
  },
})

const onSubmit = async () => {
  formErrors.value = []
  submitting.value = true
  try {
    const { success, data, errors } = validateForm(createStudentSchema, form)
    if (!success) {
      formErrors.value = (errors as Array<{ path?: string; message: string }>) || []
      return
    }

    const payload = {
      nisn: data!.nisn,
      name: data!.name,
      dob: (data!.dob as Date).toISOString().slice(0, 10),
      guardianContact: data!.guardianContact,
      isActive: data!.isActive,
    }

    await $api<IBaseApiResponse<IStudent>>(ENDPOINTS.STUDENTS.BASE, {
      method: 'POST',
      body: payload,
    })

    toast.success('Student created successfully')
    router.push('/students')
  } catch (err: unknown) {
    const message = (err as { data?: { message?: string } })?.data?.message || 'Failed to create student'
    toast.error(message)
  } finally {
    submitting.value = false
  }
}
</script>

