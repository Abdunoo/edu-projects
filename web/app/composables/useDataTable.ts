import { ref, computed, watch } from "vue";
import type { Ref } from "vue";
import type {
  FilterCondition,
  JoinOperator,
  ListRequestPayload,
  ListResponseData,
  SortItem,
} from "~~/types/data";

export type DataTableFetcher<T> = (
  payload: ListRequestPayload,
) => Promise<ListResponseData<T>>;

export function useDataTable<T>(params: {
  perPage?: number;
  initialFilters?: FilterCondition[];
  joinOperator?: JoinOperator;
  fetcher: DataTableFetcher<T>;
  auto?: boolean;
}) {
  const page = ref(1);
  const perPage = ref(params.perPage ?? 10);
  const totalRows = ref(0);
  const pageCount = ref(1);
  const rows: Ref<T[]> = ref([]);
  const loading = ref(false);

  const filters = ref<FilterCondition[]>(params.initialFilters ?? []);
  const joinOperator = ref<JoinOperator>(params.joinOperator ?? "and");
  const sort = ref<SortItem[]>([]);

  const payload = computed<ListRequestPayload>(() => ({
    page: page.value,
    perPage: perPage.value,
    filters: filters.value?.length ? filters.value : undefined,
    joinOperator: joinOperator.value,
    sort: sort.value?.length ? sort.value : undefined,
  }));

  async function load() {
    loading.value = true;
    try {
      const data = await params.fetcher(payload.value);
      rows.value = data.rows;
      totalRows.value = data.totalRows;
      pageCount.value = Math.max(
        1,
        data.pageCount ||
          Math.ceil((data.totalRows || 0) / (perPage.value || 1)),
      );
    } finally {
      loading.value = false;
    }
  }

  function setPage(p: number) {
    page.value = p;
  }

  function setPerPage(ps: number) {
    perPage.value = ps;
    page.value = 1;
  }

  function setSort(next: SortItem[]) {
    sort.value = next;
  }

  function setSortFromSingle(single: {
    key: string | null;
    dir: "asc" | "desc" | "none" | null;
  }) {
    if (!single?.key || !single?.dir) {
      sort.value = [];
    } else {
      sort.value = [{ id: single.key, desc: single.dir === "desc" }];
    }
  }

  function resetFilters(next?: FilterCondition[], nextJoin?: JoinOperator) {
    filters.value = next ?? [];
    if (nextJoin) joinOperator.value = nextJoin;
    page.value = 1;
  }

  watch(
    [
      page,
      perPage,
      () => JSON.stringify(filters.value),
      joinOperator,
      () => JSON.stringify(sort.value),
    ],
    () => {
      if (params.auto !== false) load();
    },
    { immediate: params.auto !== false },
  );

  return {
    page,
    perPage,
    totalRows,
    pageCount,
    rows,
    loading,
    filters,
    joinOperator,
    sort,
    payload,
    load,
    setPage,
    setPerPage,
    setSort,
    setSortFromSingle,
    resetFilters,
  };
}
