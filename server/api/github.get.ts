const FOUR_HOURS_IN_SECONDS = 60 * 60 * 4

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const repoName = String(config.public.githubRepoName ?? '').trim()
  const githubToken = String(config.githubToken ?? '').trim()

  /** Keeps browser/CDN cache aligned with Nitro cache TTL. */
  setHeader(event, 'Cache-Control', `public, max-age=${FOUR_HOURS_IN_SECONDS}, s-maxage=${FOUR_HOURS_IN_SECONDS}`)

  if (!repoName) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_PUBLIC_GITHUB_REPO_NAME is missing',
    })
  }

  const requestHeaders = new Headers()
  requestHeaders.set('accept', 'application/vnd.github+json')
  requestHeaders.set('user-agent', 'codex-theme')
  if (githubToken)
    requestHeaders.set('authorization', `Bearer ${githubToken}`)

  const repository = await $fetch<{ updated_at?: string }>(`https://api.github.com/repos/${repoName}`, {
    headers: requestHeaders,
  })

  return {
    updatedAt: repository.updated_at ?? null,
  }
}, {
  /** Cache this endpoint for 4h. */
  maxAge: FOUR_HOURS_IN_SECONDS,
  name: 'github-repository-meta',
})
