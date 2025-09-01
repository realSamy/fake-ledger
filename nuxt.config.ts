// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@compodium/nuxt', 'nuxt-lottie', '@nuxtjs/turnstile'],
  css: ['~/assets/css/main.css'],
  ssr: false,
  colorMode: false,
  lottie: {
    componentName: 'Lottie', // Optional: Customize the component name
    lottieFolder: '/assets/lottie' // Optional: Customize the Lottie folder path
  },
  vite: {
    server: {
      allowedHosts: ['localhost', '127.0.0.1', '5a34d83b5cff.ngrok-free.app'],
    }
  },
  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
    addValidateEndpoint: true,
  }
})