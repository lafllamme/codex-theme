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

function toggleExpanded() {
  if (!isExpandable.value)
    return
  expanded.value = !expanded.value
}
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
