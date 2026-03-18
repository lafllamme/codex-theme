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
          '0 4px 30px rgba(0,0,0,0.1)',
          '0 6px 36px rgba(0,0,0,0.14)',
          '0 4px 30px rgba(0,0,0,0.1)',
        ],
      },
)

defineExpose({ fabRef })
</script>

<template>
  <div
    class="theme-fab-anchor pointer-events-none fixed z-50"
    :class="visuallyHidden ? '[&_.theme-fab-hit]:pointer-events-none [&_.theme-fab-hit]:invisible [&_.theme-fab-hit]:opacity-0' : ''"
    style="bottom: max(11rem, env(safe-area-inset-bottom, 0px)); right: max(1rem, env(safe-area-inset-right, 0px));"
  >
    <Motion
      as="div"
      class="pointer-events-auto inline-block rounded-[999px]"
      :initial="false"
      :animate="idleAnimate"
      :transition="{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }"
    >
      <button
        id="theme-fab-trigger"
        ref="fabRef"
        type="button"
        class="theme-fab-hit font-geist-500 focus-visible:outline-white/40 flex items-center gap-2 border border-[rgba(255,255,255,0.14)] rounded-[999px] bg-[rgba(255,255,255,0.04)] px-6 py-2.5 text-[13px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px] transition-all text-pureWhite/74 active:scale-[0.98] sm:gap-2.5 hover:bg-[rgba(255,255,255,0.08)] sm:px-7 sm:py-3 sm:text-[14px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline hover:text-pureWhite/88"
        aria-controls="theme-controls-panel"
        aria-expanded="false"
        @click="emit('click')"
      >
        <Icon name="ph:palette-bold" class="size-[18px] shrink-0 text-pureWhite/74" aria-hidden="true" />
        <span>Theme</span>
      </button>
    </Motion>
  </div>
</template>
