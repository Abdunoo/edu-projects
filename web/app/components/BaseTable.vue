<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, unref, withDefaults, type Ref } from 'vue'
import type { ITableColumn } from '~~/types/data'

// ==== Props & Emits =========================================================

type Props = {
  title?: string
  columns: ITableColumn<T>[]
  rows: T[] | Ref<T[]>
  loading?: boolean | Ref<boolean>
  page?: number | Ref<number>
  perPage?: number | Ref<number>
  totalRows?: number | Ref<number>
  showExport?: boolean
  density?: 'comfortable' | 'compact'
  stickyHeader?: boolean
  showIndex?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  loading: false,
  page: 1,
  perPage: 10,
  totalRows: 0,
  showExport: false,
  density: 'comfortable',
  stickyHeader: true,
  showIndex: false,
})

const emit = defineEmits<{
  (e: 'update:page' | 'update:per-page', value: number): void
  (e: 'export'): void
  (e: 'sort', payload: { key: string | null; dir: 'asc' | 'desc' | 'none' | null }): void
}>()

// ==== State & Derived ========================================================

const pageVal = computed(() => Number(unref(props.page) ?? 1))
const perPageVal = computed(() => Number(unref(props.perPage) ?? 10))
const totalRowsVal = computed(() => Number(unref(props.totalRows) ?? 0))
const rowsVal = computed<T[]>(() => (unref(props.rows) as T[]) ?? [])
const loadingVal = computed<boolean>(() => Boolean(unref(props.loading)))

const pageCount = computed(() => {
  const total = totalRowsVal.value
  const size = perPageVal.value || 1
  return Math.max(1, Math.ceil(total / size))
})

const startIdx = computed(() => {
  if (!totalRowsVal.value) return 0
  return Math.min((pageVal.value - 1) * perPageVal.value + 1, totalRowsVal.value)
})
const endIdx = computed(() => Math.min(pageVal.value * perPageVal.value, totalRowsVal.value))

const densityRowClass = computed(() => (props.density === 'compact' ? 'py-2.5' : 'py-4'))

const sortState = ref<{ key: string | null; dir: 'asc' | 'desc' | 'none' | null }>({ key: null, dir: null })

function prev() {
  if (pageVal.value > 1) emit('update:page', pageVal.value - 1)
}
function next() {
  if (pageVal.value < pageCount.value) emit('update:page', pageVal.value + 1)
}

function toggleSort(col: ITableColumn<T>) {
  if (!col.sortable) return
  const key = String(col.key)
  if (sortState.value.key !== key) {
    sortState.value = { key, dir: 'asc' }
  } else {
    const next = sortState.value.dir === 'asc' ? 'desc' : sortState.value.dir === 'desc' ? 'none' : 'asc'
    sortState.value = { key, dir: next }
  }
  emit('sort', { ...sortState.value })
}

function alignClass(align?: 'left' | 'center' | 'right') {
  return align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
}

function ariaSortFor(col: ITableColumn<T>) {
  if (sortState.value.key !== String(col.key)) return 'none'
  return sortState.value.dir === 'asc' ? 'ascending' : sortState.value.dir === 'desc' ? 'descending' : 'none'
}
</script>

<template>
  <!-- Shell: softer neutrals + subtle ring + rounded corners; dark-mode ready -->
  <div class="bg-white dark:bg-zinc-950 rounded-2xl ring-1 ring-zinc-200 dark:ring-zinc-800 shadow-sm overflow-hidden">
    <!-- Toolbar: gradient + subtle backdrop for elegance on scroll -->
    <div
      v-if="title || $slots.toolbar || showExport"
      class="flex items-center justify-between gap-3 px-5 py-3 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900/50 supports-[backdrop-filter]:backdrop-blur-sm"
    >
      <div class="min-w-0">
        <h2 v-if="title" class="truncate text-base font-semibold text-zinc-900 dark:text-zinc-100">{{ title }}</h2>
      </div>
      <div class="flex items-center gap-2">
        <slot name="toolbar" />
        <button
          v-if="showExport"
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-indigo-200/60 dark:border-indigo-400/20 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
          @click="$emit('export')"
        >
          <Icon name="i-lucide-download" class="h-4 w-4" />
          <span class="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>

    <!-- Table Wrapper -->
    <div class="overflow-x-auto" :aria-busy="loadingVal">
      <table class="min-w-full" :aria-label="title || 'Data table'">
        <!-- Head: sticky with soft separators -->
        <thead :class="['border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/70', stickyHeader ? 'sticky top-0 z-10 supports-[backdrop-filter]:backdrop-blur-md' : '']">
          <tr>
            <th v-if="showIndex" class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300 text-left w-12">#</th>
            <th
              v-for="col in columns"
              :key="String(col.key)"
              :style="{ width: col.width }"
              :class="['px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300', alignClass(col.align)]"
              :aria-sort="ariaSortFor(col)"
              scope="col"
            >
              <button
                v-if="col.sortable"
                class="inline-flex select-none items-center gap-1 rounded-md px-1.5 py-0.5 hover:text-zinc-900 dark:hover:text-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                @click="toggleSort(col)"
              >
                <span>{{ col.label }}</span>
                <Icon v-if="sortState.key === col.key && sortState.dir === 'asc'" name="i-lucide-chevron-up" class="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                <Icon v-else-if="sortState.key === col.key && sortState.dir === 'desc'" name="i-lucide-chevron-down" class="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                <Icon v-else name="i-lucide-chevrons-up-down" class="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              </button>
              <span v-else>{{ col.label }}</span>
            </th>
          </tr>
          <tr>
            <td :colspan="(columns.length + (showIndex ? 1 : 0))" class="px-4 pb-3 pt-2">
              <slot name="filters" />
            </td>
          </tr>
        </thead>

        <!-- Body: zebra rows + generous whitespace -->
        <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
          <!-- Loading -->
          <tr v-if="loadingVal">
            <td :colspan="(columns.length + (showIndex ? 1 : 0))" class="p-10 text-center text-zinc-500 dark:text-zinc-400">
              <div class="inline-flex items-center gap-2 text-sm">
                <Icon name="i-lucide-loader-2" class="h-4 w-4 animate-spin" />
                Loading...
              </div>
            </td>
          </tr>

          <!-- Empty -->
          <tr v-else-if="!rowsVal?.length">
            <td :colspan="(columns.length + (showIndex ? 1 : 0))" class="p-12 text-center">
              <div class="flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <Icon name="i-lucide-database" class="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
                <div class="text-sm">No data available</div>
              </div>
            </td>
          </tr>

          <!-- Rows -->
          <tr
            v-for="(row, idx) in rowsVal"
            v-else
            :key="idx"
            class="odd:bg-zinc-50/60 even:bg-white dark:odd:bg-zinc-900/40 dark:even:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors"
          >
            <td v-if="showIndex" :class="['px-4', densityRowClass, 'text-sm text-zinc-600 dark:text-zinc-300']">
              {{ startIdx ? startIdx + idx : idx + 1 }}
            </td>
            <td
              v-for="col in columns"
              :key="String(col.key)"
              :class="['px-4', densityRowClass, 'text-sm text-zinc-800 dark:text-zinc-200', alignClass(col.align)]"
            >
              <slot :name="`cell:${String(col.key)}`" :row="row" :value="row[col.key as keyof T]">
                {{ col.formatter ? col.formatter(row[col.key as keyof T]) : row[col.key as keyof T] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer / Pagination: compact, balanced spacing -->
    <div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between bg-white/60 dark:bg-zinc-950/60">
      <div class="order-2 text-sm text-zinc-600 dark:text-zinc-300 sm:order-1">
        <span v-if="totalRowsVal">Showing <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ startIdx || 0 }}</span> to <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ endIdx || 0 }}</span> of <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ totalRowsVal }}</span> results</span>
        <span v-else>—</span>
      </div>

      <div class="order-1 flex items-center gap-3 sm:order-2">
        <label class="hidden text-sm text-zinc-600 dark:text-zinc-300 sm:inline" for="rows-per-page">Rows per page</label>
        <select
          id="rows-per-page"
          class="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-800 dark:text-zinc-200 focus:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
          :value="perPageVal"
          @change="$emit('update:per-page', Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="opt in [10, 20, 50, 100]" :key="opt" :value="opt">{{ opt }}</option>
        </select>

        <div class="flex items-center gap-2">
          <button
            class="rounded-lg bg-white dark:bg-zinc-900 px-2.5 py-1.5 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            :disabled="pageVal === 1"
            aria-label="Previous page"
            @click="prev"
          >
            <Icon name="i-lucide-chevron-left" class="h-4 w-4" />
          </button>
          <div class="text-sm text-zinc-600 dark:text-zinc-300">
            Page <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ pageVal }}</span> of <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ pageCount }}</span>
          </div>
          <button
            class="rounded-lg bg-white dark:bg-zinc-900 px-2.5 py-1.5 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            :disabled="pageVal === pageCount"
            aria-label="Next page"
            @click="next"
          >
            <Icon name="i-lucide-chevron-right" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
