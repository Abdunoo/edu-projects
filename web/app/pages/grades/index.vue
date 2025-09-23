<script setup lang="ts">
import type { ITableColumn, IListResponse, ListRequestPayload, FilterCondition } from '~~/types/data'
import { FC } from '~~/utils/filters'
import type { IGrade } from '~~/schemas/grade.schema'
import { ENDPOINTS } from '~~/utils/constant'
import { formatDateTime } from '~~/utils/functions'

useHead({ title: 'Grades' })

const { $api } = useNuxtApp()
const toast = useCustomToast()

const table = useDataTable<IGrade>({
  perPage: 10,
  fetcher: async (payload: ListRequestPayload) => {
    const response = await $api<IListResponse<IGrade>>(ENDPOINTS.GRADES.LIST, {
      method: 'POST',
      body: payload,
    })
    const d = (response.data ?? {}) as Partial<IListResponse<IGrade>['data']> & { meta?: { totalRows?: number } }
    const rows: IGrade[] = Array.isArray(d?.rows) ? (d.rows as IGrade[]) : []
    const totalRows: number = (d?.totalRows ?? d?.meta?.totalRows ?? 0) as number
    const pageCount: number = (d?.pageCount as number) ?? Math.max(1, Math.ceil((totalRows || 0) / (payload.perPage || 1)))
    return { rows, totalRows, pageCount }
  },
})

// Filters
const studentIdQuery = ref<string>('')
const subjectQuery = ref<string>('')
const termQuery = ref<string>('')

watch([studentIdQuery, subjectQuery, termQuery], () => {
  const filters: FilterCondition[] = []
  if (studentIdQuery.value?.trim()) filters.push(FC.text('studentId', studentIdQuery.value.trim(), 'eq'))
  if (subjectQuery.value?.trim()) filters.push(FC.text('subject', subjectQuery.value.trim(), 'iLike'))
  if (termQuery.value?.trim()) filters.push(FC.text('term', termQuery.value.trim(), 'iLike'))
  table.resetFilters(filters)
})

function clearFilters() {
  studentIdQuery.value = ''
  subjectQuery.value = ''
  termQuery.value = ''
}

// Columns
const columns = [
  { 
    key: 'studentId', 
    label: 'Student ID', 
    sortable: true 
  },
  { 
    key: 'subject', 
    label: 'Subject', 
    sortable: true 
  },
  { 
    key: 'term', 
    label: 'Term', 
    sortable: true 
  },
  { 
    key: 'score', 
    label: 'Score', sortable: true 
  },
  { 
    key: 'createdAt', 
    label: 'Created At', 
    sortable: true,
    formatter: (value: IGrade['createdAt']) => (value ? formatDateTime(value) : '-') as string
  },
  { 
    key: 'updatedAt', 
    label: 'Last Updated', 
    sortable: true,
    formatter: (value: IGrade['updatedAt']) => (value ? formatDateTime(value) : '-') as string 
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

const handleDelete = (row: IGrade) => {
  toast.success(`Grade ${row.id} deleted (mock)`) // Implement delete API when available
}
</script>

<template>
  <div class="page-container">
    <header class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Icon name="i-lucide-graduation-cap" class="text-primary" />
          Grades Management
        </h1>
        <p class="text-gray-600">Manage students' grades</p>
      </div>
      <NuxtLink to="/grades/create">
        <span class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50">
          <Icon name="i-lucide-plus" class="h-4 w-4" />
          Add Grade
        </span>
      </NuxtLink>
    </header>

    <BaseTable 
      :title="'Grades'"
      :columns="columns as ITableColumn<IGrade>[]"
      :rows="table.rows"
      :page="table.page"
      :per-page="table.perPage"
      :total-rows="table.totalRows"
      :loading="table.loading"
      @update:page="handlePageChange"
      @update:per-page="handlePerPageChange"
      @sort="handleSort"
    >
      <template #toolbar>
        <div class="flex items-center gap-2">
          <input
            v-model="studentIdQuery"
            type="text"
            placeholder="Student ID"
            class="w-40 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <input
            v-model="subjectQuery"
            type="text"
            placeholder="Subject"
            class="w-40 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <input
            v-model="termQuery"
            type="text"
            placeholder="Term"
            class="w-32 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
            :to="`/grades/${(row as IGrade).id}`"
            class="inline-flex items-center rounded-lg px-2 py-1 text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
            aria-label="Edit"
          >
            <Icon name="i-lucide-pencil" class="h-4 w-4" />
          </NuxtLink>
          <button
            type="button"
            class="inline-flex items-center rounded-lg px-2 py-1 text-amber-600 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30"
            aria-label="Delete"
            @click="handleDelete(row as IGrade)"
          >
            <Icon name="i-lucide-trash" class="h-4 w-4" />
          </button>
        </div>
      </template>
      <template #cell:updatedAt="{ row }">
        <span class="text-gray-700">{{ (row as IGrade)?.updatedAt ?? '-' }}</span>
      </template>
    </BaseTable>
  </div>
</template>
