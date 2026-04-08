<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'

type AnimationDirection = 'loop' | 'vloop'

interface LogoItem {
  icon: string
  label: string
}

const props = withDefaults(
  defineProps<{
    animationDelay?: number
    animationDuration?: number
    direction?: AnimationDirection
    logos?: LogoItem[]
    visibleCount?: number
  }>(),
  {
    animationDelay: 1.2,
    animationDuration: 0.6,
    direction: 'loop',
    visibleCount: 5,
  },
)

const fallbackLogos: LogoItem[] = [
  { icon: 'ph:git-branch-light', label: 'Clone' },
  { icon: 'ph:file-arrow-down-light', label: 'Preset' },
  { icon: 'ph:terminal-window-light', label: 'Install' },
  { icon: 'ph:sliders-horizontal-light', label: 'Tune' },
  { icon: 'ph:gear-light', label: 'Convert' },
  { icon: 'ph:brackets-curly-light', label: 'JSON' },
  { icon: 'ph:rocket-launch-light', label: 'Import' },
]

const logos = computed(() => (props.logos?.length ? props.logos : fallbackLogos))

const ITEM_WIDTH = 80
const ITEM_GAP = 24
const ITEM_STRIDE = ITEM_WIDTH + ITEM_GAP

const safeVisibleCount = computed(() => {
  const requested = Math.max(3, props.visibleCount)
  const requestedOdd = requested % 2 === 0 ? requested + 1 : requested
  const available = logos.value.length
  if (available <= 1)
    return 1

  const maxOdd = available % 2 === 0 ? available - 1 : available
  return Math.max(1, Math.min(requestedOdd, maxOdd))
})

const centerOffset = computed(() => Math.floor(safeVisibleCount.value / 2))
const viewportWidth = computed(() => safeVisibleCount.value * ITEM_STRIDE - ITEM_GAP)

const currentIndex = ref(0)

const visibleLogos = computed(() => {
  const source = logos.value
  if (!source.length)
    return [] as Array<{ logo: LogoItem, originalIndex: number }>

  const items: Array<{ logo: LogoItem, originalIndex: number }> = []
  for (let i = -centerOffset.value; i <= centerOffset.value; i++) {
    const idx = (currentIndex.value + i + source.length) % source.length
    items.push({ logo: source[idx], originalIndex: idx })
  }
  return items
})

const visiblePositionByIndex = computed(() => {
  const map = new Map<number, number>()
  const offset = centerOffset.value
  visibleLogos.value.forEach((item, arrayIndex) => {
    map.set(item.originalIndex, arrayIndex - offset)
  })
  return map
})

const transitionEasing = 'cubic-bezier(0.4, 0, 0.2, 1)'

const groupStyle = computed(() => ({
  '--step-duration': `${props.animationDuration}s`,
  '--step-easing': transitionEasing,
  '--enter-offset': props.direction === 'loop' ? `${ITEM_STRIDE}px` : `${-ITEM_STRIDE}px`,
  '--leave-offset': props.direction === 'loop' ? `${-ITEM_STRIDE}px` : `${ITEM_STRIDE}px`,
}))

function getPosition(originalIndex: number) {
  return visiblePositionByIndex.value.get(originalIndex) ?? 0
}

function isCenter(originalIndex: number) {
  return getPosition(originalIndex) === 0
}

function itemOpacity(originalIndex: number) {
  const position = getPosition(originalIndex)
  const d = Math.abs(position)
  if (d === 0)
    return 1
  if (d === 1)
    return 0.5
  if (d === 2)
    return 0.24
  return 0.16
}

function itemScale(originalIndex: number) {
  const position = getPosition(originalIndex)
  return position === 0 ? 1 : 0.75
}

function lineOpacity(originalIndex: number) {
  const d = Math.abs(getPosition(originalIndex))
  if (d === 0)
    return 1
  if (d === 1)
    return 0.58
  if (d === 2)
    return 0.34
  return 0.2
}

function itemStyle(originalIndex: number) {
  const position = getPosition(originalIndex)
  return {
    opacity: itemOpacity(originalIndex),
    transform: `translateX(${position * ITEM_STRIDE}px) scale(${itemScale(originalIndex)})`,
    transition: [
      `transform ${props.animationDuration}s ${transitionEasing}`,
      `opacity ${props.animationDuration}s ${transitionEasing}`,
    ].join(', '),
  }
}

function runStep() {
  const len = logos.value.length
  if (len <= 1)
    return

  if (props.direction === 'loop')
    currentIndex.value = (currentIndex.value + 1) % len
  else
    currentIndex.value = (currentIndex.value - 1 + len) % len
}

const intervalMs = computed(() => props.animationDelay * 1000)
const { pause, resume } = useIntervalFn(runStep, intervalMs, {
  immediate: false,
  immediateCallback: false,
})

function restart() {
  currentIndex.value = 0
  pause()
  if (logos.value.length > 1)
    resume()
}

onMounted(restart)

watch(
  [
    () => logos.value.length,
    () => props.animationDelay,
    () => props.animationDuration,
    () => props.direction,
    () => props.visibleCount,
  ],
  restart,
)

onBeforeUnmount(() => {
  pause()
})
</script>

<template>
  <div class="relative w-full flex items-start justify-center overflow-hidden py-4">
    <div class="relative overflow-hidden" :style="{ width: `${viewportWidth}px` }">
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 from-pureBlack to-transparent bg-gradient-to-r" />
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 from-pureBlack to-transparent bg-gradient-to-l" />

      <TransitionGroup
        tag="div"
        name="logo-stepper"
        class="relative min-h-[200px] flex items-start justify-center"
        :style="groupStyle"
      >
        <div
          v-for="{ logo, originalIndex } in visibleLogos"
          :key="originalIndex"
          class="absolute left-1/2 top-0 ml-[-40px]"
        >
          <div
            class="min-h-[200px] w-20 flex shrink-0 flex-col items-center"
            :style="itemStyle(originalIndex)"
          >
            <div
              class="logo-stepper-card border rounded-xl border-solid bg-sand-2 p-4 transition-colors duration-200 hover:border-pureWhite"
              :class="isCenter(originalIndex) ? 'border-sand-8' : 'border-sand-5'"
            >
              <div class="h-12 w-12 flex items-center justify-center">
                <Icon :name="logo.icon" class="h-6 w-6 color-sand-10" />
              </div>
            </div>

            <div
              class="mt-4 h-28 flex flex-col items-center"
              :style="{
                opacity: lineOpacity(originalIndex),
                transition: `opacity ${animationDuration}s ${transitionEasing}`,
              }"
            >
              <div class="mb-4 h-16 w-0.5 bg-sand-5" />
              <span
                class="font-geist-500 whitespace-nowrap text-xs color-sand-8 tracking-wider uppercase"
              >
                {{ logo.label }}
              </span>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.logo-stepper-enter-active,
.logo-stepper-leave-active {
  transition:
    opacity var(--step-duration) var(--step-easing),
    transform var(--step-duration) var(--step-easing);
}

.logo-stepper-enter-from,
.logo-stepper-leave-to {
  opacity: 0;
}

.logo-stepper-enter-from {
  transform: translateX(var(--enter-offset)) scale(0.75);
}

.logo-stepper-leave-to {
  transform: translateX(var(--leave-offset)) scale(0.75);
}
</style>
