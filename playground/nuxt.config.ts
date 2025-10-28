// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/icon',
  ],
  css: ['~/assets/css/main.css'],
  ui: {
    fonts: false,
  },
  icon: {
    clientBundle: {
      scan: true,
    },
  },
})
