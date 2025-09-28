<script setup lang="ts">
// Types
import type {
  ITableColumn,
  IListResponse,
  ListRequestPayload,
  FilterCondition,
} from "~~/types/data";
import { FC } from "~~/utils/filters";
import type { IUser } from "~~/schemas/user.schema";
import { ENDPOINTS, ROLES } from "~~/utils/constant";
import { formatDateTime } from "~~/utils/functions";
import { Permission } from "~~/types/permissions";

// Define page meta for permission check
definePageMeta({
  requiresAuth: true,
  permissionsAny: [Permission.USER_READ],
});

// Composables
const toast = useCustomToast();
const { $api } = useNuxtApp();

// DataTable
const table = useDataTable<IUser>({
  perPage: 10,
  fetcher: async (payload: ListRequestPayload) => {
    const response = await $api<IListResponse<IUser>>(ENDPOINTS.USERS.LIST, {
      method: "POST",
      body: payload,
    });
    const d = (response.data ?? {}) as Partial<IListResponse<IUser>["data"]> & {
      meta?: { totalRows?: number };
    };
    const rows: IUser[] = Array.isArray(d?.rows) ? (d.rows as IUser[]) : [];
    const totalRows: number = (d?.totalRows ??
      d?.meta?.totalRows ??
      0) as number;
    const pageCount: number =
      (d?.pageCount as number) ??
      Math.max(1, Math.ceil((totalRows || 0) / (payload.perPage || 1)));
    return { rows, totalRows, pageCount };
  },
});

// Filters UI state
const nameQuery = ref<string>("");
const roleQuery = ref<string>("all");

// Select items for filters (use { label, id } and value-key="id")
const roleItems = ref([
  { label: "All roles", id: "all" },
  { label: "Admin", id: ROLES.ADMIN },
  { label: "Teacher", id: ROLES.TEACHER },
  { label: "Student", id: ROLES.STUDENT },
]);

watch([nameQuery, roleQuery], () => {
  const filters: FilterCondition[] = [];
  if (nameQuery.value?.trim()) {
    filters.push(FC.text("name", nameQuery.value.trim(), "iLike"));
  }
  if (roleQuery.value !== "all") {
    filters.push(FC.select("role.name", roleQuery.value, "eq"));
  }
  table.resetFilters(filters);
});

function clearFilters() {
  nameQuery.value = "";
  roleQuery.value = "all";
}

// Table Columns
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
    key: "email",
    label: "EMAIL",
    sortable: true,
  },
  {
    key: "role.name",
    label: "ROLE",
    sortable: true,
  },
  {
    key: "createdAt",
    label: "CREATED",
    sortable: true,
    formatter: (value: IUser["createdAt"]) =>
      (value ? formatDateTime(String(value)) : "-") as string,
  },
  {
    key: "updatedAt",
    label: "LAST UPDATED",
    sortable: true,
    formatter: (value: IUser["updatedAt"]) =>
      (value ? formatDateTime(String(value)) : "-") as string,
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];

// Event Handlers
const handlePageChange = (page: number) => {
  table.setPage(page);
};

const handlePerPageChange = (perPage: number) => {
  table.setPerPage(perPage);
};

const handleSort = (payload: {
  key: string | null;
  dir: "asc" | "desc" | "none" | null;
}) => {
  if (payload.key === "role") {
    payload.key = "role.name";
  }
  table.setSortFromSingle(payload);
};

const handleDelete = (user: IUser) => {
  // Implement delete functionality
  console.log("Delete user:", user);
};

const handleExport = async () => {
  try {
    // Implement export functionality
    console.log("Exporting users...");

    const response = await $api(ENDPOINTS.USERS.EXPORT, {
      method: "POST",
      body: {},
      responseType: "blob",
    });

    const url = URL.createObjectURL(response);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.csv";
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Export started successfully");
  } catch (error) {
    console.error("Error exporting users:", error);
    toast.error("Failed to export users");
  }
};

// Derived stats for header cards
const statAdmins = computed(
  () =>
    (table.rows.value || []).filter(
      (u) => u.role?.name?.toLowerCase() === ROLES.ADMIN,
    ).length,
);
const statTeachers = computed(
  () =>
    (table.rows.value || []).filter(
      (u) => u.role?.name?.toLowerCase() === ROLES.TEACHER,
    ).length,
);
const statStudents = computed(
  () =>
    (table.rows.value || []).filter(
      (u) => u.role?.name?.toLowerCase() === ROLES.STUDENT,
    ).length,
);

const handleResetPassword = async (user: IUser) => {
  const response = await $api(ENDPOINTS.USERS.RESET_PASSWORD, {
    method: "POST",
    body: { userId: user.id },
  });

  toast.action(
    "Password reset token has been sent to user's email",
    "Password Reset",
    [
      {
        label: "Copy",
        onClick: () => {
          navigator.clipboard.writeText(response.data?.token ?? "");
          toast.success("Token copied to clipboard");
        },
      },
    ],
  );
};
</script>

<template>
  <div class="page-container">
    <!-- Page Header -->
    <header class="flex items-center justify-between mb-4">
      <div>
        <h1
          class="text-2xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <Icon name="i-lucide-users" class="text-primary" />
          User & Role Management
        </h1>
        <p class="text-gray-600">
          Manage your application users and their permissions
        </p>
      </div>
      <NuxtLink
        v-can="Permission.USER_CREATE"
        to="/users/create"
        class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      >
        <Icon name="i-lucide-plus" class="h-4 w-4" />
        Add User
      </NuxtLink>
    </header>

    <!-- Stats Cards -->
    <section class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center gap-3"
      >
        <Icon name="i-lucide-shield-check" class="text-2xl text-primary" />
        <div>
          <div class="text-2xl font-bold">{{ statAdmins }}</div>
          <div class="text-gray-600 text-sm">Administrators</div>
        </div>
      </div>
      <div
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center gap-3"
      >
        <Icon name="i-lucide-graduation-cap" class="text-2xl text-blue-500" />
        <div>
          <div class="text-2xl font-bold">{{ statTeachers }}</div>
          <div class="text-gray-600 text-sm">Teachers</div>
        </div>
      </div>
      <div
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center gap-3"
      >
        <Icon name="i-lucide-user-round" class="text-2xl text-emerald-500" />
        <div>
          <div class="text-2xl font-bold">{{ statStudents }}</div>
          <div class="text-gray-600 text-sm">Students</div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <BaseTable
      :title="'Users'"
      :columns="columns as ITableColumn<IUser>[]"
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
            v-model="roleQuery"
            class="w-36 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option v-for="opt in roleItems" :key="opt.id" :value="opt.id">
              {{ opt.label }}
            </option>
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
          <!-- button reset password -->
          <button
            v-can="Permission.USER_UPDATE"
            type="button"
            class="inline-flex items-center rounded-lg px-2 py-1 text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
            aria-label="Edit"
            @click="handleResetPassword(row as IUser)"
          >
            <Icon name="i-lucide-lock" class="h-4 w-4" />
          </button>
          <!-- button edit -->
          <NuxtLink
            v-can="Permission.USER_UPDATE"
            :to="`/users/${(row as IUser).id}`"
            class="inline-flex items-center rounded-lg px-2 py-1 text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
            aria-label="Edit"
          >
            <Icon name="i-lucide-pencil" class="h-4 w-4" />
          </NuxtLink>
          <button
            v-can="Permission.USER_DELETE"
            type="button"
            class="inline-flex items-center rounded-lg px-2 py-1 text-amber-600 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30"
            aria-label="Delete"
            @click="handleDelete(row as IUser)"
          >
            <Icon name="i-lucide-trash" class="h-4 w-4" />
          </button>
        </div>
      </template>
      <!-- Custom Role Cell -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #cell:role.name="{ row }">
        <span
          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
          :class="
            (row?.role?.name || '').toLowerCase() === ROLES.ADMIN
              ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200'
              : (row?.role?.name || '').toLowerCase() === ROLES.TEACHER
                ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200'
                : 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200'
          "
        >
          {{ row?.role?.name || "-" }}
        </span>
      </template>
    </BaseTable>
  </div>
</template>
