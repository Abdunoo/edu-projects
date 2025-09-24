<script setup lang="ts">
const currentYear = new Date().getFullYear();

const navigation = {
  social: [
    { name: "Facebook", href: "#", icon: "i-lucide-facebook" },
    { name: "Twitter", href: "#", icon: "i-lucide-twitter" },
    { name: "Instagram", href: "#", icon: "i-lucide-instagram" },
    { name: "LinkedIn", href: "#", icon: "i-lucide-linkedin" },
    { name: "GitHub", href: "#", icon: "i-lucide-github" },
  ],
};
</script>

<template>
  <footer class="bg-white border-t border-gray-200">
    <div
      class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8"
    >
      <div class="flex justify-center space-x-6 md:order-2">
        <a
          v-for="item in navigation.social"
          :key="item.name"
          :href="item.href"
          class="text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">{{ item.name }}</span>
          <Icon :name="item.icon" class="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
      <div class="mt-8 md:order-1 md:mt-0">
        <p class="text-center text-xs leading-5 text-gray-500">
          &copy; {{ currentYear }} EduManagePro. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Smooth hover transitions */
a {
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
