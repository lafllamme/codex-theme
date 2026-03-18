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
      { name: 'Geist', provider: 'google' },
      { name: 'Geist Mono', provider: 'google' },
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
    ],
  },
  css: ['~/assets/styles/fonts.scss', '~/assets/styles/workbench-tokens.css'],
  modules: ['@nuxt/fonts', '@nuxt/icon', '@unocss/nuxt'],
})
