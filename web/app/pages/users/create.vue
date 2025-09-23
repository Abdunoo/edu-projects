<template>
  <UContainer class="py-6">
    <UCard
      title="Create User"
      description="Fill in the form to add a new user."
    >
      <template #avatar>
        <UAvatar icon="i-lucide-user-plus" />
      </template>
      <template #links>
        <UButton to="/users" color="neutral" variant="soft" icon="i-lucide-arrow-left" label="Back to Users" />
      </template>
    </UCard>

    <UCard class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-base font-medium">User Details</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Provide the basic information below.</p>
          </div>
        </div>
      </template>

      <UForm :state="uiState" class="space-y-5" @submit="onSubmit">
        <!-- Name -->
        <UFormField label="Full name" name="name" :help="'Enter the user’s full name'">
          <UInput v-model="uiState.name" placeholder="Full name" autocomplete="name" />
        </UFormField>

        <!-- Email -->
        <UFormField label="Email" name="email" :help="'We’ll use this for login'">
          <UInput v-model="uiState.email" type="email" placeholder="email@example.com" autocomplete="email" />
        </UFormField>

        <!-- Role -->
        <UFormField label="Role" name="roleId" :help="'Select the user role'">
          <div class="flex items-center gap-3">
            <USelect
              v-model="uiState.roleId"
              :items="rolesOptions"
              option-attribute="label"
              value-attribute="value"
              placeholder="Select a role"
              :disabled="rolesLoading"
              class="w-64"
            />
            <USkeleton v-if="rolesLoading" class="h-9 w-40" />
          </div>
        </UFormField>

        <!-- Active -->
        <UFormField name="isActive">
          <UCheckbox v-model="uiState.isActive" label="Active" />
        </UFormField>

        <!-- Error list (fallback for non-field errors) -->
        <UAlert
          v-if="formErrors.length"
          title="Please fix the following"
          color="error"
          variant="soft"
          icon="i-lucide-triangle-alert"
        >
          <ul class="list-disc pl-5 space-y-1 text-sm">
            <li v-for="(err, idx) in formErrors" :key="idx">
              <span v-if="err.path" class="font-medium">{{ err.path }}:</span>
              <span> {{ err.message }}</span>
            </li>
          </ul>
        </UAlert>

        <div class="flex items-center gap-3 pt-2">
          <UButton type="submit" color="primary" :loading="submitting" icon="i-lucide-check">
            Create
          </UButton>
          <UButton to="/users" color="neutral" variant="soft" icon="i-lucide-x">
            Cancel
          </UButton>
        </div>
      </UForm>

      <template #footer>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Tip: Roles load once. If you don’t see a role, refresh the page after updating roles.
        </div>
      </template>
    </UCard>
  </UContainer>
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

// UI state (decoupled from domain model for better form UX)
const uiState = reactive<{
  name: string
  email: string
  roleId: string
  isActive: boolean
  password: string
}>({
  name: '',
  email: '',
  roleId: '',
  isActive: true,
  password: ''
})

// Build the schema for create (id/createdAt/updatedAt optional)
const createUserSchema = userSchema.partial({ id: true, createdAt: true, updatedAt: true })

// ---- Roles loading (with graceful pending UI)
const rolesLoading = ref(true)
const roles = ref<IRole[]>([])

try {
  const rolesRes = await $api<IBaseApiResponse<IRole[] | IPaginatedData<IRole>>>(ENDPOINTS.ROLES.BASE, { method: 'GET' })
  const raw = rolesRes?.data as any
  roles.value = Array.isArray(raw?.data) ? raw.data : (raw as IRole[] || [])
} catch {
  roles.value = []
} finally {
  rolesLoading.value = false
}

const rolesOptions = computed(() =>
  roles.value.map(r => ({ label: r.name, value: String(r.id) }))
)

const onSubmit = async () => {
  formErrors.value = []
  submitting.value = true
  try {
    const generatePassword = () => {
      return Math.random().toString(36).slice(-8)
    }
    const candidate: IUser = {
      id: '', // ignored by partial schema
      name: uiState.name,
      email: uiState.email,
      roleId: Number(uiState.roleId),
      isActive: uiState.isActive,
      password: generatePassword(),
      createdAt: undefined,
      updatedAt: undefined
    }

    const { success, data, errors } = validateForm(createUserSchema, candidate)
    if (!success) {
      formErrors.value = (errors as Array<{ path?: string; message: string }>) || []
      return
    }

    const payload = {
      name: data!.name,
      email: data!.email,
      roleId: data!.roleId,
      isActive: data!.isActive,
      password: data!.password
    }

    await $api<IBaseApiResponse<IUser>>(ENDPOINTS.USERS.BASE, {
      method: 'POST',
      body: payload
    })
    toast.success('User created successfully', )
    // ✅ Correct action toast usage
    toast.action(
      `New User Password: ${payload.password}`,
      'Copy',
      [
        {
          label: 'Copy',
          color: 'primary',
          icon: 'i-lucide-copy',
          onClick: async (e) => {
            e?.stopPropagation()
            await navigator.clipboard.writeText(payload.password)
          }
        }
      ]
    )
    router.push('/users')
  } catch (err: unknown) {
    const message = (err as { data?: { message?: string } })?.data?.message || 'Failed to create user'
    toast.error(message)
  } finally {
    submitting.value = false
  }
}


</script>

<style scoped>
/* Optional: subtle page rhythm */
</style>
