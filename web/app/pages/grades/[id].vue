<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-title">Edit Grade</h1>
      <p class="page-description">Update the grade information</p>
    </header>

    <div class="page-content">
      <form class="space-y-4 max-w-2xl" @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">ID</label>
            <input v-model="form.id" type="text" disabled class="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Student ID</label>
          <input v-model="form.studentId" type="text" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Student ID">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Subject</label>
            <input v-model="form.subject" type="text" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Subject">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Term</label>
            <input v-model="form.term" type="text" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Semester 1">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Score (0-100)</label>
          <input v-model.number="form.score" type="number" min="0" max="100" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Score">
        </div>

        <div v-if="formErrors.length" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="(err, idx) in formErrors" :key="idx">{{ err.path || '' }}{{ err.path ? ': ' : '' }}{{ err.message }}</li>
          </ul>
        </div>

        <div class="flex items-center gap-3">
          <button type="submit" :disabled="submitting" class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
            <span v-if="submitting" class="i-lucide-loader-circle mr-2 animate-spin" />
            Save Changes
          </button>
          <NuxtLink to="/grades" class="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">Cancel</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from '#imports'
import { validateForm } from '~~/utils/validation'
import { gradeSchema, type IGrade } from '~~/schemas/grade.schema'
import type { IBaseApiResponse } from '~~/types/api'
import { ENDPOINTS } from '~~/utils/constant'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const toast = useCustomToast()

const submitting = ref(false)
const formErrors = ref<Array<{ path?: string; message: string }>>([])

const form = reactive<IGrade>({
  id: '',
  studentId: '',
  subject: '',
  term: '',
  score: 0,
  createdAt: undefined,
  updatedAt: undefined,
})

const recId = route.params.id as string

// Fetch grade
let dataItem: IGrade | null = null
let fetchError: unknown = null
try {
  const { data } = await $api<IBaseApiResponse<IGrade>>(`${ENDPOINTS.GRADES.BASE}/${recId}`, { method: 'GET' })
  dataItem = data
} catch (e) {
  fetchError = e
}

if (fetchError) {
  toast.error('Failed to load grade')
  router.push('/grades')
} else if (dataItem) {
  Object.assign(form, dataItem)
}

const editSchema = gradeSchema.partial({ createdAt: true, updatedAt: true })

const onSubmit = async () => {
  formErrors.value = []
  submitting.value = true
  try {
    const { success, data, errors } = validateForm(editSchema, form)
    if (!success) {
      formErrors.value = (errors as Array<{ path?: string; message: string }>) || []
      return
    }

    const payload = {
      studentId: data!.studentId,
      subject: data!.subject,
      term: data!.term,
      score: data!.score,
    }

    await $api<IBaseApiResponse<IGrade>>(`${ENDPOINTS.GRADES.BASE}/${recId}`, {
      method: 'PUT',
      body: payload,
    })

    toast.success('Grade updated successfully')
    router.push('/grades')
  } catch (err: unknown) {
    const message = (err as { data?: { message?: string } })?.data?.message || 'Failed to update grade'
    toast.error(message)
  } finally {
    submitting.value = false
  }
}
</script>
