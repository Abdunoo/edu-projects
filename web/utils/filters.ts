import type {
  FilterCondition,
  FilterOperator,
  FilterVariant,
} from "~~/types/data";

export const FC = {
  text(
    id: string,
    value: string,
    operator: FilterOperator = "iLike" as const,
  ): FilterCondition {
    return { id, value, variant: "text", operator };
  },

  number(
    id: string,
    value: number,
    operator: FilterOperator = "eq" as const,
  ): FilterCondition {
    return { id, value, variant: "number", operator };
  },

  range(id: string, min: number, max: number): FilterCondition {
    return { id, value: [min, max], variant: "range", operator: "isBetween" };
  },

  boolean(
    id: string,
    value: boolean,
    operator: FilterOperator = "eq" as const,
  ): FilterCondition {
    return { id, value, variant: "boolean", operator };
  },

  select(
    id: string,
    value: string | number,
    operator: FilterOperator = "eq" as const,
  ): FilterCondition {
    return { id, value, variant: "select", operator };
  },

  multiSelect(
    id: string,
    values: Array<string | number>,
    operator: FilterOperator = "inArray" as const,
  ): FilterCondition {
    return { id, value: values, variant: "multiSelect", operator };
  },

  date(
    id: string,
    value: string | Date,
    operator: FilterOperator = "eq" as const,
  ): FilterCondition {
    return { id, value, variant: "date", operator };
  },

  dateRange(
    id: string,
    start: string | Date,
    end: string | Date,
  ): FilterCondition {
    return {
      id,
      value: [start, end],
      variant: "dateRange",
      operator: "isBetween",
    };
  },

  empty(id: string): FilterCondition {
    return { id, value: null, variant: "text", operator: "isEmpty" };
  },

  notEmpty(id: string): FilterCondition {
    return { id, value: null, variant: "text", operator: "isNotEmpty" };
  },

  custom(
    id: string,
    value: unknown,
    variant: FilterVariant,
    operator: FilterOperator,
    filterId?: string,
  ): FilterCondition {
    return { id, value, variant, operator, filterId };
  },
};
