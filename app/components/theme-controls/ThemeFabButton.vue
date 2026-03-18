<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { Motion } from 'motion-v'

defineProps<{
  visuallyHidden: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const fabRef = ref<HTMLButtonElement | null>(null)
const prefersReducedMotion = usePreferredReducedMotion()
const idleAnimate = computed(() =>
  prefersReducedMotion.value === 'reduce'
    ? {}
    : {
        boxShadow: [
          '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(255,255,255,0.08)',
          '0 12px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.18)',
          '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(255,255,255,0.08)',
        ],
      },
)

defineExpose({ fabRef })
</script>

<template>
  <div
    class="theme-fab-anchor pointer-events-none fixed z-50"
    :class="visuallyHidden ? '[&_.theme-fab-hit]:pointer-events-none [&_.theme-fab-hit]:invisible [&_.theme-fab-hit]:opacity-0' : ''"
    style="bottom: max(5.5rem, env(safe-area-inset-bottom, 0px)); right: max(1rem, env(safe-area-inset-right, 0px));"
  >
    <Motion
      as="div"
      class="pointer-events-auto inline-block"
      :initial="false"
      :animate="idleAnimate"
      :transition="{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }"
    >
      <button
        id="theme-fab-trigger"
        ref="fabRef"
        type="button"
        class="theme-fab-hit border-white/14 bg-neutral-950 text-white/90 ring-white/5 hover:border-white/24 hover:bg-neutral-900 focus-visible:outline-white/35 min-h-14 flex items-center gap-3 border rounded-full px-6 py-3.5 text-lg font-semibold tracking-tight font-[var(--font-ui)] shadow-[0_8px_32px_rgba(0,0,0,0.55)] ring-1 transition-[transform,border-color,background-color] duration-200 md:min-h-16 active:scale-[0.98] md:gap-4 md:px-8 md:py-4 md:text-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline"
        aria-controls="theme-controls-panel"
        aria-expanded="false"
        @click="emit('click')"
      >
        <Icon name="ph:palette-bold" class="text-white/70 size-6 shrink-0 md:size-7" aria-hidden="true" />
        <span>Theme</span>
      </button>
    </Motion>
  </div>
</template>
