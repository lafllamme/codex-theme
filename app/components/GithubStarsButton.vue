<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

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

const stars = ref(props.value)
const currentStars = ref(0)
const isCompleted = computed(() => currentStars.value === stars.value)
const burstActive = ref(false)
const repoUrl = computed(() => `https://github.com/${props.username}/${props.repo}`)

const digitCount = computed(() => Math.max(4, String(Math.max(stars.value, 0)).length))
const paddedCurrent = computed(() => String(Math.max(currentStars.value, 0)).padStart(digitCount.value, '0'))

let rafId: number | null = null
let burstTimer: ReturnType<typeof setTimeout> | null = null

const starFillPercent = computed(() => {
  if (stars.value <= 0)
    return 0
  const raw = (currentStars.value / stars.value) * 100
  const adjusted = isCompleted.value ? raw : raw - 10
  return Math.max(0, Math.min(100, adjusted))
})

function cleanup() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (burstTimer) {
    clearTimeout(burstTimer)
    burstTimer = null
  }
}

function animateNumber(target: number) {
  if (rafId !== null)
    cancelAnimationFrame(rafId)

  const start = performance.now()
  const duration = 1200
  const from = 0
  currentStars.value = from

  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - progress, 3)
    currentStars.value = Math.round(from + (target - from) * eased)

    if (progress < 1) {
      rafId = requestAnimationFrame(tick)
      return
    }

    currentStars.value = target
  }

  rafId = requestAnimationFrame(tick)
}

watch(isCompleted, (done) => {
  if (!done)
    return

  burstActive.value = false
  if (burstTimer)
    clearTimeout(burstTimer)

  burstTimer = setTimeout(() => {
    burstActive.value = true
    burstTimer = setTimeout(() => {
      burstActive.value = false
    }, 520)
  }, 120)
})

onMounted(() => {
  animateNumber(stars.value)
})
onUnmounted(cleanup)
</script>

<template>
  <a
    :href="repoUrl"
    target="_blank"
    rel="noreferrer noopener"
    class="group font-geist-500 absolute top-0 right-0 z-30 inline-flex items-center gap-1.5 rounded-[999px] border border-white/16 bg-black/58 px-2.5 py-1.5 text-[12px] text-pureWhite/88 no-underline backdrop-blur-xl shadow-[0_12px_28px_rgba(0,0,0,0.34)] transition-all duration-250 hover:-translate-y-0.5 hover:border-white/24 hover:bg-black/68 sm:top-0 sm:right-0 sm:px-3 sm:py-2 sm:text-[13px] sm:gap-2 md:fixed md:top-6 md:right-6"
    aria-label="Open GitHub repository"
  >
    <Icon name="mdi:github-circle" class="h-5 w-5 text-pureWhite/80 transition-colors duration-200 group-hover:text-pureWhite/95" />

    <div class="h-4.5 w-px bg-white/12" />

    <span class="number-wrap font-geist-mono-500 min-w-[6.2ch] justify-end text-right text-[12px] text-pureWhite/90">
      {{ paddedCurrent }}
    </span>

    <span class="star-wrap relative inline-flex h-5 w-5 items-center justify-center text-pureWhite/65">
      <Icon name="ph:star-fill" class="h-4 w-4 text-pureWhite/34" />
      <Icon
        name="ph:star-fill"
        class="absolute h-4 w-4 text-pureWhite/90 transition-colors duration-250 group-hover:text-pureWhite/95"
        :style="{ clipPath: `inset(${100 - starFillPercent}% 0 0 0)` }"
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
  line-height: 1;
}

.particle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2.5px;
  height: 2.5px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.58);
  transform: translate(-50%, -50%) scale(0.65);
  animation: burst 520ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.p1 { --tx: 0px; --ty: -9px; }
.p2 { --tx: 8px; --ty: -4px; }
.p3 { --tx: 8px; --ty: 4px; }
.p4 { --tx: 0px; --ty: 9px; }

@keyframes burst {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.6);
  }
  12% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1);
  }
}
</style>
