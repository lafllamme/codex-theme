<script setup lang="ts">
import type { BundledLanguage } from 'shiki'
import SyntaxBlock from '~/components/workbench/code/SyntaxBlock.vue'

const props = withDefaults(
  defineProps<{
    codeThemeId?: string
    collapsedLines?: number
    language?: BundledLanguage
    text: string
    title?: string
  }>(),
  {
    codeThemeId: 'everforest',
    collapsedLines: 6,
    language: 'shellscript',
    title: 'Code',
  },
)

const expanded = ref(false)
const totalLines = computed(() => props.text.split('\n').length)
const isExpandable = computed(() => totalLines.value > props.collapsedLines)
const collapsedHeight = computed(() => `calc(${props.collapsedLines} * 1.6em)`)
const copyState = ref<'idle' | 'ok'>('idle')
let copyTimer: ReturnType<typeof setTimeout> | null = null

function toggleExpanded() {
  if (!isExpandable.value)
    return
  expanded.value = !expanded.value
}

async function copyCode() {
  if (!props.text)
    return

  try {
    await navigator.clipboard.writeText(props.text)
    copyState.value = 'ok'
    if (copyTimer)
      clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copyState.value = 'idle'
      copyTimer = null
    }, 1200)
  }
  catch {
    // Ignore clipboard failures silently in docs context.
  }
}

onBeforeUnmount(() => {
  if (copyTimer)
    clearTimeout(copyTimer)
})
</script>

<template>
  <div
    class="group overflow-hidden border border-sand-5 rounded-xl border-solid shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
  >
    <div
      class="relative flex items-center gap-2 border-b border-sand-5 border-solid px-4 py-2.5 color-pureWhite bg-pureBlack"
    >
      <Icon name="ph:file-code" class="size-4" />
      <span class="font-geist-500 text-sm">{{ title }}</span>
      <button
        type="button"
        class="font-geist-mono-500 absolute right-3 top-1/2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] color-sand-10 opacity-0 transition-all duration-180 ease-out -translate-y-1/2 hover:bg-sand-11/12 hover:color-sand-4 group-hover:opacity-100"
        @click="copyCode"
      >
        <Icon
          :name="copyState === 'ok' ? 'ph:check' : 'ph:copy'"
          class="h-3.5 w-3.5"
        />
        <span>{{ copyState === "ok" ? "Copied" : "Copy" }}</span>
      </button>
    </div>

    <div class="relative bg-slate-1 px-4 py-3 text-xs leading-relaxed">
      <div
        class="overflow-hidden"
        :style="{
          maxHeight:
            expanded || !isExpandable ? 'none' : collapsedHeight,
        }"
      >
        <SyntaxBlock
          class="font-geist-mono-400"
          :text="text"
          :language="language"
          :code-theme-id="codeThemeId"
          fallback-color="rgba(228,230,236,0.94)"
        />
      </div>

      <div
        v-if="isExpandable && !expanded"
        class="pointer-events-none absolute inset-x-0 bottom-0 h-18 from-slate-1 via-slate-1/92 to-transparent bg-gradient-to-t"
      />

      <div v-if="isExpandable" class="absolute bottom-3 right-3">
        <button
          type="button"
          class="font-geist-500 border border-sand-6 rounded-full px-3 py-1.5 text-[11px] color-sand-11 transition-colors duration-180 bg-pureBlack/80 hover:border-sand-5 hover:color-pureWhite"
          @click="toggleExpanded"
        >
          {{ expanded ? "Show Less" : "See Full Code" }}
        </button>
      </div>
    </div>
  </div>
</template>
