# BaseTable Component Documentation

The `BaseTable` component is a versatile and feature-rich table component for displaying tabular data in your application. It supports nested data structures, various data types, sorting, pagination, and customizable styling.

## Features

- **Nested Data Support**: Access nested properties using dot notation (e.g., `student.name`)
- **Data Type Formatting**: Automatic formatting for different data types (date, datetime, number, boolean, array)
- **Pagination**: Built-in pagination with customizable page size
- **Sorting**: Column sorting with ascending/descending/none states
- **Customizable Styling**: Control density, striping, hover effects, and more
- **Empty State Handling**: Customizable empty state message
- **Loading State**: Built-in loading indicator
- **Slot-based Cell Customization**: Override cell rendering with custom slots

## Usage

```vue
<BaseTable
  :title="'My Table'"
  :columns="columns"
  :rows="rows"
  :page="page"
  :per-page="perPage"
  :total-rows="totalRows"
  :loading="loading"
  :empty-text="'No data found'"
  :date-format="'long'"
  :highlight-on-hover="true"
  :striped-rows="true"
  @update:page="handlePageChange"
  @update:per-page="handlePerPageChange"
  @sort="handleSort"
>
  <!-- Custom cell rendering -->
  <template #cell:actions="{ row }">
    <button @click="handleEdit(row)">Edit</button>
    <button @click="handleDelete(row)">Delete</button>
  </template>
</BaseTable>
```

## Props

| Prop               | Type                         | Default               | Description                         |
| ------------------ | ---------------------------- | --------------------- | ----------------------------------- |
| `title`            | `string`                     | `undefined`           | Table title displayed in the header |
| `columns`          | `ITableColumn<T>[]`          | Required              | Column definitions                  |
| `rows`             | `T[] \| Ref<T[]>`            | Required              | Data rows to display                |
| `loading`          | `boolean \| Ref<boolean>`    | `false`               | Loading state                       |
| `page`             | `number \| Ref<number>`      | `1`                   | Current page number                 |
| `perPage`          | `number \| Ref<number>`      | `10`                  | Items per page                      |
| `totalRows`        | `number \| Ref<number>`      | `0`                   | Total number of rows                |
| `showExport`       | `boolean`                    | `false`               | Show export button                  |
| `density`          | `'comfortable' \| 'compact'` | `'comfortable'`       | Row spacing density                 |
| `stickyHeader`     | `boolean`                    | `true`                | Make header sticky on scroll        |
| `showIndex`        | `boolean`                    | `false`               | Show row index column               |
| `emptyText`        | `string`                     | `'No data available'` | Text to display when no data        |
| `dateFormat`       | `'short' \| 'long'`          | `'short'`             | Date format style                   |
| `highlightOnHover` | `boolean`                    | `true`                | Highlight rows on hover             |
| `stripedRows`      | `boolean`                    | `true`                | Apply zebra striping to rows        |

## Column Definition

The `ITableColumn` interface defines the structure of each column:

```typescript
interface ITableColumn<T = Record<string, unknown>> {
  key: string | keyof T | "actions";
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  type?: "text" | "number" | "date" | "datetime" | "boolean" | "array";
  formatter?: (value: any) => string | number | boolean;
}
```

### Column Types

- `text`: Default, displays as is
- `number`: Formatted with locale-specific number formatting
- `date`: Formatted as date only (e.g., "Sep 23, 2025")
- `datetime`: Formatted as date and time (e.g., "Sep 23, 2025, 4:15 PM")
- `boolean`: Displayed as "Yes" or "No"
- `array`: Joined with commas

## Events

| Event             | Payload                                                           | Description                           |
| ----------------- | ----------------------------------------------------------------- | ------------------------------------- |
| `update:page`     | `number`                                                          | Emitted when page changes             |
| `update:per-page` | `number`                                                          | Emitted when items per page changes   |
| `export`          | None                                                              | Emitted when export button is clicked |
| `sort`            | `{ key: string \| null; dir: 'asc' \| 'desc' \| 'none' \| null }` | Emitted when sorting changes          |

## Slots

| Slot         | Props            | Description                               |
| ------------ | ---------------- | ----------------------------------------- |
| `toolbar`    | None             | Custom content for the toolbar area       |
| `filters`    | None             | Custom filters below the header           |
| `cell:{key}` | `{ row, value }` | Custom cell rendering for specific column |

## Example with Nested Data

```typescript
// Column definitions
const columns = [
  { key: "student.name", label: "Student", sortable: true, type: "text" },
  { key: "class.name", label: "Class", sortable: true, type: "text" },
  {
    key: "updatedAt",
    label: "Last Updated",
    sortable: false,
    type: "datetime",
  },
  { key: "actions", label: "Actions" },
];

// Data with nested properties
const rows = [
  {
    id: 1,
    classId: 6,
    studentId: 401,
    updatedAt: "2025-09-18T17:27:12.686Z",
    class: {
      id: 6,
      name: "Class 6",
    },
    student: {
      id: 401,
      name: "Student 4",
    },
  },
];
```

## Custom Cell Rendering

You can customize cell rendering using named slots:

```vue
<BaseTable :columns="columns" :rows="rows">
  <template #cell:updatedAt="{ value }">
    <span class="text-gray-700">{{ value }}</span>
  </template>
  
  <template #cell:actions="{ row }">
    <div class="flex items-center space-x-2">
      <button @click="edit(row)">Edit</button>
      <button @click="remove(row)">Delete</button>
    </div>
  </template>
</BaseTable>
```
