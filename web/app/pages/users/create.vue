<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-title">Create User</h1>
      <p class="page-description">Fill in the form to add a new user</p>
    </header>

    <div class="page-content">
      <form class="space-y-4 max-w-2xl" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input v-model="form.name" type="text" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full name">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="email@example.com">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Role</label>
          <select v-model="selectedRoleId" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option :value="''" disabled>Select a role</option>
            <option v-for="r in roles" :key="r.id" :value="String(r.id)">{{ r.name }}</option>
          </select>
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
          <NuxtLink to="/users" class="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">Cancel</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { validateForm } from '~~/utils/validation'
import { userSchema, type IUser, type IRole } from '~~/schemas/user.schema'
import type { IBaseApiResponse, IPaginatedData } from '~~/types/api'
import { ENDPOINTS } from '~~/utils/constant'

const router = useRouter()
const { $api } = useNuxtApp()
const toast = useCustomToast()

const submitting = ref(false)
const formErrors = ref<Array<{ path?: string; message: string }>>([])
const selectedRoleId = ref<string>('')

const form = reactive<IUser>({
  id: '',
  name: '',
  email: '',
  role: { id: '', name: '' },
  isActive: true,
  createdAt: undefined,
  updatedAt: undefined,
})

// For create we allow missing id/createdAt/updatedAt
const createUserSchema = userSchema.partial({ id: true, createdAt: true, updatedAt: true })

// Fetch roles at setup
const rolesRes = await $api<IBaseApiResponse<IRole[] | IPaginatedData<IRole>>>(ENDPOINTS.ROLES.BASE, { method: 'GET' })
const roles = computed<IRole[]>(() => (rolesRes?.data as IRole[]) || [])

const onSubmit = async () => {
  formErrors.value = []
  submitting.value = true
  try {
    const { success, data, errors } = validateForm(createUserSchema, form)
    if (!success) {
      formErrors.value = (errors as Array<{ path?: string; message: string }>) || []
      return
    }

    // Build role from selection to avoid watchers
    const selectedRole = roles.value.find(r => String(r.id) === String(selectedRoleId.value))
    const payload = {
      name: data!.name,
      email: data!.email,
      role: selectedRole ? selectedRole.name : data!.role.name,
      isActive: data!.isActive,
    }

    await $api<IBaseApiResponse<IUser>>(ENDPOINTS.USERS.BASE, {
      method: 'POST',
      body: payload,
    })

    toast.success('User created successfully')
    router.push('/users')
  } catch (err: unknown) {
    const message = (err as { data?: { message?: string } })?.data?.message || 'Failed to create user'
    toast.error(message)
  } finally {
    submitting.value = false
  }
}
</script>

