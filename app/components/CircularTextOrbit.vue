<script setup lang="ts">
import type { MotionValue } from 'motion-v'
import { animate, Motion, useMotionValue } from 'motion-v'

interface CircularTextOrbitProps {
  text?: string
  spinDuration?: number
  onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers'
  textClass?: string
  wrapClass?: string
  orbitClass?: string
}

const props = withDefaults(defineProps<CircularTextOrbitProps>(), {
  text: 'OVER*500*THEMES*',
  spinDuration: 20,
  onHover: 'speedUp',
  textClass: 'text-pureWhite font-geist-900',
  wrapClass: 'fixed left-3 top-4 md:left-6 md:top-6',
  orbitClass: '',
})

const letters = computed(() => [...props.text])
const rotation: MotionValue<number> = useMotionValue(0)
let currentAnimation: ReturnType<typeof animate> | null = null

function startRotation(duration: number) {
  currentAnimation?.stop()
  const start = rotation.get()
  currentAnimation = animate(rotation, start + 360, {
    duration,
    ease: 'linear',
    repeat: Infinity,
  })
}

function handleHoverStart() {
  switch (props.onHover) {
    case 'slowDown':
      startRotation(props.spinDuration * 2)
      break
    case 'pause':
      currentAnimation?.stop()
      break
    case 'goBonkers':
      startRotation(Math.max(props.spinDuration / 20, 0.2))
      break
    case 'speedUp':
    default:
      startRotation(Math.max(props.spinDuration / 4, 0.3))
      break
  }
}

function handleHoverEnd() {
  startRotation(props.spinDuration)
}

function getLetterTransform(index: number) {
  const total = Math.max(letters.value.length, 1)
  const rotationDeg = (360 / total) * index
  const factor = Math.PI / total
  const x = factor * index
  const y = factor * index
  return `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`
}

onMounted(() => {
  startRotation(props.spinDuration)
})

onBeforeUnmount(() => {
  currentAnimation?.stop()
})
</script>

<template>
  <div class="circular-orbit-wrap" :class="props.wrapClass">
    <Motion
      as="div"
      class="circular-orbit"
      :class="[props.textClass, props.orbitClass]"
      :style="{ rotate: rotation }"
      :initial="{ rotate: 0 }"
      @mouseenter="handleHoverStart"
      @mouseleave="handleHoverEnd"
    >
      <span
        v-for="(letter, index) in letters"
        :key="`${letter}-${index}`"
        class="circular-orbit__letter"
        :style="{
          transform: getLetterTransform(index),
          WebkitTransform: getLetterTransform(index),
        }"
      >
        {{ letter }}
      </span>
    </Motion>
  </div>
</template>

<style scoped>
.circular-orbit-wrap {
  pointer-events: none;
  z-index: 22;
}

.circular-orbit {
  pointer-events: auto;
  position: relative;
  width: 168px;
  height: 168px;
  font-size: 1.2rem;
  letter-spacing: 0.02em;
  line-height: 1;
  border-radius: 9999px;
  user-select: none;
}

.circular-orbit__letter {
  position: absolute;
  inset: 0;
  display: inline-block;
  text-align: center;
  text-transform: uppercase;
  transition: transform 320ms cubic-bezier(0, 0, 0, 1);
}
</style>
