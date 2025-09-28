<template>
  <aside class="w-64 bg-white shadow-md h-screen">
    <div class="p-4">
      <h2 class="text-xl font-semibold text-gray-800">Dashboard</h2>
    </div>
    <nav class="mt-4">
      <ul class="space-y-1">
        <li>
          <NuxtLink
            to="/"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            active-class="bg-blue-50 text-blue-700 border-l-4 border-blue-500"
          >
            <span class="ml-2">Dashboard</span>
          </NuxtLink>
        </li>

        <!-- Users section - only for admins -->
        <li v-can="Permission.USER_READ">
          <NuxtLink
            to="/users"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            active-class="bg-blue-50 text-blue-700 border-l-4 border-blue-500"
          >
            <span class="ml-2">Users</span>
          </NuxtLink>
        </li>

        <!-- Roles section - only for admins -->
        <li v-can="Permission.ROLE_READ">
          <NuxtLink
            to="/roles"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            active-class="bg-blue-50 text-blue-700 border-l-4 border-blue-500"
          >
            <span class="ml-2">Roles</span>
          </NuxtLink>
        </li>

        <!-- Students section - for teachers and admins -->
        <li v-can="Permission.STUDENT_READ">
          <NuxtLink
            to="/students"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            active-class="bg-blue-50 text-blue-700 border-l-4 border-blue-500"
          >
            <span class="ml-2">Students</span>
          </NuxtLink>
        </li>

        <!-- Classes section - for teachers and admins -->
        <li v-can="Permission.CLASS_READ">
          <NuxtLink
            to="/classes"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            active-class="bg-blue-50 text-blue-700 border-l-4 border-blue-500"
          >
            <span class="ml-2">Classes</span>
          </NuxtLink>
        </li>

        <!-- Enrollments section - for teachers and admins -->
        <li v-can="Permission.ENROLLMENT_READ">
          <NuxtLink
            to="/enrollments"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            active-class="bg-blue-50 text-blue-700 border-l-4 border-blue-500"
          >
            <span class="ml-2">Enrollments</span>
          </NuxtLink>
        </li>

        <!-- Grades section - for teachers and admins -->
        <li v-can="Permission.GRADE_READ">
          <NuxtLink
            to="/grades"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            active-class="bg-blue-50 text-blue-700 border-l-4 border-blue-500"
          >
            <span class="ml-2">Grades</span>
          </NuxtLink>
        </li>

        <!-- Profile - for all authenticated users -->
        <li>
          <NuxtLink
            to="/profile"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            active-class="bg-blue-50 text-blue-700 border-l-4 border-blue-500"
          >
            <span class="ml-2">My Profile</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { Permission } from "~~/types/permissions";
</script>
