<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const route = useRoute()
const isMobileMenuOpen = ref(false)
const isMobile = ref(false)
const mobileMenuRef = ref<HTMLElement | null>(null)

// Close mobile menu when route changes
watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false
  }
)

// Close mobile menu when clicking outside the sidebar
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node | null
  if (!isMobileMenuOpen.value) return
  if (mobileMenuRef.value && target && mobileMenuRef.value.contains(target)) return
  isMobileMenuOpen.value = false
}

// Add keyboard navigation for mobile menu
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  // Track viewport width to determine mobile vs desktop (Tailwind lg breakpoint: 1024px)
  const mq = window.matchMedia('(max-width: 1023px)')
  const setFromMQ = () => {
    isMobile.value = mq.matches
  }
  setFromMQ()
  mq.addEventListener?.('change', setFromMQ)

  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('mousedown', handleClickOutside)
  // Cleanup media query listener on unmount
  onUnmounted(() => {
    mq.removeEventListener?.('change', setFromMQ)
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousedown', handleClickOutside)
})

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// (Dark mode removed)
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-gray-50 transition-colors duration-200">
    <!-- Header -->
    <BaseHeader :is-mobile="isMobile" @toggle-mobile-menu="toggleMobileMenu" />

    <!-- Mobile sidebar overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="isMobileMenuOpen = false"
    />

    <div class="flex flex-1 min-h-0 overflow-hidden">
      <Transition
        enter-active-class="transition-opacity ease-linear duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-linear duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isMobileMenuOpen"
          class="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" />
        </div>
      </Transition>

      <!-- Mobile sidebar -->
      <Transition
        enter-active-class="transition ease-in-out duration-300 transform"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition ease-in-out duration-300 transform"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div
          v-if="isMobileMenuOpen"
          ref="mobileMenuRef"
          class="fixed inset-y-0 left-0 z-50 w-64 bg-white lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <BaseSidebar :is-mobile="true" @navigate="isMobileMenuOpen = false" />
        </div>
      </Transition>

      <!-- Static sidebar for desktop -->
      <div class="hidden lg:flex lg:flex-shrink-0">
        <div class="w-64 flex flex-col h-full">
          <BaseSidebar />
        </div>
      </div>

      <!-- Main content -->
      <main class="flex-1 min-h-0 relative z-0 overflow-y-auto focus:outline-none">
        <div class="p-4 sm:p-6">
          <slot />
        </div>
      </main>
    </div>

    <!-- Footer -->
    <!-- <BaseFooter /> -->
  </div>
</template>

<style>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #2d3748;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>
