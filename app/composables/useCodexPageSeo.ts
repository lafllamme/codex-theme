import { CODEX_THEME_SEO_KEYWORDS } from '~/data/seo-keywords'

const RE_TRAILING_SLASH = /\/$/
const RE_LEADING_SLASHES = /^\/+/

interface CodexPageSeoOptions {
  /** Short page title; use the same string as siteName for the home page to avoid "Name · Name". */
  title: string
  description: string
  /** Override canonical path (default: current route path). */
  path?: string
  /** Extra keywords merged with the global Codex list (deduped). */
  keywords?: string[]
  /** Override default `og:image` alt from runtime config. */
  ogImageAlt?: string
}

/**
 * Per-route SEO: title/description, Open Graph, Twitter, canonical, JSON-LD.
 * Uses `runtimeConfig.public`: siteUrl, siteName, ogImage, githubRepoName, githubUrl.
 */
export function useCodexPageSeo(options: CodexPageSeoOptions) {
  const config = useRuntimeConfig()
  const route = useRoute()

  const siteUrl = String(config.public.siteUrl).replace(RE_TRAILING_SLASH, '')
  const siteName = String(config.public.siteName)
  const ogImage = String(config.public.ogImage)
  const ogImageWidth = Number(config.public.ogImageWidth) || undefined
  const ogImageHeight = Number(config.public.ogImageHeight) || undefined
  const githubRepoName = String(config.public.githubRepoName ?? '').trim()
  const githubUrl = String(config.public.githubUrl ?? '').trim() || `https://github.com/${githubRepoName}`

  const path = options.path ?? route.path
  const normalizedPath = path === '/' ? '/' : `/${path.replace(RE_LEADING_SLASHES, '').replace(RE_TRAILING_SLASH, '')}`
  const canonical = `${siteUrl}${normalizedPath === '/' ? '' : normalizedPath}`

  const documentTitle = options.title === siteName
    ? siteName
    : `${options.title} · ${siteName}`

  const defaultOgImageAlt = String(config.public.ogImageAlt ?? '').trim()
  const ogImageAlt = options.ogImageAlt ?? (defaultOgImageAlt.length > 0 ? defaultOgImageAlt : documentTitle)

  const keywordSet = new Set<string>([...CODEX_THEME_SEO_KEYWORDS])
  if (options.keywords?.length) {
    for (const k of options.keywords)
      keywordSet.add(k)
  }
  const keywordList = [...keywordSet]
  const keywordsContent = keywordList.join(', ')

  useSeoMeta({
    title: documentTitle,
    description: options.description,
    keywords: keywordsContent,
    ogTitle: documentTitle,
    ogDescription: options.description,
    ogUrl: canonical,
    ogType: 'website',
    ogImage,
    ogImageSecureUrl: ogImage,
    ogImageAlt,
    ogImageWidth,
    ogImageHeight,
    ogSiteName: siteName,
    ogLocale: 'en_US',
    twitterCard: 'summary_large_image',
    twitterTitle: documentTitle,
    twitterDescription: options.description,
    twitterImage: ogImage,
    twitterImageAlt: ogImageAlt,
  })

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        'name': siteName,
        'url': `${siteUrl}/`,
        'description': options.description,
        'inLanguage': 'en-US',
        'keywords': keywordList,
        'publisher': {
          '@type': 'Organization',
          'name': siteName,
          'url': `${siteUrl}/`,
          'sameAs': githubUrl ? [githubUrl] : [],
        },
      },
      {
        '@type': 'SoftwareApplication',
        'name': siteName,
        'applicationCategory': 'DeveloperApplication',
        'operatingSystem': 'Any',
        'url': `${siteUrl}/`,
        'description': options.description,
        'inLanguage': 'en-US',
        'keywords': keywordList,
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
        },
      },
    ],
  }

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(structuredData),
      },
    ],
  })
}
