<script setup lang="ts">
/**
 * Gotham-style headline: SVG path stroke-draw animation (Palantir Gotham).
 * When pathLine1/pathLine2 are provided, animates stroke-dashoffset from path length to 0.
 * Fallback: clip-path reveal on HTML text when no path data.
 */
import type { HTMLAttributes } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import { Motion } from 'motion-v'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

interface HeroHeadlineDrawProps {
  line1: string
  line2: string
  /** SVG path d for line 1 (from font-to-SVG converter). If set, uses stroke-draw. */
  pathLine1?: string
  /** SVG path d for line 2. If set with pathLine1, uses stroke-draw. */
  pathLine2?: string
  /** ViewBox for line 1 when using paths (e.g. "0 0 332 74"). When set with viewBox2, each line gets its own SVG. */
  viewBox1?: string
  /** ViewBox for line 2 (e.g. "0 0 710 74"). */
  viewBox2?: string
  /** Legacy: single viewBox for both paths when viewBox1/viewBox2 not set. */
  viewBox?: string
  duration?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<HeroHeadlineDrawProps>(), {
  duration: 1600,
  viewBox: '0 0 400 120',
})

const path1Ref = ref<SVGPathElement | null>(null)
const path2Ref = ref<SVGPathElement | null>(null)
const length1 = ref(0)
const length2 = ref(0)
const usePathMode = computed(() => Boolean(props.pathLine1 && props.pathLine2))
const prefersReducedMotion = usePreferredReducedMotion()
const noMotion = computed(() => prefersReducedMotion.value === 'reduce')

function measurePaths() {
  nextTick(() => {
    if (path1Ref.value) length1.value = path1Ref.value.getTotalLength()
    if (path2Ref.value) length2.value = path2Ref.value.getTotalLength()
  })
}

onMounted(measurePaths)
watch(() => [props.pathLine1, props.pathLine2], measurePaths)
</script>

<template>
  <h1
    :class="[
      'font-geist-800 w-fit max-w-full text-[clamp(2.35rem,14vw,6.2rem)] text-white leading-[0.92] tracking-[-0.024em] sm:text-[clamp(2.9rem,9vw,6.2rem)] sm:leading-[0.9]',
      props.class,
    ]"
    :aria-label="`${line1} ${line2}`"
  >
    <!-- Path mode: two SVGs (each line keeps its viewBox aspect ratio) -->
    <template v-if="usePathMode && pathLine1 && pathLine2 && viewBox1 && viewBox2">
      <svg
        :viewBox="viewBox1"
        class="hero-headline-svg block h-auto w-full max-w-full text-white"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          ref="path1Ref"
          :d="pathLine1"
          :stroke-dasharray="length1 || 99999"
          :stroke-dashoffset="noMotion ? 0 : (length1 || 99999)"
          class="hero-headline-path hero-headline-path-1"
        />
      </svg>
      <svg
        :viewBox="viewBox2"
        class="hero-headline-svg block h-auto w-full max-w-full text-white"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          ref="path2Ref"
          :d="pathLine2"
          :stroke-dasharray="length2 || 99999"
          :stroke-dashoffset="noMotion ? 0 : (length2 || 99999)"
          class="hero-headline-path hero-headline-path-2"
        />
      </svg>
    </template>
    <!-- Path mode: single SVG (legacy single viewBox) -->
    <svg
      v-else-if="usePathMode && pathLine1 && pathLine2"
      :viewBox="viewBox"
      class="hero-headline-svg block h-auto w-full max-w-full text-white"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path
        ref="path1Ref"
        :d="pathLine1"
        :stroke-dasharray="length1 || 99999"
        :stroke-dashoffset="noMotion ? 0 : (length1 || 99999)"
        class="hero-headline-path hero-headline-path-1"
      />
      <path
        ref="path2Ref"
        :d="pathLine2"
        :stroke-dasharray="length2 || 99999"
        :stroke-dashoffset="noMotion ? 0 : (length2 || 99999)"
        class="hero-headline-path hero-headline-path-2"
      />
    </svg>

    <!-- Fallback: HTML text with clip-path reveal -->
    <template v-else>
      <span class="block whitespace-normal sm:whitespace-nowrap">
        <Motion.span
          as="span"
          class="block overflow-hidden"
          :initial="noMotion ? {} : { clipPath: 'inset(0 100% 0 0)' }"
          :animate="{ clipPath: 'inset(0 0 0 0)' }"
          :transition="{ duration: duration / 1000, ease: 'easeOut' }"
        >
          {{ line1 }}
        </Motion.span>
      </span>
      <span class="block whitespace-normal sm:whitespace-nowrap">
        <Motion.span
          as="span"
          class="block overflow-hidden"
          :initial="noMotion ? {} : { clipPath: 'inset(0 100% 0 0)' }"
          :animate="{ clipPath: 'inset(0 0 0 0)' }"
          :transition="{ duration: duration / 1000, delay: duration / 2000, ease: 'easeOut' }"
        >
          {{ line2 }}
        </Motion.span>
      </span>
    </template>
  </h1>
</template>

<style scoped>
.hero-headline-path {
  animation-duration: calc(v-bind(duration) * 1ms);
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}
.hero-headline-path-1 {
  animation-name: hero-draw-1;
}
.hero-headline-path-2 {
  animation-name: hero-draw-2;
  animation-delay: calc(v-bind(duration) * 0.5ms);
}
@media (prefers-reduced-motion: reduce) {
  .hero-headline-path-1,
  .hero-headline-path-2 {
    animation: none;
    stroke-dashoffset: 0;
  }
}
@keyframes hero-draw-1 {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes hero-draw-2 {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
