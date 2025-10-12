// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt"],

  ui: {
    fonts: true,
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    // Server-side only (private)
    apiBase: process.env.NUXT_API_BASE ?? "http://localhost:3001/api",
    // Client-side (public)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "http://localhost:3001",
      wsUrl: process.env.NUXT_PUBLIC_WS_URL ?? "ws://localhost:3001/dashboard",
    },
  },

  compatibilityDate: "2025-07-16",
});
