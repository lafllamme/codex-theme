<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { Motion } from 'motion-v'
import { computed, onMounted, ref, watch } from 'vue'

interface HyperTextProps {
  class?: HTMLAttributes['class']
  text: string
  duration?: number
  animateOnLoad?: boolean
}

const props = withDefaults(defineProps<HyperTextProps>(), {
  duration: 800,
  animateOnLoad: true,
})

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const displayText = ref(props.text.split(''))
const iterations = ref(0)

const perTick = computed(() => {
  const safeLength = Math.max(props.text.length, 1)
  return props.duration / (safeLength * 10)
})

function getRandomLetter() {
  return alphabets[Math.floor(Math.random() * alphabets.length)]
}

const { pause, resume } = useIntervalFn(
  () => {
    if (iterations.value < props.text.length) {
      displayText.value = displayText.value.map((letter, i) =>
        letter === ' ' ? letter : i <= iterations.value ? (props.text[i] ?? letter) : getRandomLetter(),
      )
      iterations.value += 0.1
      return
    }

    pause()
  },
  perTick,
  { immediate: false },
)

function triggerAnimation() {
  displayText.value = props.text.split('')
  pause()
  iterations.value = 0
  resume()
}

watch(
  () => props.text,
  (newText) => {
    displayText.value = newText.split('')
    triggerAnimation()
  },
)

onMounted(() => {
  if (props.animateOnLoad)
    triggerAnimation()
})
</script>

<template>
  <span
    :class="`relative inline-block whitespace-pre-wrap ${props.class ?? ''}`"
    @mouseenter="triggerAnimation"
  >
    <span class="invisible whitespace-pre-wrap">{{ props.text }}</span>
    <span class="pointer-events-none absolute inset-0 whitespace-pre-wrap">
      <Motion
        v-for="(letter, i) in displayText"
        :key="i"
        as="span"
        :initial="{ opacity: 0, y: -10 }"
        :animate="{ opacity: 1, y: 0 }"
        :delay="i * ((props.duration ?? 800) / (Math.max(props.text.length, 1) * 10))"
        class="inline-block"
      >
        {{ letter === ' ' ? '\u00A0' : letter }}
      </Motion>
    </span>
  </span>
</template>
