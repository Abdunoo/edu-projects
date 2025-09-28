<script setup lang="ts">
defineEmits(["toggle-mobile-menu"]);
const auth = useAuthStore();

async function handleLogout() {
  await auth.logout();
  navigateTo("/login");
}
</script>

<template>
  <header
    class="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm sm:px-6"
  >
    <!-- Mobile menu button -->
    <div class="flex items-center lg:hidden">
      <button
        type="button"
        class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
        @click="$emit('toggle-mobile-menu')"
      >
        <span class="sr-only">Open main menu</span>
        <Icon name="i-lucide-menu" class="h-6 w-6" />
      </button>
    </div>

    <!-- Logo (desktop) -->
    <div
      class="hidden lg:flex h-16 items-center justify-between border-b border-gray-200"
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

    <!-- Page title (mobile) -->
    <div
      class="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-start lg:hidden"
    >
      <h1 class="text-lg font-semibold text-gray-900">
        <slot name="title">Dashboard</slot>
      </h1>
    </div>

    <!-- Right side actions -->
    <div class="flex items-center space-x-4">
      <!-- Search (desktop) -->
      <div class="hidden lg:block">
        <div class="relative">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <Icon name="i-lucide-search" class="h-4 w-4 text-gray-400" />
          </div>
          <input
            id="search"
            name="search"
            type="search"
            class="w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
            placeholder="Search"
          />
        </div>
      </div>

      <!-- User Profile -->
      <div class="border-t border-gray-200 p-4">
        <div class="group relative">
          <button
            class="flex w-full items-center rounded-lg p-1 hover:bg-gray-100"
          >
            <img
              class="h-9 w-9 flex-shrink-0 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
            />
            <div class="ml-3 min-w-0 flex-1 text-left">
              <p class="truncate text-sm font-medium text-gray-900">John Doe</p>
              <p class="truncate text-xs text-gray-500">Admin</p>
            </div>
            <Icon
              name="i-lucide-chevron-down"
              class="ml-auto h-4 w-4 text-gray-400 group-hover:text-gray-500"
            />
          </button>
          <!-- User dropdown menu -->
          <div
            class="invisible absolute left-0 mb-2 w-40 origin-bottom-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none group-hover:visible"
          >
            <NuxtLink
              href="/profile"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >Your Profile</NuxtLink
            >
            <NuxtLink
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >Settings</NuxtLink
            >
            <span
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="handleLogout"
              >Sign out</span
            >
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
