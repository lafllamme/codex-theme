const FOUR_HOURS_IN_SECONDS = 60 * 60 * 4

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const repoName = String(config.public.githubRepoName ?? '').trim()

  /** Keeps browser/CDN cache aligned with Nitro cache TTL. */
  setHeader(event, 'Cache-Control', `public, max-age=${FOUR_HOURS_IN_SECONDS}, s-maxage=${FOUR_HOURS_IN_SECONDS}`)

  if (!repoName) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_PUBLIC_GITHUB_REPO_NAME is missing',
    })
  }

  const repository = await $fetch<{ updated_at?: string }>(`https://api.github.com/repos/${repoName}`, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  return {
    updatedAt: repository.updated_at ?? null,
  }
}, {
  /** Cache this endpoint for 4h. */
  maxAge: FOUR_HOURS_IN_SECONDS,
  name: 'github-repository-meta',
})
