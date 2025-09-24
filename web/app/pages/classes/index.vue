<script setup lang="ts">
import type {
  ITableColumn,
  IListResponse,
  ListRequestPayload,
  FilterCondition,
} from "~~/types/data";
import { FC } from "~~/utils/filters";
import type { IClass } from "~~/schemas/class.schema";
import { ENDPOINTS } from "~~/utils/constant";
import { formatDateTime } from "../../../utils/functions";

useHead({ title: "Classes" });

const { $api } = useNuxtApp();
const toast = useCustomToast();

const table = useDataTable<IClass>({
  perPage: 10,
  fetcher: async (payload: ListRequestPayload) => {
    const response = await $api<IListResponse<IClass>>(ENDPOINTS.CLASSES.LIST, {
      method: "POST",
      body: payload,
    });
    const d = (response.data ?? {}) as Partial<
      IListResponse<IClass>["data"]
    > & { meta?: { totalRows?: number } };
    const rows: IClass[] = Array.isArray(d?.rows) ? (d.rows as IClass[]) : [];
    const totalRows: number = (d?.totalRows ??
      d?.meta?.totalRows ??
      0) as number;
    const pageCount: number =
      (d?.pageCount as number) ??
      Math.max(1, Math.ceil((totalRows || 0) / (payload.perPage || 1)));
    return { rows, totalRows, pageCount };
  },
});

// Filters
const nameQuery = ref<string>("");
const yearQuery = ref<string>("");

watch([nameQuery, yearQuery], () => {
  const filters: FilterCondition[] = [];
  if (nameQuery.value?.trim())
    filters.push(FC.text("name", nameQuery.value.trim(), "iLike"));
  if (yearQuery.value?.trim())
    filters.push(FC.text("year", yearQuery.value.trim(), "eq"));
  table.resetFilters(filters);
});

function clearFilters() {
  nameQuery.value = "";
  yearQuery.value = "";
}

// Columns
const columns = [
  {
    key: "id",
    label: "ID",
    sortable: true,
  },
  {
    key: "name",
    label: "NAME",
    sortable: true,
  },
  {
    key: "year",
    label: "YEAR",
    sortable: true,
  },
  {
    key: "createdAt",
    label: "CREATED",
    sortable: true,
    formatter: (value: IClass["createdAt"]) =>
      (value ? formatDateTime(String(value)) : "-") as string,
  },
  {
    key: "updatedAt",
    label: "LAST UPDATED",
    sortable: true,
    formatter: (value: IClass["updatedAt"]) =>
      (value ? formatDateTime(String(value)) : "-") as string,
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];

// Events
const handlePageChange = (page: number) => table.setPage(page);
const handlePerPageChange = (perPage: number) => table.setPerPage(perPage);
const handleSort = (payload: {
  key: string | null;
  dir: "asc" | "desc" | "none" | null;
}) => table.setSortFromSingle(payload);

const handleDelete = (row: IClass) => {
  toast.success(`Class ${row.name} deleted (mock)`); // Implement delete API when available
};
</script>

<template>
  <div class="page-container">
    <header class="flex items-center justify-between mb-4">
      <div>
        <h1
          class="text-2xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <Icon name="i-lucide-presentation" class="text-primary" />
          Class Management
        </h1>
        <p class="text-gray-600">Manage your classes</p>
      </div>
      <NuxtLink to="/classes/create">
        <span
          class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
        >
          <Icon name="i-lucide-plus" class="h-4 w-4" />
          Add Class
        </span>
      </NuxtLink>
    </header>

    <BaseTable
      :title="'Classes'"
      :columns="columns as ITableColumn<IClass>[]"
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
            v-model="nameQuery"
            type="text"
            placeholder="Search name..."
            class="w-48 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <input
            v-model="yearQuery"
            type="text"
            placeholder="Year"
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
            :to="`/classes/${(row as IClass).id}`"
            class="inline-flex items-center rounded-lg px-2 py-1 text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
            aria-label="Edit"
          >
            <Icon name="i-lucide-pencil" class="h-4 w-4" />
          </NuxtLink>
          <button
            type="button"
            class="inline-flex items-center rounded-lg px-2 py-1 text-amber-600 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30"
            aria-label="Delete"
            @click="handleDelete(row as IClass)"
          >
            <Icon name="i-lucide-trash" class="h-4 w-4" />
          </button>
        </div>
      </template>
    </BaseTable>
  </div>
</template>
