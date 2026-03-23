<script setup lang="ts">
import type { BundledLanguage } from 'shiki'
import { createJavaScriptRegexEngine, getSingletonHighlighter } from 'shiki'
import { resolveShikiThemeBinding } from '~/utils/code-theme-shiki'
import { inferSyntaxLanguageForLine } from '~/utils/syntax-language'

interface TokenRun {
  color: string
  text: string
}

const props = withDefaults(defineProps<{
  codeThemeId: string
  fallbackColor?: string
  filePath?: string
  text: string
}>(), {
  fallbackColor: 'var(--syntax-default)',
  filePath: '',
})

const EMPTY_RUNS: TokenRun[] = []
const tokenCache = new Map<string, TokenRun[]>()
const runs = ref<TokenRun[]>(EMPTY_RUNS)
const language = computed<BundledLanguage>(() => inferSyntaxLanguageForLine(props.filePath, props.text))
const shikiBinding = computed(() => resolveShikiThemeBinding(props.codeThemeId))
let requestId = 0
let highlighterPromise: ReturnType<typeof getSingletonHighlighter> | null = null

function fallbackRuns(text: string): TokenRun[] {
  if (!text)
    return EMPTY_RUNS
  return [{ color: props.fallbackColor, text }]
}

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = getSingletonHighlighter({
      engine: createJavaScriptRegexEngine(),
    })
  }
  return highlighterPromise
}

async function renderTokens() {
  if (!props.text) {
    runs.value = EMPTY_RUNS
    return
  }

  if (!import.meta.client) {
    runs.value = fallbackRuns(props.text)
    return
  }

  const cacheKey = `${shikiBinding.value.themeName}|${language.value}|${props.text}`
  const cached = tokenCache.get(cacheKey)
  if (cached) {
    runs.value = cached
    return
  }

  const currentRequestId = ++requestId

  try {
    const highlighter = await getHighlighter()
    await highlighter.loadTheme(shikiBinding.value.theme)
    await highlighter.loadLanguage(language.value)

    const tokenLines = highlighter.codeToTokensBase(props.text, {
      lang: language.value,
      theme: shikiBinding.value.themeName,
    })

    if (currentRequestId !== requestId)
      return

    const nextRuns = (tokenLines[0] ?? [])
      .filter(token => token.content.length > 0)
      .map(token => ({
        color: token.color ?? props.fallbackColor,
        text: token.content,
      }))

    const finalRuns = nextRuns.length > 0 ? nextRuns : fallbackRuns(props.text)
    tokenCache.set(cacheKey, finalRuns)
    runs.value = finalRuns
  }
  catch (error) {
    if (currentRequestId !== requestId)
      return
    if (import.meta.dev) {
      console.warn('[SyntaxLine] Shiki fallback', {
        codeThemeId: props.codeThemeId,
        filePath: props.filePath,
        language: language.value,
        shikiTheme: shikiBinding.value.themeName,
        shikiMode: shikiBinding.value.mode,
        error,
      })
    }
    runs.value = fallbackRuns(props.text)
  }
}

watch(
  [() => props.text, () => props.filePath, () => props.codeThemeId],
  () => {
    void renderTokens()
  },
  { immediate: true },
)
</script>

<template>
  <span>
    <template v-if="runs.length">
      <span
        v-for="(run, index) in runs"
        :key="`${index}-${run.text}`"
        :style="{ color: run.color }"
      >
        {{ run.text }}
      </span>
    </template>
    <template v-else>
      <span :style="{ color: fallbackColor }">{{ text }}</span>
    </template>
  </span>
</template>
