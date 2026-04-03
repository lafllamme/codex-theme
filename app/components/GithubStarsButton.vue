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
    const eased = 1 - (1 - progress) ** 3
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
    class="group font-geist-500 border-white/16 bg-black/58 hover:border-white/24 hover:bg-black/68 absolute right-0 top-0 z-30 inline-flex items-center gap-1.5 border rounded-[999px] px-2.5 py-1.5 text-[12px] no-underline shadow-[0_12px_28px_rgba(0,0,0,0.34)] backdrop-blur-xl transition-all duration-250 text-pureWhite/88 md:fixed md:right-6 md:top-6 sm:right-0 sm:top-0 sm:gap-2 sm:px-3 sm:py-2 sm:text-[13px] hover:-translate-y-0.5"
    aria-label="Open GitHub repository"
  >
    <Icon name="mdi:github-circle" class="h-5 w-5 transition-colors duration-200 text-pureWhite/80 group-hover:text-pureWhite/95" />

    <div class="bg-white/12 h-4.5 w-px" />

    <span class="number-wrap font-geist-mono-500 min-w-[6.2ch] justify-end text-right text-[12px] text-pureWhite/90">
      {{ paddedCurrent }}
    </span>

    <span class="star-wrap relative h-5 w-5 inline-flex items-center justify-center text-pureWhite/65">
      <Icon name="ph:star-fill" class="h-4 w-4 text-pureWhite/34" />
      <Icon
        name="ph:star-fill"
        class="absolute h-4 w-4 transition-colors duration-250 text-pureWhite/90 group-hover:text-pureWhite/95"
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

.p1 {
  --tx: 0px;
  --ty: -9px;
}
.p2 {
  --tx: 8px;
  --ty: -4px;
}
.p3 {
  --tx: 8px;
  --ty: 4px;
}
.p4 {
  --tx: 0px;
  --ty: 9px;
}

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
