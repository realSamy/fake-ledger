// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: import.meta.dev },
  modules: [
    '@nuxt/ui',
    'nuxt-lottie',
    '@nuxtjs/turnstile',
    '@nuxtjs/color-mode'
  ],
  css: ['~/assets/css/main.css'],
  ssr: false,
  colorMode: {
    preference: 'dark',
  },
  lottie: {
    componentName: 'Lottie',
    lottieFolder: '/assets/lottie'
  },
  vite: {
    server: {
      allowedHosts: ['localhost', '127.0.0.1', '5a34d83b5cff.ngrok-free.app'],
    }
  },
  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
    addValidateEndpoint: true,
  },
  app: {
    head: {
      htmlAttrs: {
        class: 'dark max-w-screen overflow-x-hidden',
      },
      bodyAttrs: {
        class: 'w-screen h-screen md:overflow-hidden flex flex-col'
      }
    },
    rootAttrs: {
      class: 'flex flex-col grow',
    }
  }
})