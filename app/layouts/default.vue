<script setup lang="ts">
import Dither from '@/components/background/Dither.vue'

const controls = useDitherControls()
const ditherReady = useState<boolean>('dither-ready', () => false)
const route = useRoute()
const scrollableRoute = computed(
  () => route.path === '/' || route.path === '/docs',
)
const headerRoute = computed(
  () => route.path === '/' || route.path === '/docs',
)
const docsRoute = computed(() => route.path === '/docs')
const showAnimatedBackground = computed(() => route.path !== '/docs')

function handleDitherReady() {
  ditherReady.value = true
}
</script>

<template>
  <div
    class="[--hero-top-offset:calc(76px+env(safe-area-inset-top))] relative overflow-hidden text-[var(--un-preset-radix-slate12)] h-dvh bg-pureBlack"
  >
    <div
      v-if="showAnimatedBackground"
      class="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        class="absolute inset-0 transition-opacity duration-1200 ease-out"
        :class="ditherReady ? 'opacity-0' : 'opacity-100'"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(31,102,87,0.26)_0%,rgba(8,12,14,0.9)_48%,rgba(5,6,7,1)_100%)]"
        />
        <div
          class="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]"
        />
      </div>

      <div
        class="absolute inset-0 transition-opacity duration-1200 ease-out"
        :class="ditherReady ? 'opacity-100' : 'opacity-0'"
      >
        <Dither
          :wave-speed="controls.waveSpeed.value"
          :wave-frequency="controls.waveFrequency.value"
          :wave-amplitude="controls.waveAmplitude.value"
          :wave-color="[
            controls.waveColorR.value,
            controls.waveColorG.value,
            controls.waveColorB.value,
          ]"
          :color-num="controls.colorNum.value"
          :pixel-size="controls.pixelSize.value"
          :disable-animation="controls.disableAnimation.value"
          :enable-mouse-interaction="controls.enableMouseInteraction.value"
          :mouse-radius="controls.mouseRadius.value"
          @ready="handleDitherReady"
        />
      </div>
    </div>

    <div
      v-if="headerRoute"
      class="pointer-events-none absolute left-0 top-10 z-20 h-[52px] w-full sm:h-[60px]"
    >
      <DsHeader class="pointer-events-auto" />
    </div>

    <!-- UX: Let's see if this distracting -->
    <div
      v-if="docsRoute"
      class="pointer-events-none fixed inset-x-0 top-0 z-[19] h-[calc(var(--hero-top-offset)-32px)] bg-pureBlack"
    >
      <div class="absolute inset-x-0 top-10 h-[52px] flex sm:h-[60px]">
        <div class="grow bg-pureBlack" />
        <div class="w-[95vw] shrink-0 md:w-[615px]" />
        <div class="grow bg-pureBlack" />
      </div>
    </div>

    <div
      data-app-scroll-container
      :class="
        scrollableRoute
          ? 'relative z-10 h-full overflow-y-auto overflow-x-hidden'
          : 'relative z-10 h-full overflow-hidden'
      "
    >
      <slot />
    </div>
  </div>
</template>
