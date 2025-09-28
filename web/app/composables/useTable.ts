import { ref, computed, watch, reactive } from "vue";
import type { Ref } from "vue";
import type { FilterCondition } from "~~/types/data";

export type SortState = { key: string | null; dir: "asc" | "desc" | null };
export type FetchResult<T> = { data: T[]; total: number };
export type Fetcher<T> = (args: {
  page: number;
  perPage: number;
  filters: FilterCondition[];
  sort: SortState;
}) => Promise<FetchResult<T>>;

export function useTable<T>(params: {
  perPage?: number;
  initialFilters?: FilterCondition[];
  fetcher: Fetcher<T>;
}) {
  const page = ref(1);
  const perPage = ref(params.perPage ?? 10);
  const total = ref(0);
  const rows: Ref<T[]> = ref([]);
  const loading = ref(false);
  const filters = reactive<FilterCondition[]>({
    ...(params.initialFilters ?? ({} as FilterCondition[])),
  });
  const sort = ref<SortState>({ key: null, dir: null });

  const pageCount = computed(() =>
    Math.max(1, Math.ceil((total.value || 0) / perPage.value)),
  );

  async function load() {
    loading.value = true;
    try {
      const res = await params.fetcher({
        page: page.value,
        perPage: perPage.value,
        filters: filters,
        sort: sort.value,
      });
      rows.value = res.data;
      total.value = res.total;
    } finally {
      loading.value = false;
    }
  }

  function setPage(p: number) {
    page.value = p;
  }
  function setperPage(ps: number) {
    perPage.value = ps;
    page.value = 1;
  }
  function setSort(s: SortState) {
    sort.value = s;
  }

  function resetFilters(next?: Partial<FilterCondition[]>) {
    for (const k of Object.keys(filters) as (keyof FilterCondition[] &
      string)[]) {
      (filters as Record<string, any>)[k] = undefined;
    }
    Object.assign(
      filters as Record<string, any>,
      (next ?? {}) as Record<string, any>,
    );
    page.value = 1;
  }

  function toCSV(opts?: { columns?: { key: keyof T; label: string }[] }) {
    const columns =
      opts?.columns ??
      (Object.keys(rows.value[0] ?? {}) as (keyof T)[]).map((k) => ({
        key: k,
        label: String(k),
      }));
    const header = columns
      .map((c) => '"' + String(c.label).replace(/"/g, '""') + '"')
      .join(",");
    const body = rows.value
      .map((r) =>
        columns
          .map((c) => {
            const val = (r as unknown as Record<string, unknown>)[
              c.key as unknown as string
            ];
            return '"' + String(val ?? "").replace(/"/g, '""') + '"';
          })
          .join(","),
      )
      .join("\n");
    const csv = header + "\n" + body;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  watch(
    [
      page,
      perPage,
      () => JSON.stringify(filters),
      () => JSON.stringify(sort.value),
    ],
    load,
    {
      immediate: true,
    },
  );

  return {
    page,
    perPage,
    total,
    pageCount,
    rows,
    loading,
    filters,
    sort,
    load,
    setPage,
    setperPage,
    setSort,
    resetFilters,
    toCSV,
  };
}
