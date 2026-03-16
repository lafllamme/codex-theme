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
const tickMs = computed(() => {
  const safeLength = Math.max(props.text.length, 1)
  return props.duration / (safeLength * 10)
})

function getRandomLetter() {
  return alphabets[Math.floor(Math.random() * alphabets.length)]
}

const { pause, resume } = useIntervalFn(
  () => {
    if (iterations.value < props.text.length) {
      displayText.value = displayText.value.map((letter, i) => {
        const sourceChar = props.text[i]
        if (sourceChar === ' ' || sourceChar === '\n')
          return sourceChar
        return i <= iterations.value ? (sourceChar ?? letter) : getRandomLetter()
      })
      iterations.value += 0.1
      return
    }
    pause()
  },
  tickMs,
  { immediate: false },
)

function triggerAnimation() {
  iterations.value = 0
  startAnimation()
}

function startAnimation() {
  pause()
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
    :class="`pointer-events-auto inline-block cursor-default overflow-hidden py-2 ${props.class ?? ''}`"
    @mouseenter="triggerAnimation"
  >
    <span class="inline-block whitespace-pre">
      <template v-for="(letter, i) in displayText" :key="i">
        <br v-if="letter === '\n'">
        <Motion
          v-else
          as="span"
          :initial="{ opacity: 0, y: -10 }"
          :animate="{ opacity: 1, y: 0 }"
          :delay="i * (props.duration / (Math.max(props.text.length, 1) * 10))"
          class="inline-block"
        >
          {{ letter === ' ' ? '\u00A0' : letter.toUpperCase() }}
        </Motion>
      </template>
    </span>
  </span>
</template>
