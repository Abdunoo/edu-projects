<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-title">Create Class</h1>
      <p class="page-description">Add a new class</p>
    </header>

    <div class="page-content">
      <form class="space-y-4 max-w-2xl" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input v-model="form.name" type="text" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Class name">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Year</label>
          <input v-model="form.year" type="text" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 2024/2025 or 2025">
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
          <NuxtLink to="/classes" class="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">Cancel</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from '#imports'
import { validateForm } from '~~/utils/validation'
import { classSchema, type IClass } from '~~/schemas/class.schema'
import type { IBaseApiResponse } from '~~/types/api'
import { ENDPOINTS } from '~~/utils/constant'

const router = useRouter()
const { $api } = useNuxtApp()
const toast = useCustomToast()

const submitting = ref(false)
const formErrors = ref<Array<{ path?: string; message: string }>>([])

const form = reactive<IClass>({
  id: '',
  name: '',
  year: 2025,
  createdAt: undefined,
  updatedAt: undefined,
})

const createSchema = classSchema.partial({ id: true, createdAt: true, updatedAt: true })

const onSubmit = async () => {
  formErrors.value = []
  submitting.value = true
  try {
    const { success, data, errors } = validateForm(createSchema, form)
    if (!success) {
      formErrors.value = (errors as Array<{ path?: string; message: string }>) || []
      return
    }

    const payload = {
      name: data!.name,
      year: data!.year,
    }

    await $api<IBaseApiResponse<IClass>>(ENDPOINTS.CLASSES.BASE, {
      method: 'POST',
      body: payload,
    })

    toast.success('Class created successfully')
    router.push('/classes')
  } catch (err: unknown) {
    const message = (err as { data?: { message?: string } })?.data?.message || 'Failed to create class'
    toast.error(message)
  } finally {
    submitting.value = false
  }
}
</script>
