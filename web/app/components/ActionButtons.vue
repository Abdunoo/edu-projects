<template>
  <div class="flex gap-2">
    <!-- View button - available to anyone with read permission -->
    <button
      v-if="canView"
      class="btn btn-sm btn-info"
      @click="$emit('view', item)"
    >
      View
    </button>

    <!-- Edit button - only for those with update permission -->
    <button
      v-if="canEdit"
      class="btn btn-sm btn-warning"
      @click="$emit('edit', item)"
    >
      Edit
    </button>

    <!-- Delete button - only for those with delete permission -->
    <button
      v-if="canDelete"
      class="btn btn-sm btn-danger"
      @click="$emit('delete', item)"
    >
      Delete
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAcl } from "~/composables/useAcl";
import type { Permission } from "~~/types/permissions";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  resourceType: {
    type: String,
    required: true,
    validator: (value: string) => {
      return [
        "user",
        "student",
        "class",
        "enrollment",
        "grade",
        "role",
      ].includes(value);
    },
  },
});

const emit = defineEmits(["view", "edit", "delete"]);

const acl = useAcl();

// Dynamically determine permissions based on resource type
const canView = computed(() => {
  const permission = `${props.resourceType}:read` as Permission;
  return acl.can(permission);
});

const canEdit = computed(() => {
  const permission = `${props.resourceType}:update` as Permission;
  return acl.can(permission);
});

const canDelete = computed(() => {
  const permission = `${props.resourceType}:delete` as Permission;
  return acl.can(permission);
});
</script>
