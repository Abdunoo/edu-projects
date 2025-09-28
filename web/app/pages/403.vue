<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4"
  >
    <div class="text-center">
      <h1 class="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 class="text-3xl font-semibold text-gray-800 mb-6">Access Denied</h2>
      <p class="text-lg text-gray-600 mb-8">
        You don't have permission to access this page.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          to="/"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </NuxtLink>
        <button
          class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          @click="goBack"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "empty",
  requiresAuth: false,
});

function goBack() {
  return navigateTo("/");
}
</script>
