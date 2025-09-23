<script setup lang="ts">
// Types
import type { IStudent } from '~~/schemas/student.schema'
import type { ITableColumn, IListResponse, ListRequestPayload, FilterCondition } from '~~/types/data'
import { FC } from '~~/utils/filters'
import { formatDate, formatDateTime, formatText } from '../../../utils/functions';
import { ENDPOINTS } from '~~/utils/constant';

useHead({
  title: 'Students',
})
// Composables
const { $api } = useNuxtApp()
const toast = useCustomToast()

// DataTable
const table = useDataTable<IStudent>({
  perPage: 10,
  fetcher: async (payload: ListRequestPayload) => {
    const response = await $api<IListResponse<IStudent>>(ENDPOINTS.STUDENTS.LIST, {
      method: 'POST',
      body: payload,
    })
    const d = (response.data ?? {}) as Partial<IListResponse<IStudent>['data']> & { meta?: { totalRows?: number } }
    const rows: IStudent[] = Array.isArray(d?.rows) ? (d.rows as IStudent[]) : []
    const totalRows: number = (d?.totalRows ?? d?.meta?.totalRows ?? 0) as number
    const pageCount: number = (d?.pageCount as number) ?? Math.max(1, Math.ceil((totalRows || 0) / (payload.perPage || 1)))
    return { rows, totalRows, pageCount }
  },
})

// Filters UI state
const nameQuery = ref<string>('')
const activeQuery = ref<string>('all') // 'all', 'true', 'false'

// Select items for filters (use { label, id } and value-key="id")
const activeItems = ref([
  { label: 'All status', id: 'all' },
  { label: 'Active', id: 'true' },
  { label: 'Inactive', id: 'false' },
])

watch([nameQuery, activeQuery], () => {
  const filters: FilterCondition[] = []
  if (nameQuery.value?.trim()) {
    filters.push(FC.text('name', nameQuery.value.trim(), 'iLike'))
  }
  if (activeQuery.value !== 'all' && (activeQuery.value === 'true' || activeQuery.value === 'false')) {
    filters.push(FC.boolean('isActive', activeQuery.value === 'true', 'eq'))
  }
  table.resetFilters(filters)
})

function clearFilters() {
  nameQuery.value = ''
  activeQuery.value = 'all'
}

// Table Columns
const columns = [
  { 
    key: 'nisn', 
    label: 'NISN',
    sortable: true,
    formatter: (value: IStudent['nisn']) => (value || '-') as string
  },
  { 
    key: 'name', 
    label: 'NAME',
    sortable: true,
    formatter: (value: IStudent['name']) => (formatText(value) || '-') as string
  },
  { 
    key: 'dob', 
    label: 'DATE OF BIRTH',
    sortable: true,
    formatter: (value: IStudent['dob']) => (value ? formatDate(String(value)) : '-') as string
  },
  {
    key: 'guardianContact',
    label: 'GUARDIAN CONTACT',
    sortable: true,
    formatter: (value: IStudent['guardianContact']) => (value || '-') as string
  },
  {
    key: 'isActive',
    label: 'STATUS',
    sortable: true,
  },
  {
    key: 'createdAt',
    label: 'CREATED',
    sortable: true,
    formatter: (value: IStudent['createdAt']) => (value ? formatDateTime(value) : '-') as string
  },
  {
    key: 'updatedAt',
    label: 'LAST UPDATED',
    sortable: true,
    formatter: (value: IStudent['updatedAt']) => (value ? formatDateTime(value) : '-') as string
  },
  { 
    key: 'actions', 
    label: 'ACTIONS',
  }
]


// Event Handlers
const handlePageChange = (page: number) => {
  table.setPage(page)
}

const handlePerPageChange = (perPage: number) => {
  table.setPerPage(perPage)
}

const handleSort = (payload: { key: string | null; dir: 'asc' | 'desc' | 'none' | null }) => {
  table.setSortFromSingle(payload)
}

const handleDelete = (student: IStudent) => {
  toast.success(`Student ${student.name} deleted successfully`)
}

const handleExport = async () => {
  try {
    const response = await $api(ENDPOINTS.STUDENTS.EXPORT, {
      method: 'POST',
      body: {},
      responseType: 'blob'
    })

    const url = URL.createObjectURL(response)
    const link = document.createElement('a')
    link.href = url
    link.download = 'students.csv'
    link.click()
    URL.revokeObjectURL(url)
    
    toast.success('Export started successfully')
  } catch (error) {
    console.error('Error exporting students:', error)
    toast.error('Failed to export students')
  }
}

</script>

<template>
  <div class="page-container">
    <!-- Page Header -->
    <header class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Icon name="i-heroicons-user-20-solid" class="text-primary" />
          Student Management
        </h1>
        <p class="text-gray-600">Manage your application students and their permissions</p>
      </div>
      <NuxtLink to="/students/create">
        <span class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50">
          <Icon name="i-heroicons-plus" class="h-4 w-4" />
          Add Student
        </span>
      </NuxtLink>
    </header>

    <!-- Main Content -->
    <BaseTable 
    :title="'Students'"
        :columns="columns as ITableColumn<IStudent>[]" 
        :rows="table.rows" 
        :page="table.page" 
        :per-page="table.perPage" 
        :total-rows="table.totalRows" 
        :loading="table.loading"
        :show-export="true" 
        @export="handleExport" 
        @update:page="handlePageChange" 
        @update:per-page="handlePerPageChange" 
        @sort="handleSort"
      >
        <template #toolbar>
          <div class="flex items-center gap-2">
            <input
              v-model="nameQuery"
              type="text"
              placeholder="Search name..."
              class="w-48 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <select
              v-model="activeQuery"
              class="w-32 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option v-for="opt in activeItems" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
            </select>
            <button
              type="button"
              class="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/30"
              @click="clearFilters"
            >
              Clear
            </button>
          </div>
        </template>
        <!-- Custom slot for actions -->
        <template #cell:actions="{ row }">
          <div class="flex items-center space-x-2">
            <NuxtLink
              :to="`/students/${(row as IStudent).id}`"
              class="inline-flex items-center rounded-lg px-2 py-1 text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
              aria-label="Edit"
            >
              <Icon name="i-heroicons-pencil" class="h-4 w-4" />
            </NuxtLink>
            <button
              type="button"
              class="inline-flex items-center rounded-lg px-2 py-1 text-amber-600 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30"
              aria-label="Delete"
              @click="handleDelete(row as IStudent)"
            >
              <Icon name="i-heroicons-trash" class="h-4 w-4" />
            </button>
          </div>
        </template>
        <template #cell:isActive="{ row }">
          <span :class="[(row as IStudent).isActive ? 'text-green-600 bg-green-100 px-2 py-1 rounded-lg' : 'text-amber-600 bg-amber-100 px-2 py-1 rounded-lg']">{{ (row as IStudent).isActive ? 'Active' : 'Inactive' }}</span>
        </template>
    </BaseTable>

  </div>
</template>