import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap',
          crossorigin: '',
        },
      ],
    },
  },
  fonts: {
    families: [
      {
        name: 'Geist',
        provider: 'google',
        weights: ['100 900'],
      },
      {
        name: 'Geist Mono',
        provider: 'google',
        weights: ['100 900'],
      },
      {
        name: 'Imbue',
        provider: 'google',
        weights: ['100 900'],
      },
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
    ],
  },
  css: ['~/assets/styles/main.scss'],
  modules: ['@nuxt/fonts', '@nuxt/icon', '@pinia/nuxt', '@unocss/nuxt'],
})
