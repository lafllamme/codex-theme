<script setup lang="ts">
import { useIntervalFn, usePreferredReducedMotion, useTimeoutFn } from '@vueuse/core'
import { Motion } from 'motion-v'

interface NativeTypewriterProps {
  content: string | string[]
  mode?: 'character' | 'chunk'
  speed?: 'slow' | 'medium' | 'fast' | number
  cursor?: boolean
  loop?: boolean
  startDelay?: number
  loopPause?: number
  morph?: boolean
  chunkSizeWords?: number
  chunkInterval?: number
  chunkFadeDuration?: number
  chunkFadeEasing?: string
  className?: string
  /** Chat-style wrapping; hero usage keeps default false. */
  wrap?: boolean
}

const props = withDefaults(defineProps<NativeTypewriterProps>(), {
  mode: 'character',
  speed: 'medium',
  cursor: true,
  loop: false,
  startDelay: 0,
  loopPause: 800,
  morph: true,
  chunkSizeWords: 2,
  chunkInterval: 55,
  chunkFadeDuration: 300,
  chunkFadeEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  className: '',
  wrap: false,
})

const emit = defineEmits<{
  complete: []
}>()

const SPLIT_WHITESPACE_RE = /\s+/

const shouldReduceMotion = usePreferredReducedMotion()
const displayedText = ref('')
const visibleChunks = ref(0)
const charCurrentIndex = ref(0)
const charCurrentStringIndex = ref(0)
const charIsDeleting = ref(false)
const charEmittedComplete = ref(false)
const charStepDelayMs = ref(0)

/** Single string avoids UnoCSS choking on undefined tokens in array :class during extract. */
const rootClass = computed(() =>
  [
    props.wrap ? 'native-typewriter-wrap' : 'inline-flex items-center',
    props.className?.trim() || undefined,
  ].filter(Boolean).join(' '),
)

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

const chunkText = computed(() => textArray.value.join(' '))
const wordChunks = computed(() => {
  const words = chunkText.value.split(SPLIT_WHITESPACE_RE).filter(Boolean)
  const size = Math.max(1, props.chunkSizeWords)
  const chunks: string[] = []
  for (let i = 0; i < words.length; i += size)
    chunks.push(words.slice(i, i + size).join(' '))
  return chunks
})

const chunkTransition = computed(() => `opacity ${Math.max(0, props.chunkFadeDuration)}ms ${props.chunkFadeEasing}`)

function chunkStyle(index: number) {
  return {
    opacity: index < visibleChunks.value ? 1 : 0,
    transition: chunkTransition.value,
  }
}

const { start: startCharacterStep, stop: stopCharacterStep } = useTimeoutFn(
  () => {
    runCharacterStep()
  },
  charStepDelayMs,
  { immediate: false },
)

const { start: startStartDelay, stop: stopStartDelay } = useTimeoutFn(
  () => {
    runAfterStartDelay()
  },
  () => Math.max(0, props.startDelay),
  { immediate: false },
)

const { pause: pauseChunkInterval, resume: resumeChunkInterval } = useIntervalFn(
  () => {
    runChunkTick()
  },
  () => Math.max(1, props.chunkInterval),
  { immediate: false, immediateCallback: false },
)

const { start: startChunkResetDelay, stop: stopChunkResetDelay } = useTimeoutFn(
  () => {
    visibleChunks.value = 0
    resumeChunkInterval()
  },
  () => Math.max(0, props.loopPause),
  { immediate: false },
)

function resetCharacterState() {
  charCurrentIndex.value = 0
  charCurrentStringIndex.value = 0
  charIsDeleting.value = false
  charEmittedComplete.value = false
}

function queueCharacterStep(delayMs: number) {
  charStepDelayMs.value = Math.max(0, delayMs)
  stopCharacterStep()
  startCharacterStep()
}

function runCharacterStep() {
  const currentString = textArray.value[charCurrentStringIndex.value] || ''

  if (charIsDeleting.value) {
    displayedText.value = currentString.substring(0, charCurrentIndex.value)
    charCurrentIndex.value -= 1

    if (charCurrentIndex.value < 0) {
      charIsDeleting.value = false
      charCurrentIndex.value = 0
      charCurrentStringIndex.value = (charCurrentStringIndex.value + 1) % textArray.value.length

      if (!props.loop && charCurrentStringIndex.value === 0)
        return

      queueCharacterStep(500)
    }
    else {
      queueCharacterStep(typingSpeed.value / 2)
    }
    return
  }

  displayedText.value = currentString.substring(0, charCurrentIndex.value + 1)
  charCurrentIndex.value += 1

  if (charCurrentIndex.value > currentString.length) {
    const hasMoreStrings = textArray.value.length > 1 && (props.loop || charCurrentStringIndex.value < textArray.value.length - 1)
    const shouldLoopSingle = textArray.value.length === 1 && props.loop

    if (hasMoreStrings || shouldLoopSingle) {
      charIsDeleting.value = true
      charCurrentIndex.value = currentString.length
      queueCharacterStep(2000)
    }
    else if (!charEmittedComplete.value) {
      charEmittedComplete.value = true
      emit('complete')
    }
    return
  }

  queueCharacterStep(typingSpeed.value)
}

function runChunkTick() {
  if (visibleChunks.value < wordChunks.value.length) {
    visibleChunks.value += 1
    return
  }

  pauseChunkInterval()

  if (!props.loop || wordChunks.value.length === 0) {
    emit('complete')
    return
  }

  startChunkResetDelay()
}

function runAfterStartDelay() {
  if (props.mode === 'chunk') {
    if (wordChunks.value.length === 0) {
      emit('complete')
      return
    }
    resumeChunkInterval()
    return
  }

  resetCharacterState()
  queueCharacterStep(0)
}

function stopAllTimers() {
  stopStartDelay()
  stopCharacterStep()
  pauseChunkInterval()
  stopChunkResetDelay()
}

watch(
  [
    () => props.mode,
    textArray,
    typingSpeed,
    () => props.loop,
    () => props.startDelay,
    () => props.loopPause,
    () => props.chunkInterval,
    () => props.chunkSizeWords,
    () => props.chunkFadeDuration,
    () => props.chunkFadeEasing,
    shouldReduceMotion,
  ],
  () => {
    stopAllTimers()
    displayedText.value = ''
    visibleChunks.value = 0

    if (shouldReduceMotion.value === 'reduce') {
      if (props.mode === 'chunk')
        visibleChunks.value = wordChunks.value.length
      else
        displayedText.value = textArray.value.join(' ')
      emit('complete')
      return
    }

    startStartDelay()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  stopAllTimers()
})
</script>

<template>
  <div :class="rootClass">
    <span
      v-if="props.mode === 'chunk'"
      :class="props.wrap ? 'native-typewriter-text' : 'whitespace-nowrap'"
    >
      <span
        v-for="(chunk, index) in wordChunks"
        :key="`${index}-${chunk}`"
        :style="chunkStyle(index)"
      >
        {{ chunk }}
        {{ ' ' }}
      </span>
    </span>
    <span
      v-else
      :class="props.wrap ? 'native-typewriter-text' : 'whitespace-nowrap'"
    >
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
      v-if="props.cursor && props.mode === 'character'"
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

<style scoped>
.native-typewriter-wrap {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.native-typewriter-text {
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-word;
}
</style>
