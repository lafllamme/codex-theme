<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { SplitText } from 'gsap/SplitText'
import { onMounted, onUnmounted, ref, watch } from 'vue'

interface ScrambleTextProps {
  radius?: number
  duration?: number
  speed?: number
  scrambleChars?: string
  className?: string
  style?: Record<string, string | number>
}

const props = withDefaults(defineProps<ScrambleTextProps>(), {
  radius: 100,
  duration: 1.2,
  speed: 0.5,
  scrambleChars: '.:',
  className: '',
  style: () => ({}),
})
gsap.registerPlugin(SplitText, ScrambleTextPlugin)

const rootRef = ref<HTMLDivElement | null>(null)

let splitText: SplitText | null = null
let handleMove: ((event: PointerEvent) => void) | null = null

function initializeScrambleText() {
  if (!rootRef.value)
    return

  const paragraph = rootRef.value.querySelector('p')
  if (!paragraph)
    return

  splitText = new SplitText(paragraph, {
    type: 'chars',
    charsClass: 'inline-block will-change-transform',
  })

  splitText.chars.forEach((charNode) => {
    const charEl = charNode as HTMLElement
    gsap.set(charEl, { attr: { 'data-content': charEl.innerHTML } })
  })

  handleMove = (event: PointerEvent) => {
    if (!splitText)
      return

    splitText.chars.forEach((charNode) => {
      const charEl = charNode as HTMLElement
      const { left, top, width, height } = charEl.getBoundingClientRect()
      const dx = event.clientX - (left + width / 2)
      const dy = event.clientY - (top + height / 2)
      const distance = Math.hypot(dx, dy)

      if (distance < props.radius) {
        gsap.to(charEl, {
          overwrite: true,
          duration: props.duration * (1 - distance / props.radius),
          scrambleText: {
            text: charEl.dataset.content || '',
            chars: props.scrambleChars,
            speed: props.speed,
          },
          ease: 'none',
        })
      }
    })
  }

  rootRef.value.addEventListener('pointermove', handleMove)
}

function cleanup() {
  if (rootRef.value && handleMove)
    rootRef.value.removeEventListener('pointermove', handleMove)

  if (splitText) {
    splitText.revert()
    splitText = null
  }

  handleMove = null
}

onMounted(() => {
  initializeScrambleText()
})

onUnmounted(() => {
  cleanup()
})

watch(
  [
    () => props.radius,
    () => props.duration,
    () => props.speed,
    () => props.scrambleChars,
  ],
  () => {
    cleanup()
    initializeScrambleText()
  },
)
</script>

<template>
  <div
    ref="rootRef"
    class="scramble-text"
    :class="className"
    :style="style"
  >
    <p class="m-0">
      <slot />
    </p>
  </div>
</template>
