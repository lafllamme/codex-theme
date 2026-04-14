<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import AutomationsSectionBlock from '~/components/workbench/automations/AutomationsSectionBlock.vue'
import AutomationsToc from '~/components/workbench/automations/AutomationsToc.vue'
import { automationSections, cardsForSection } from '~/data/workbench-automations-catalog'

const scrollEl = ref<HTMLElement | null>(null)
const activeSectionId = ref(automationSections[0]?.id ?? '')

function scrollToSection(id: string) {
  const el = document.getElementById(`automation-section-${id}`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Near bottom of scroller: pin TOC to last section (short tail never crosses the reading line). */
const BOTTOM_SLACK_PX = 48
/** Reading line as fraction of viewport height from top of scrollport (0–1). */
const READING_LINE_RATIO = 0.45

function sectionTopInScroller(el: HTMLElement, scroller: HTMLElement): number {
  return el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
}

function computeActiveSection() {
  const root = scrollEl.value
  if (!root)
    return

  const { scrollTop, clientHeight, scrollHeight } = root
  const last = automationSections.at(-1)
  if (
    last
    && scrollHeight > clientHeight
    && scrollTop + clientHeight >= scrollHeight - BOTTOM_SLACK_PX
  ) {
    activeSectionId.value = last.id
    return
  }

  const line = scrollTop + clientHeight * READING_LINE_RATIO
  let best = automationSections[0]?.id ?? ''
  for (const s of automationSections) {
    const el = root.querySelector(`#automation-section-${CSS.escape(s.id)}`) as HTMLElement | null
    if (!el)
      continue
    const top = sectionTopInScroller(el, root)
    if (top <= line)
      best = s.id
  }
  activeSectionId.value = best
}

useScroll(scrollEl, {
  throttle: 64,
  onScroll: computeActiveSection,
})

onMounted(() => {
  nextTick(() => computeActiveSection())
})
</script>

<template>
  <div class="h-full min-h-0 w-full flex flex-1 flex-col px-4 pb-6 pt-2 md:px-8">
    <header class="mb-6 shrink-0 text-center">
      <h1 class="m-0 mb-2 text-[clamp(22px,3vw,30px)] text-[color:var(--wb-text-primary)] font-semibold leading-tight tracking-[-0.02em]">
        Automations
      </h1>
      <p class="m-0 mx-auto max-w-[560px] text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-muted)] leading-relaxed">
        Automate work by setting up scheduled threads.
        <button
          type="button"
          class="border-none bg-transparent p-0 text-[color:var(--theme-accent)] underline underline-offset-2 transition-opacity hover:opacity-90"
        >
          Learn more
        </button>
      </p>
    </header>

    <div class="min-h-0 flex flex-1 flex-col gap-6 min-[700px]:flex-row min-[700px]:gap-8">
      <div class="shrink-0 min-[700px]:pt-1">
        <AutomationsToc
          :sections="automationSections"
          :active-id="activeSectionId"
          @select="scrollToSection"
        />
      </div>

      <div
        ref="scrollEl"
        class="[-webkit-overflow-scrolling:touch] min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto"
      >
        <AutomationsSectionBlock
          v-for="section in automationSections"
          :key="section.id"
          :section="section"
          :cards="cardsForSection(section.id)"
        />
      </div>
    </div>
  </div>
</template>
