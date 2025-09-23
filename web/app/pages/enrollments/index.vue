<script setup lang="ts">
import type { ITableColumn, IListResponse, ListRequestPayload, FilterCondition } from '~~/types/data'
import { FC } from '~~/utils/filters'
import type { IEnrollment } from '~~/schemas/enrollment.schema'
import { ENDPOINTS } from '~~/utils/constant'
import { formatDateTime } from '~~/utils/functions'

useHead({ title: 'Enrollments' })

const { $api } = useNuxtApp()
const toast = useCustomToast()

const table = useDataTable<IEnrollment>({
  perPage: 10,
  fetcher: async (payload: ListRequestPayload) => {
    const response = await $api<IListResponse<IEnrollment>>(ENDPOINTS.ENROLLMENTS.LIST, {
      method: 'POST',
      body: payload,
    })
    const d = (response.data ?? {}) as Partial<IListResponse<IEnrollment>['data']> & { meta?: { totalRows?: number } }
    const rows: IEnrollment[] = Array.isArray(d?.rows) ? (d.rows as IEnrollment[]) : []
    const totalRows: number = (d?.totalRows ?? d?.meta?.totalRows ?? 0) as number
    const pageCount: number = (d?.pageCount as number) ?? Math.max(1, Math.ceil((totalRows || 0) / (payload.perPage || 1)))
    return { rows, totalRows, pageCount }
  },
})

// Filters
const studentQuery = ref<string>('')
const classQuery = ref<string>('')

watch([studentQuery, classQuery], () => {
  const filters: FilterCondition[] = []
  if (studentQuery.value?.trim()) filters.push(FC.text('studentId', studentQuery.value.trim(), 'eq'))
  if (classQuery.value?.trim()) filters.push(FC.text('classId', classQuery.value.trim(), 'eq'))
  table.resetFilters(filters)
})

function clearFilters() {
  studentQuery.value = ''
  classQuery.value = ''
}

// Columns
const columns = [
  { 
    key: 'id', 
    label: 'ID', sortable: true},
  { 
    key: 'student.name', 
    label: 'Student', 
    sortable: true},
  { 
    key: 'class.name', 
    label: 'Class', 
    sortable: true
  },
  { 
    key: 'class.year', 
    label: 'Year', 
    sortable: true
  },
  { 
    key: 'createdAt', 
    label: 'Created', 
    sortable: true,
    formatter: (value: IEnrollment['createdAt']) => (value ? formatDateTime(value) : '-') as string
  },
  { 
    key: 'updatedAt', 
    label: 'Updated', 
    sortable: true,
    formatter: (value: IEnrollment['updatedAt']) => (value ? formatDateTime(value) : '-') as string
  },
  { 
    key: 'actions', 
    label: 'Actions' 
  }
]

// Events
const handlePageChange = (page: number) => table.setPage(page)
const handlePerPageChange = (perPage: number) => table.setPerPage(perPage)
const handleSort = (payload: { key: string | null; dir: 'asc' | 'desc' | 'none' | null }) => table.setSortFromSingle(payload)

const handleDelete = (row: IEnrollment) => {
  toast.success(`Enrollment ${row.id} deleted (mock)`) // Hook your delete API here
}
</script>

<template>
  <div class="page-container">
    <header class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Icon name="i-lucide-badge-plus" class="text-primary" />
          Enrollment Management
        </h1>
        <p class="text-gray-600">Manage student enrollments to classes</p>
      </div>
      <NuxtLink to="/enrollments/create">
        <span class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50">
          <Icon name="i-lucide-plus" class="h-4 w-4" />
          Add Enrollment
        </span>
      </NuxtLink>
    </header>

    <BaseTable 
      :title="'Enrollments'"
      :columns="columns as ITableColumn<IEnrollment>[]"
      :rows="table.rows"
      :page="table.page"
      :per-page="table.perPage"
      :total-rows="table.totalRows"
      :loading="table.loading"
      :empty-text="'No enrollments found'"
      :date-format="'long'"
      :highlight-on-hover="true"
      :striped-rows="true"
      @update:page="handlePageChange"
      @update:per-page="handlePerPageChange"
      @sort="handleSort"
    >
      <template #toolbar>
        <div class="flex items-center gap-2">
          <input
            v-model="studentQuery"
            type="text"
            placeholder="Student"
            class="w-40 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <input
            v-model="classQuery"
            type="text"
            placeholder="Class"
            class="w-40 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            type="button"
            class="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/30"
            @click="clearFilters"
          >
            Clear
          </button>
        </div>
      </template>

      <template #cell:actions="{ row }">
        <div class="flex items-center space-x-2">
          <NuxtLink
            :to="`/enrollments/${(row as IEnrollment).id}`"
            class="inline-flex items-center rounded-lg px-2 py-1 text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
            aria-label="Edit"
          >
            <Icon name="i-lucide-pencil" class="h-4 w-4" />
          </NuxtLink>
          <button
            type="button"
            class="inline-flex items-center rounded-lg px-2 py-1 text-amber-600 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30"
            aria-label="Delete"
            @click="handleDelete(row as IEnrollment)"
          >
            <Icon name="i-lucide-trash" class="h-4 w-4" />
          </button>
        </div>
      </template>
      <template #cell:updatedAt="{ row }">
        <span class="text-gray-700">{{ (row as IEnrollment)?.updatedAt ?? '-' }}</span>
      </template>
    </BaseTable>
  </div>
</template>
