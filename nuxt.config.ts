import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  fonts: {
    families: [
      { name: 'Geist', provider: 'google' },
      { name: 'Geist Mono', provider: 'google' },
    ],
  },
  css: ['~/assets/styles/fonts.scss', '~/assets/styles/workbench-tokens.css'],
  modules: ['@nuxt/fonts', '@nuxt/icon', '@unocss/nuxt'],
})
