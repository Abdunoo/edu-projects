# Role-Based Access Control (RBAC) System

This document outlines the RBAC system implemented in the application.

## Overview

The RBAC system provides a flexible way to control access to different parts of the application based on user roles and permissions. It includes:

- Permission definitions
- Role-to-permission mappings
- Auth store with permission checks
- Route guards for page access control
- UI components for conditional rendering
- Composables for programmatic permission checks

## Permission Structure

Permissions follow a resource-based naming convention: `resource:action`

For example:

- `user:create` - Permission to create users
- `student:read` - Permission to read student data

## Role Definitions

The system includes predefined roles with associated permissions:

- **Admin**: Has access to all permissions
- **Teacher**: Has limited permissions focused on student, class, and grade management
- **Student**: Has very limited permissions focused on viewing their own data

## Usage

### Route Protection

To protect a page with permissions:

```ts
// pages/users/index.vue
definePageMeta({
  requiresAuth: true,
  permissionsAny: [Permission.USER_READ], // User needs any of these permissions
  // OR
  permissionsAll: [Permission.USER_READ, Permission.USER_CREATE], // User needs all of these permissions
});
```

### UI Conditional Rendering

#### Using v-can Directive

```vue
<!-- Show element only if user has the permission -->
<button v-can="Permission.USER_CREATE">Create User</button>

<!-- Show element if user has ANY of these permissions -->
<button
  v-can="{ any: [Permission.USER_CREATE, Permission.USER_UPDATE] }"
>Manage Users</button>

<!-- Show element if user has ALL of these permissions -->
<button
  v-can="{ all: [Permission.USER_READ, Permission.USER_UPDATE] }"
>Edit User</button>
```

#### Using useAcl Composable

```vue
<script setup>
import { useAcl } from "~/composables/useAcl";
import { Permission } from "~/types/permissions";

const acl = useAcl();

// Check if user has a specific permission
const canCreateUser = computed(() => acl.can(Permission.USER_CREATE));

// Check if user has any of these permissions
const canManageUsers = computed(() =>
  acl.canAny([Permission.USER_CREATE, Permission.USER_UPDATE]),
);

// Check if user has all of these permissions
const canEditUser = computed(() =>
  acl.canAll([Permission.USER_READ, Permission.USER_UPDATE]),
);
</script>

<template>
  <button v-if="canCreateUser">Create User</button>
  <button v-if="canManageUsers">Manage Users</button>
  <button v-if="canEditUser">Edit User</button>
</template>
```

## Implementation Details

### Auth Store

The auth store (`stores/auth.ts`) manages the user's authentication state and permissions. It provides methods to check if a user has specific permissions.

### Auth Middleware

The global auth middleware (`middleware/auth.global.ts`) checks if the user is authenticated and has the required permissions to access a page.

### Permission Directive

The v-can directive (`plugins/permission-directive.client.ts`) provides a convenient way to conditionally render UI elements based on permissions.

### ACL Composable

The useAcl composable (`composables/useAcl.ts`) provides a programmatic way to check permissions in components.

## Best Practices

1. Always use the permission system to control access to sensitive functionality
2. Prefer declarative permission checks (v-can directive, route meta) over imperative checks when possible
3. Use specific permissions rather than role checks for more granular control
4. Remember that frontend permission checks are for UX only - always implement backend permission checks as well
