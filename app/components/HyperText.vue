<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { Motion } from 'motion-v'
import { computed, onMounted, ref, watch } from 'vue'

interface HyperTextProps {
  class?: HTMLAttributes['class']
  text: string
  duration?: number
  hoverDuration?: number
  animateOnLoad?: boolean
  hoverable?: boolean
  triggerKey?: number
}

const props = withDefaults(defineProps<HyperTextProps>(), {
  duration: 1900,
  hoverDuration: 1400,
  animateOnLoad: true,
  hoverable: true,
  triggerKey: 0,
})

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const displayText = ref(props.text.split(''))
const iterations = ref(0)
const activeMode = ref<'load' | 'hover'>('load')
const revealStep = 0.04

const activeDuration = computed(() =>
  activeMode.value === 'hover' ? props.hoverDuration : props.duration,
)
const perTick = computed(() => {
  const safeLength = Math.max(props.text.length, 1)
  return activeDuration.value / (safeLength * (1 / revealStep))
})

function getRandomLetter() {
  return alphabets[Math.floor(Math.random() * alphabets.length)]
}

function easeInOutCubic(x: number) {
  if (x < 0.5)
    return 4 * x * x * x
  return 1 - ((-2 * x + 2) ** 3) / 2
}

const { pause, resume } = useIntervalFn(
  () => {
    const textLength = Math.max(props.text.length, 1)
    const easedRevealIndex = easeInOutCubic(Math.min(iterations.value / textLength, 1)) * textLength

    if (iterations.value < textLength) {
      displayText.value = displayText.value.map((letter, i) =>
        letter === ' ' ? letter : i <= easedRevealIndex ? (props.text[i] ?? letter) : getRandomLetter(),
      )
      iterations.value += revealStep
      return
    }

    pause()
  },
  perTick,
  { immediate: false },
)

function triggerAnimation(mode: 'load' | 'hover' = 'hover') {
  activeMode.value = mode
  displayText.value = props.text.split('')
  pause()
  iterations.value = 0
  resume()
}

watch(
  () => props.text,
  (newText) => {
    displayText.value = newText.split('')
    triggerAnimation('load')
  },
)

watch(
  () => props.triggerKey,
  () => {
    triggerAnimation('load')
  },
)

onMounted(() => {
  if (props.animateOnLoad)
    triggerAnimation('load')
})
</script>

<template>
  <span
    :class="`pointer-events-auto relative inline-block whitespace-pre ${props.class ?? ''}`"
    @mouseenter="() => props.hoverable && triggerAnimation('hover')"
  >
    <span class="invisible whitespace-pre">{{ props.text }}</span>
    <span class="pointer-events-none absolute inset-0 whitespace-pre">
      <template v-for="(letter, i) in displayText" :key="`char-${i}`">
        <br v-if="letter === '\n'" :key="`break-${i}`">
        <Motion
          v-else
          as="span"
          :initial="{ opacity: 0, y: -5 }"
          :animate="{ opacity: 1, y: 0 }"
          :delay="i * (activeDuration / (Math.max(props.text.length, 1) * 10))"
          class="inline-block"
        >
          {{ letter === ' ' ? '\u00A0' : letter }}
        </Motion>
      </template>
    </span>
  </span>
</template>
