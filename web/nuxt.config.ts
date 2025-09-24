// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt"],

  ui: {
    fonts: true,
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    private: {
      apiBase: process.env.API_BASE ?? "http://localhost:3001/api", // Nest origin
    },
    public: {
      apiBase: process.env.PUBLIC_API_BASE ?? "http://localhost:3001", // for direct calls
    },
  },

  compatibilityDate: "2025-07-16",
});
