<script setup lang="ts">
const controls = useDitherControls()
const ditherReady = useState<boolean>('dither-ready', () => false)
const route = useRoute()
const scrollableRoute = computed(() => route.path === '/' || route.path === '/docs')

function handleDitherReady() {
  ditherReady.value = true
}
</script>

<template>
  <div
    class="relative h-dvh overflow-hidden bg-[#050607] text-[var(--un-preset-radix-slate12)] [--hero-top-offset:calc(76px+env(safe-area-inset-top))]"
  >
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        class="absolute inset-0 transition-opacity duration-1200 ease-out"
        :class="ditherReady ? 'opacity-0' : 'opacity-100'"
      >
        <div class="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(31,102,87,0.26)_0%,rgba(8,12,14,0.9)_48%,rgba(5,6,7,1)_100%)]" />
        <div class="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
      </div>

      <div
        class="absolute inset-0 transition-opacity duration-1200 ease-out"
        :class="ditherReady ? 'opacity-100' : 'opacity-0'"
      >
        <Dither
          :wave-speed="controls.waveSpeed.value"
          :wave-frequency="controls.waveFrequency.value"
          :wave-amplitude="controls.waveAmplitude.value"
          :wave-color="[controls.waveColorR.value, controls.waveColorG.value, controls.waveColorB.value]"
          :color-num="controls.colorNum.value"
          :pixel-size="controls.pixelSize.value"
          :disable-animation="controls.disableAnimation.value"
          :enable-mouse-interaction="controls.enableMouseInteraction.value"
          :mouse-radius="controls.mouseRadius.value"
          @ready="handleDitherReady"
        />
      </div>
    </div>

    <div :class="scrollableRoute ? 'relative z-10 h-full overflow-y-auto overflow-x-hidden' : 'relative z-10 h-full overflow-hidden'">
      <slot />
    </div>
  </div>
</template>
