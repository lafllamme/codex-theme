import process from 'node:process'
import { defineNuxtConfig } from 'nuxt/config'

/** Official deploy (Cloudflare Pages). Local dev uses localhost unless `NUXT_PUBLIC_SITE_URL` is set. */
const PRODUCTION_SITE_URL = 'https://codex-theme.pages.dev'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL
  ?? (process.env.NODE_ENV === 'production' ? PRODUCTION_SITE_URL : 'http://localhost:3000')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  site: {
    url: siteUrl,
  },

  runtimeConfig: {
    public: {
      siteUrl,
      siteName: 'Codex Theme Studio',
      /** Prefer a true 1200×630 file under ~600 KB (e.g. WebP) for WhatsApp; replace asset if validators complain. */
      ogImage: 'https://i.ibb.co/1tfWb0jq/og-image-1200x630.webp',
      ogImageAlt:
        'Codex Theme Studio — preview & export OpenAI Codex IDE themes. Open the theme builder or docs.',
      ogImageWidth: 1200,
      ogImageHeight: 630,
      githubUrl: 'https://github.com/lafllamme/codex-themes',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Codex Theme Studio',
      meta: [
        { name: 'theme-color', content: '#030405' },
        { name: 'apple-mobile-web-app-title', content: 'Codex Theme Studio' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
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
  modules: ['@nuxt/fonts', '@nuxt/icon', '@pinia/nuxt', '@unocss/nuxt', '@nuxtjs/sitemap'],

  sitemap: {
    strictNuxtContentPaths: true,
  },
})
