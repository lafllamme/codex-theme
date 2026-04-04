<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import { computed, onUnmounted, ref, watch } from 'vue'
import DsNumberFlow from '~/components/DsNumberFlow.vue'

interface GithubStarsButtonProps {
  username?: string
  repo?: string
  value?: number
}

const props = withDefaults(defineProps<GithubStarsButtonProps>(), {
  username: 'imskyleen',
  repo: 'animate-ui',
  value: 3400,
})

const INTRO_START_DELAY_MS = 60
const INTRO_DURATION_MS = 4500
const BURST_DURATION_MS = 320

const rootRef = ref<HTMLElement | null>(null)
const isInView = useElementVisibility(rootRef)

const stars = ref(Math.max(0, props.value ?? 0))
const currentStars = ref(0)
const starFillProgress = ref(0)
const burstActive = ref(false)
const burstArmed = ref(false)
const repoUrl = computed(() => `https://github.com/${props.username}/${props.repo}`)

const digitCount = computed(() => Math.max(4, String(Math.max(stars.value, 0)).length))
const numberFormat = computed<Intl.NumberFormatOptions>(() => ({
  maximumFractionDigits: 0,
  minimumIntegerDigits: digitCount.value,
  useGrouping: false,
}))

let burstTimer: ReturnType<typeof setTimeout> | null = null
let mountAnimationTimer: ReturnType<typeof setTimeout> | null = null
let fetchAbortController: AbortController | null = null
let introRunId = 0

const relaxedTransformTiming: EffectTiming = {
  duration: INTRO_DURATION_MS,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
}
const relaxedSpinTiming: EffectTiming = {
  duration: INTRO_DURATION_MS,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
}
const relaxedOpacityTiming: EffectTiming = {
  duration: 620,
  easing: 'ease-out',
}

function cleanup() {
  if (burstTimer) {
    clearTimeout(burstTimer)
    burstTimer = null
  }
  if (mountAnimationTimer) {
    clearTimeout(mountAnimationTimer)
    mountAnimationTimer = null
  }
  if (fetchAbortController) {
    fetchAbortController.abort()
    fetchAbortController = null
  }
}

function triggerBurst() {
  burstActive.value = false
  if (burstTimer)
    clearTimeout(burstTimer)

  burstActive.value = true
  burstTimer = setTimeout(() => {
    burstActive.value = false
    burstTimer = null
  }, BURST_DURATION_MS)
}

function playIntroAnimation(target: number) {
  introRunId += 1
  burstActive.value = false
  burstArmed.value = false
  stars.value = target
  currentStars.value = 0
  starFillProgress.value = 0

  if (mountAnimationTimer)
    clearTimeout(mountAnimationTimer)

  const runIdAtSchedule = introRunId
  mountAnimationTimer = setTimeout(() => {
    if (runIdAtSchedule !== introRunId)
      return
    currentStars.value = stars.value
    starFillProgress.value = 100
    burstArmed.value = true
    mountAnimationTimer = null
  }, INTRO_START_DELAY_MS)
}

function handleNumberFlowFinish() {
  if (!burstArmed.value)
    return
  burstArmed.value = false
  triggerBurst()
}

async function resolveStarsTarget() {
  const fallbackValue = Math.max(0, props.value ?? 0)
  if (!props.username || !props.repo)
    return fallbackValue

  if (fetchAbortController)
    fetchAbortController.abort()

  const controller = new AbortController()
  fetchAbortController = controller

  try {
    const response = await fetch(
      `https://api.github.com/repos/${props.username}/${props.repo}`,
      { signal: controller.signal },
    )

    if (!response.ok)
      return fallbackValue

    const data = await response.json() as { stargazers_count?: unknown }
    if (typeof data.stargazers_count === 'number')
      return Math.max(0, data.stargazers_count)
    return fallbackValue
  }
  catch {
    return fallbackValue
  }
  finally {
    if (fetchAbortController === controller)
      fetchAbortController = null
  }
}

async function runVisibleIntro() {
  const target = await resolveStarsTarget()
  playIntroAnimation(target)
}

watch(isInView, (visible) => {
  if (!visible) {
    cleanup()
    return
  }
  void runVisibleIntro()
}, { immediate: true })

watch(
  () => [props.username, props.repo, props.value],
  () => {
    if (!isInView.value)
      return
    void runVisibleIntro()
  },
)

onUnmounted(cleanup)
</script>

<template>
  <a
    ref="rootRef"
    :href="repoUrl"
    target="_blank"
    rel="noreferrer noopener"
    class="group font-geist-500 border-white/16 bg-black/58 hover:border-white/24 hover:bg-black/68 absolute right-0 top-0 z-30 inline-flex items-center gap-2 border rounded-[999px] px-2.5 py-1.5 text-[12px] no-underline shadow-[0_12px_28px_rgba(0,0,0,0.34)] backdrop-blur-xl transition-all duration-250 text-pureWhite/88 md:fixed md:right-6 md:top-6 sm:right-0 sm:top-0 sm:gap-2.5 sm:px-3.5 sm:py-2 sm:text-[13px] hover:-translate-y-0.5"
    aria-label="Open GitHub repository"
  >
    <Icon name="mdi:github-circle" class="h-5 w-5 transition-colors duration-200 text-pureWhite/80 group-hover:text-pureWhite/95" />

    <span class="number-wrap font-geist-mono-500 min-w-[7.2ch] justify-center text-center text-[13px] text-pureWhite/92 sm:min-w-[7.8ch] sm:text-[14px]">
      <DsNumberFlow
        class="stars-flow"
        style="--number-flow-char-height: 0.98em;"
        :value="currentStars"
        :format="numberFormat"
        :transform-timing="relaxedTransformTiming"
        :spin-timing="relaxedSpinTiming"
        :opacity-timing="relaxedOpacityTiming"
        :will-change="true"
        @animationsfinish="handleNumberFlowFinish"
      />
    </span>

    <span class="star-wrap relative h-5 w-5 inline-flex items-center justify-center text-pureWhite/65">
      <Icon name="ph:star-fill" class="h-4 w-4 text-pureWhite/34" />
      <Icon
        name="ph:star-fill"
        class="absolute h-4 w-4 transition-colors duration-250 text-pureWhite/90 group-hover:text-pureWhite/95"
        :style="{
          clipPath: `inset(${100 - starFillProgress}% 0 0 0)`,
          transition: `clip-path ${INTRO_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), color 250ms ease`,
        }"
      />
      <span v-if="burstActive" class="particles pointer-events-none absolute inset-0">
        <span class="particle p1" />
        <span class="particle p2" />
        <span class="particle p3" />
        <span class="particle p4" />
      </span>
    </span>
  </a>
</template>

<style scoped>
.number-wrap {
  display: inline-flex;
  align-items: center;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.stars-flow {
  display: inline-flex;
  align-items: center;
}

.particle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1.1px;
  height: 1.1px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.3);
  transform: translate(-50%, -50%) scale(0.45);
  animation: burst 320ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.p1 {
  --tx: 0px;
  --ty: -3.5px;
}
.p2 {
  --tx: 3px;
  --ty: -1.5px;
}
.p3 {
  --tx: 3px;
  --ty: 1.5px;
}
.p4 {
  --tx: 0px;
  --ty: 3.5px;
}

@keyframes burst {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.45);
  }
  18% {
    opacity: 0.62;
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.88);
  }
}
</style>
