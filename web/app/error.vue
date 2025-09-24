<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

const errorMessage = computed(() => {
  if (props.error?.statusCode === 404) return "Page not found";
  return props.error?.message || "An error occurred";
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
  >
    <div class="max-w-md w-full text-center bg-white p-8 rounded-xl shadow-lg">
      <div class="text-6xl font-bold text-red-500 mb-4">
        {{ error?.statusCode || "Oops!" }}
      </div>

      <h1 class="text-2xl font-semibold text-gray-800 mb-2">
        {{ errorMessage }}
      </h1>

      <p class="text-gray-600 mb-6">
        The page you're looking for might have been removed or is temporarily
        unavailable.
      </p>

      <button
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        @click="handleError"
      >
        Return to Home
      </button>

      <div class="mt-8 text-sm text-gray-500">
        <p>
          Need help?
          <a href="#" class="text-blue-600 hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add smooth animation for the error code */
.text-6xl {
  animation: bounce 1s ease-in-out;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}
</style>
