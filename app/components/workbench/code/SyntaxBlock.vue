<script setup lang="ts">
import type { BundledLanguage, ThemedToken } from 'shiki'
import { createJavaScriptRegexEngine, getSingletonHighlighter } from 'shiki'
import { resolveShikiThemeBinding } from '~/utils/code-theme-shiki'

const props = withDefaults(defineProps<{
  codeThemeId: string
  fallbackColor?: string
  language?: BundledLanguage
  text: string
}>(), {
  fallbackColor: 'var(--syntax-default)',
  language: 'json',
})

const html = ref('')
const tokenLines = ref<ThemedToken[][]>([])
const binding = computed(() => resolveShikiThemeBinding(props.codeThemeId))
let requestId = 0
let highlighterPromise: ReturnType<typeof getSingletonHighlighter> | null = null

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
    html.value = ''
    tokenLines.value = []
    return
  }

  if (!import.meta.client) {
    html.value = ''
    tokenLines.value = []
    return
  }

  const currentRequestId = ++requestId

  try {
    const highlighter = await getHighlighter()
    await highlighter.loadTheme(binding.value.theme)
    await highlighter.loadLanguage(props.language)

    const lines = highlighter.codeToTokensBase(props.text, {
      lang: props.language,
      theme: binding.value.themeName,
    })
    const rendered = highlighter.codeToHtml(props.text, {
      lang: props.language,
      theme: binding.value.themeName,
    })

    if (currentRequestId !== requestId)
      return

    html.value = rendered
    tokenLines.value = lines
  }
  catch (error) {
    if (currentRequestId !== requestId)
      return
    html.value = ''
    tokenLines.value = []
    if (import.meta.dev) {
      console.warn('[SyntaxBlock] Shiki fallback', {
        codeThemeId: props.codeThemeId,
        language: props.language,
        shikiTheme: binding.value.themeName,
        error,
      })
    }
  }
}

watch(
  [() => props.text, () => props.codeThemeId, () => props.language],
  () => {
    void renderTokens()
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="html" class="syntax-block" v-html="html" />
  <pre v-else class="m-0 whitespace-pre" :style="{ color: fallbackColor }">{{ text }}</pre>
</template>

<style scoped>
.syntax-block :deep(pre.shiki) {
  margin: 0 !important;
  background: transparent !important;
  white-space: pre !important;
  line-height: inherit;
  font-size: inherit;
  font-family: inherit;
}

.syntax-block :deep(code) {
  font-family: inherit;
  font-size: inherit;
}
</style>
