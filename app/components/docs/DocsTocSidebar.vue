<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface TocSection {
  id: string
  label: string
}

const props = defineProps<{
  sections: readonly TocSection[]
}>()

const activeSection = ref(props.sections[0]?.id ?? '')
const tocNav = ref<HTMLElement | null>(null)
const scrollContainer = ref<HTMLElement | null>(null)
const indicatorOffset = ref(0)
const INDICATOR_HEIGHT = 24

const observerStops: Array<() => void> = []
const isProgrammaticNav = ref(false)
const programmaticTarget = ref<string | null>(null)
const lockActiveSectionId = ref<string | null>(null)
const stableHitCount = ref(0)
const programmaticTargetTop = ref<number | null>(null)
const programmaticStartedAt = ref(0)
const PROGRAMMATIC_STABLE_TOLERANCE = 2
const PROGRAMMATIC_STABLE_FRAMES = 3
const PROGRAMMATIC_MAX_DURATION_MS = 2200
const POST_CLICK_HOLD_MS = 260
let scrollRaf: number | null = null
let settleRaf: number | null = null
const stickySectionId = ref<string | null>(null)
const stickyUntilTs = ref(0)

function getScrollTop() {
  if (scrollContainer.value)
    return scrollContainer.value.scrollTop
  return window.scrollY || document.documentElement.scrollTop || 0
}

const navIndicatorStyle = computed(() => ({
  transform: `translateY(${Math.round(indicatorOffset.value)}px)`,
  height: `${INDICATOR_HEIGHT}px`,
}))

function updateIndicatorPosition() {
  if (!tocNav.value || !activeSection.value)
    return

  const activeLink = tocNav.value.querySelector<HTMLElement>(`[data-toc-id="${activeSection.value}"]`)
  if (!activeLink)
    return

  const item = activeLink.closest<HTMLElement>('[data-toc-item]')
  const itemHeight = item?.offsetHeight ?? activeLink.offsetHeight
  const itemTop = item?.offsetTop ?? activeLink.offsetTop
  indicatorOffset.value = itemTop + Math.max(0, (itemHeight - INDICATOR_HEIGHT) / 2)
}

function updateActiveFromScrollGeometry() {
  if (!props.sections.length)
    return

  if (stickySectionId.value && performance.now() < stickyUntilTs.value) {
    activeSection.value = stickySectionId.value
    return
  }

  if (stickySectionId.value && performance.now() >= stickyUntilTs.value)
    stickySectionId.value = null

  if (lockActiveSectionId.value) {
    activeSection.value = lockActiveSectionId.value
    return
  }

  if (isProgrammaticNav.value && programmaticTarget.value) {
    activeSection.value = programmaticTarget.value
    return
  }

  const container = scrollContainer.value
  const anchorOffset = 148

  let currentId = props.sections[0].id
  if (!container) {
    const doc = document.documentElement
    const isNearBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 2
    if (isNearBottom) {
      activeSection.value = props.sections.at(-1)?.id ?? currentId
      return
    }

    const anchor = window.scrollY + anchorOffset
    for (const section of props.sections) {
      const el = document.getElementById(section.id)
      if (!el)
        continue
      if (el.offsetTop <= anchor)
        currentId = section.id
      else
        break
    }
    activeSection.value = currentId
    return
  }

  const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 2
  if (isNearBottom) {
    activeSection.value = props.sections.at(-1)?.id ?? currentId
    return
  }

  const containerRect = container.getBoundingClientRect()
  const anchor = containerRect.top + anchorOffset
  for (const section of props.sections) {
    const el = document.getElementById(section.id)
    if (!el)
      continue

    if (el.getBoundingClientRect().top <= anchor)
      currentId = section.id
    else
      break
  }
  activeSection.value = currentId
}

function scheduleSync() {
  if (scrollRaf !== null)
    return

  scrollRaf = window.requestAnimationFrame(() => {
    scrollRaf = null
    updateActiveFromScrollGeometry()
    updateIndicatorPosition()
  })
}

function scrollToSection(id: string) {
  const section = document.getElementById(id)
  if (!section)
    return

  let targetTop: number | null = null
  if (scrollContainer.value) {
    const containerRect = scrollContainer.value.getBoundingClientRect()
    const sectionRect = section.getBoundingClientRect()
    const topOffset = 148
    targetTop = scrollContainer.value.scrollTop + (sectionRect.top - containerRect.top) - topOffset
    const clampedTop = Math.max(targetTop, 0)
    programmaticTargetTop.value = clampedTop
    scrollContainer.value.scrollTo({
      top: clampedTop,
      behavior: 'smooth',
    })
  }
  else {
    const topOffset = 148
    targetTop = section.getBoundingClientRect().top + window.scrollY - topOffset
    programmaticTargetTop.value = Math.max(targetTop, 0)
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function clearProgrammaticMode(sync = true) {
  if (programmaticTarget.value) {
    stickySectionId.value = programmaticTarget.value
    stickyUntilTs.value = performance.now() + POST_CLICK_HOLD_MS
  }
  isProgrammaticNav.value = false
  programmaticTarget.value = null
  lockActiveSectionId.value = null
  programmaticTargetTop.value = null
  stableHitCount.value = 0
  if (settleRaf !== null) {
    window.cancelAnimationFrame(settleRaf)
    settleRaf = null
  }
  if (sync)
    scheduleSync()
}

function watchProgrammaticSettling() {
  if (!isProgrammaticNav.value)
    return

  const now = performance.now()
  const elapsed = now - programmaticStartedAt.value
  const target = programmaticTargetTop.value

  if (target === null) {
    clearProgrammaticMode()
    return
  }

  const distance = Math.abs(getScrollTop() - target)
  if (distance <= PROGRAMMATIC_STABLE_TOLERANCE)
    stableHitCount.value += 1
  else
    stableHitCount.value = 0

  if (stableHitCount.value >= PROGRAMMATIC_STABLE_FRAMES || elapsed >= PROGRAMMATIC_MAX_DURATION_MS) {
    clearProgrammaticMode()
    return
  }

  settleRaf = window.requestAnimationFrame(watchProgrammaticSettling)
}

function handleTocClick(event: MouseEvent, id: string) {
  event.preventDefault()
  stickySectionId.value = id
  stickyUntilTs.value = performance.now() + POST_CLICK_HOLD_MS
  clearProgrammaticMode(false)
  programmaticTarget.value = id
  lockActiveSectionId.value = id
  isProgrammaticNav.value = true
  stableHitCount.value = 0
  programmaticStartedAt.value = performance.now()
  activeSection.value = id
  scrollToSection(id)
  nextTick(updateIndicatorPosition)
  settleRaf = window.requestAnimationFrame(watchProgrammaticSettling)

  if (window.location.hash !== `#${id}`)
    window.history.replaceState(null, '', `#${id}`)
}

onMounted(() => {
  scrollContainer.value = document.querySelector('[data-app-scroll-container]') as HTMLElement | null

  const hash = window.location.hash.replace('#', '')
  if (hash && props.sections.some(section => section.id === hash))
    activeSection.value = hash

  const targets = props.sections
    .map(section => document.getElementById(section.id))
    .filter((el): el is HTMLElement => el !== null)

  if (targets.length) {
    const observer = new IntersectionObserver(
      () => {
        if (isProgrammaticNav.value)
          return
        scheduleSync()
      },
      {
        root: scrollContainer.value,
        rootMargin: '-18% 0px -56% 0px',
        threshold: [0, 0.15, 0.35, 0.6, 0.85, 1],
      },
    )

    for (const target of targets)
      observer.observe(target)

    observerStops.push(() => observer.disconnect())
  }

  scheduleSync()
  useEventListener(scrollContainer.value ?? window, 'scroll', () => {
    if (!isProgrammaticNav.value)
      scheduleSync()
  }, { passive: true })

  // If user manually interrupts smooth scroll, release lock immediately.
  useEventListener(scrollContainer.value ?? window, 'wheel', () => {
    if (isProgrammaticNav.value)
      clearProgrammaticMode()
  }, { passive: true })
  useEventListener(scrollContainer.value ?? window, 'touchmove', () => {
    if (isProgrammaticNav.value)
      clearProgrammaticMode()
  }, { passive: true })
  useEventListener(scrollContainer.value ?? window, 'pointerdown', () => {
    if (isProgrammaticNav.value)
      clearProgrammaticMode(false)
  }, { passive: true })
  useEventListener(window, 'resize', scheduleSync, { passive: true })
})

watch(activeSection, () => {
  nextTick(updateIndicatorPosition)
}, { flush: 'post' })

onBeforeUnmount(() => {
  clearProgrammaticMode(false)
  if (scrollRaf !== null)
    window.cancelAnimationFrame(scrollRaf)
  for (const stop of observerStops)
    stop()
  observerStops.length = 0
})
</script>

<template>
  <aside class="docs-sidebar fixed bottom-0 left-0 top-0 z-40 hidden w-72 px-8 py-10 lg:flex lg:flex-col">
    <div class="flex flex-1 flex-col justify-start pt-[calc(3rem+var(--hero-top-offset))]">
      <div class="group mb-7 flex items-center gap-2 -ml-2">
        <Icon name="ph:book-open-text" class="size-5 color-sand-8 group-hover:hidden" />
        <Icon name="ph:book-open-text-fill" class="hidden size-5 color-sand-8 group-hover:block" />
        <p class="font-geist-mono-500 text-[11px] color-sand-8 leading-none tracking-[0.22em] uppercase">
          Documentation
        </p>
      </div>

      <nav ref="tocNav" class="docs-toc-track relative flex flex-col gap-6">
        <div class="nav-indicator" :style="navIndicatorStyle" />
        <div
          v-for="item in sections"
          :key="item.id"
          data-toc-item
          class="pl-5 text-sm transition-colors ease-out"
          :class="activeSection === item.id ? 'color-pureWhite' : 'color-sand-10 hover:color-[#10b981]'"
        >
          <a
            :href="`#${item.id}`"
            :data-toc-id="item.id"
            class="font-geist font-light transition-colors"
            @click="handleTocClick($event, item.id)"
          >
            {{ item.label }}
          </a>
        </div>
      </nav>
    </div>

    <div class="mt-auto">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs color-sand-10 transition-all duration-200 hover:color-pureWhite/82 hover:bg-pureWhite/6"
      >
        <Icon name="ph:arrow-left" class="h-3 w-3" />
        Back to Home
      </NuxtLink>
    </div>
  </aside>
</template>

<style scoped>
.docs-sidebar {
  background: linear-gradient(to bottom, rgba(3, 5, 7, 0.8), rgba(3, 5, 7, 0.4));
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-indicator {
  position: absolute;
  left: 0;
  width: 2px;
  height: 24px;
  background: #10b981;
  box-shadow:
    0 0 8px rgba(16, 185, 129, 0.9),
    0 0 16px rgba(16, 185, 129, 0.35);
  will-change: transform;
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.docs-toc-track {
  padding-left: 1px;
}

.docs-toc-track::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(148, 163, 184, 0.22);
  box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.05);
}
</style>
