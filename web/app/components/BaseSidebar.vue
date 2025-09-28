<script setup lang="ts">
import { Permission } from "~~/types/permissions";

const route = useRoute();

interface NavItem {
  label: string;
  icon: string;
  to: string;
  badge?: string | number;
  can?: string;
}

const navItems = ref<NavItem[]>([
  { label: "Dashboard", icon: "i-lucide-layout-dashboard", to: "/" },
  {
    label: "Students",
    icon: "i-lucide-users",
    to: "/students",
    can: Permission.STUDENT_READ,
  },
  {
    label: "Classes",
    icon: "i-lucide-presentation",
    to: "/classes",
    can: Permission.CLASS_READ,
  },
  {
    label: "Enrollments",
    icon: "i-lucide-book-open",
    to: "/enrollments",
    can: Permission.ENROLLMENT_READ,
  },
]);

const navTitle = ref("MANAGEMENT");

const settingsItems = ref<NavItem[]>([
  {
    label: "Grades",
    icon: "i-lucide-award",
    to: "/grades",
    can: Permission.GRADE_READ,
  },
  {
    label: "Users & Roles",
    icon: "i-lucide-users",
    to: "/users",
    can: Permission.USER_READ,
  },
  { label: "Help & Support", icon: "i-lucide-help-circle", to: "/help" },
]);

const isActive = (path: string) => {
  return route.path === path;
};

const emit = defineEmits<{
  (e: "navigate"): void;
}>();
const props = defineProps<{ isMobile?: boolean }>();
</script>

<template>
  <div class="flex h-full flex-col bg-white border-r border-gray-200">
    <!-- Logo -->
    <div
      v-if="isMobile"
      class="flex h-16 items-center justify-between border-b border-gray-200 px-6"
    >
      <div class="flex items-center space-x-2">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600"
        >
          <Icon name="i-lucide-graduation-cap" class="h-5 w-5 text-white" />
        </div>
        <span class="text-xl font-bold text-gray-900">EduManagePro</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4">
      <div class="space-y-1">
        <div v-for="item in navItems" :key="item.to" class="group">
          <NuxtLink
            v-can="item.can ?? ''"
            :to="item.to"
            class="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200"
            :class="[
              isActive(item.to)
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100',
            ]"
            @click="props.isMobile && emit('navigate')"
          >
            <Icon :name="item.icon" class="mr-3 h-5 w-5 flex-shrink-0" />
            <span>{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="ml-auto inline-flex h-5 items-center rounded-full bg-primary-100 px-2.5 text-xs font-medium text-primary-800"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>
        </div>
      </div>

      <!-- Divider -->
      <!-- <div class="my-6 border-t border-gray-200" /> -->

      <!-- Settings -->
      <div class="space-y-1 mt-6">
        <!-- nav title -->
        <p class="font-semibold text-sm text-gray-900">
          {{ navTitle }}
        </p>
        <div v-for="item in settingsItems" :key="item.to" class="group">
          <NuxtLink
            v-can="item.can ?? ''"
            :to="item.to"
            class="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100"
            @click="props.isMobile && emit('navigate')"
          >
            <Icon
              :name="item.icon"
              class="mr-3 h-5 w-5 flex-shrink-0 text-gray-500"
            />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
/* Smooth transitions for dropdown */
.group:hover .group-hover\:visible {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
}

.group-hover\:visible {
  visibility: hidden;
  opacity: 0;
  transform: translateY(10px);
  transition:
    visibility 0.2s,
    opacity 0.2s,
    transform 0.2s;
}
</style>

<style scoped>
/* Custom scrollbar for the navigation */
nav {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb #f3f4f6;
}

/* For WebKit browsers */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
}
</style>
