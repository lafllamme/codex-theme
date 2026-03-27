<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { Motion } from 'motion-v'

interface NativeTypewriterProps {
  content: string | string[]
  speed?: 'slow' | 'medium' | 'fast' | number
  cursor?: boolean
  loop?: boolean
  startDelay?: number
  morph?: boolean
  className?: string
}

const props = withDefaults(defineProps<NativeTypewriterProps>(), {
  speed: 'medium',
  cursor: true,
  loop: false,
  startDelay: 0,
  morph: true,
  className: '',
})

const shouldReduceMotion = usePreferredReducedMotion()
const displayedText = ref('')

const speedMap = {
  slow: 100,
  medium: 50,
  fast: 30,
} as const

const typingSpeed = computed(() => {
  return typeof props.speed === 'number' ? props.speed : speedMap[props.speed]
})

const textArray = computed(() => {
  return Array.isArray(props.content) ? props.content : [props.content]
})

watch(
  [textArray, typingSpeed, () => props.loop, () => props.startDelay, shouldReduceMotion],
  (_, __, onCleanup) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let initialTimer: ReturnType<typeof setTimeout> | undefined

    if (shouldReduceMotion.value === 'reduce') {
      displayedText.value = textArray.value.join(' ')
      onCleanup(() => {
        if (timeoutId) clearTimeout(timeoutId)
        if (initialTimer) clearTimeout(initialTimer)
      })
      return
    }

    let currentIndex = 0
    let currentStringIndex = 0
    let isDeleting = false

    const runLoop = () => {
      const currentString = textArray.value[currentStringIndex] || ''

      if (isDeleting) {
        displayedText.value = currentString.substring(0, currentIndex)
        currentIndex -= 1

        if (currentIndex < 0) {
          isDeleting = false
          currentIndex = 0
          currentStringIndex = (currentStringIndex + 1) % textArray.value.length

          if (!props.loop && currentStringIndex === 0)
            return

          timeoutId = setTimeout(runLoop, 500)
        }
        else {
          timeoutId = setTimeout(runLoop, typingSpeed.value / 2)
        }
      }
      else {
        displayedText.value = currentString.substring(0, currentIndex + 1)
        currentIndex += 1

        if (currentIndex > currentString.length) {
          const hasMoreStrings = textArray.value.length > 1 && (props.loop || currentStringIndex < textArray.value.length - 1)
          const shouldLoopSingle = textArray.value.length === 1 && props.loop

          if (hasMoreStrings || shouldLoopSingle) {
            isDeleting = true
            currentIndex = currentString.length
            timeoutId = setTimeout(runLoop, 2000)
          }
        }
        else {
          timeoutId = setTimeout(runLoop, typingSpeed.value)
        }
      }
    }

    displayedText.value = ''

    initialTimer = setTimeout(() => {
      runLoop()
    }, props.startDelay)

    onCleanup(() => {
      if (initialTimer) clearTimeout(initialTimer)
      if (timeoutId) clearTimeout(timeoutId)
    })
  },
  { immediate: true },
)
</script>

<template>
  <div :class="['inline-flex items-center', props.className]">
    <span class="whitespace-nowrap">
      <Motion
        v-for="(char, index) in displayedText.split('')"
        :key="index"
        as="span"
        :initial="props.morph ? { opacity: 0, filter: 'blur(2px)' } : { opacity: 1 }"
        :animate="props.morph ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 1 }"
        :transition="{ duration: 0.1 }"
      >
        {{ char }}
      </Motion>
    </span>

    <Motion
      v-if="props.cursor"
      as="span"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'linear',
      }"
      class="ml-0.5 inline-block h-[1.2em] w-[2px] align-bottom"
      style="background: currentColor"
      aria-hidden="true"
    />
  </div>
</template>
