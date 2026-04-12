<script setup lang="ts">
/**
 * Shiny text — vue-bits motion math (motion-v), plus a **solid base layer** under the clipped gradient.
 * `background-clip: text` + transparent fill can show the panel behind (reads as black/diff bar);
 * the base copy keeps the sentence readable through those frames.
 * @see https://github.com/DavidHDev/vue-bits/blob/main/src/content/TextAnimations/ShinyText/ShinyText.vue
 */
import { usePreferredReducedMotion } from '@vueuse/core'
import { Motion, useAnimationFrame, useMotionValue, useTransform } from 'motion-v'
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    disabled?: boolean
    speed?: number
    delay?: number
    className?: string
    color?: string
    shineColor?: string
    spread?: number
    yoyo?: boolean
    pauseOnHover?: boolean
    direction?: 'left' | 'right'
    /** 0 = loop forever (app extension; vue-bits loops forever). */
    repeatCount?: number
  }>(),
  {
    disabled: false,
    speed: 2,
    delay: 0,
    className: '',
    color: 'var(--wb-text-muted)',
    shineColor: 'color-mix(in srgb, var(--wb-text-primary) 50%, #ffffff)',
    spread: 120,
    yoyo: false,
    pauseOnHover: false,
    direction: 'left',
    repeatCount: 0,
  },
)

const prefersReducedMotion = usePreferredReducedMotion()
const isPaused = ref(false)
const shineComplete = ref(false)

const progress = useMotionValue(0)
const elapsedRef = ref(0)
const lastTimeRef = ref<number | null>(null)
const directionRef = ref(props.direction === 'left' ? 1 : -1)

const animationDuration = computed(() => props.speed * 1000)
const delayDuration = computed(() => props.delay * 1000)

useAnimationFrame((time) => {
  if (shineComplete.value)
    return

  if (props.disabled || isPaused.value || prefersReducedMotion.value === 'reduce') {
    lastTimeRef.value = null
    return
  }

  if (lastTimeRef.value === null) {
    lastTimeRef.value = time
    return
  }

  const deltaTime = time - lastTimeRef.value
  lastTimeRef.value = time
  elapsedRef.value += deltaTime

  const cycleDuration = animationDuration.value + delayDuration.value
  if (props.repeatCount > 0 && elapsedRef.value >= props.repeatCount * cycleDuration) {
    shineComplete.value = true
    return
  }

  if (props.yoyo) {
    const cycleDur = animationDuration.value + delayDuration.value
    const fullCycle = cycleDur * 2
    const cycleTime = elapsedRef.value % fullCycle

    if (cycleTime < animationDuration.value) {
      const p = (cycleTime / animationDuration.value) * 100
      progress.set(directionRef.value === 1 ? p : 100 - p)
    }
    else if (cycleTime < cycleDur) {
      progress.set(directionRef.value === 1 ? 100 : 0)
    }
    else if (cycleTime < cycleDur + animationDuration.value) {
      const reverseTime = cycleTime - cycleDur
      const p = 100 - (reverseTime / animationDuration.value) * 100
      progress.set(directionRef.value === 1 ? p : 100 - p)
    }
    else {
      progress.set(directionRef.value === 1 ? 0 : 100)
    }
  }
  else {
    const cycleDur = animationDuration.value + delayDuration.value
    const cycleTime = elapsedRef.value % cycleDur

    if (cycleTime < animationDuration.value) {
      const p = (cycleTime / animationDuration.value) * 100
      progress.set(directionRef.value === 1 ? p : 100 - p)
    }
    else {
      progress.set(directionRef.value === 1 ? 100 : 0)
    }
  }
})

watch(
  () => props.direction,
  () => {
    directionRef.value = props.direction === 'left' ? 1 : -1
    elapsedRef.value = 0
    lastTimeRef.value = null
    progress.set(0)
    shineComplete.value = false
  },
  { immediate: true },
)

watch(
  () => props.text,
  () => {
    elapsedRef.value = 0
    lastTimeRef.value = null
    progress.set(0)
    shineComplete.value = false
  },
)

watch(
  () => props.repeatCount,
  () => {
    elapsedRef.value = 0
    lastTimeRef.value = null
    progress.set(0)
    shineComplete.value = false
  },
)

const backgroundPosition = useTransform(progress, p => `${150 - p * 2}% center`)

function handleMouseEnter() {
  if (props.pauseOnHover)
    isPaused.value = true
}

function handleMouseLeave() {
  if (props.pauseOnHover)
    isPaused.value = false
}

const gradientStyle = computed(() => ({
  backgroundImage: `linear-gradient(${props.spread}deg, ${props.color} 0%, ${props.color} 35%, ${props.shineColor} 50%, ${props.color} 65%, ${props.color} 100%)`,
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}))

const showMotion = computed(
  () =>
    prefersReducedMotion.value !== 'reduce'
    && !shineComplete.value,
)
</script>

<template>
  <span
    class="inline-block max-w-full min-w-0 align-baseline"
    :class="className"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <template v-if="showMotion">
      <span class="relative inline-block max-w-full min-w-0">
        <span
          class="relative z-0"
          :style="{ color }"
        >{{ text }}</span>
        <Motion
          as="span"
          aria-hidden="true"
          class="pointer-events-none absolute left-0 top-0 z-[1] inline-block max-w-full w-full select-none"
          :style="{ ...gradientStyle, backgroundPosition }"
        >{{ text }}</Motion>
      </span>
    </template>
    <span
      v-else
      :style="{ color }"
    >{{ text }}</span>
  </span>
</template>
