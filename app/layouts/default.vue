<script setup lang="ts">
const controls = useDitherControls()
</script>

<template>
  <div class="relative min-h-screen bg-[#050607] text-[var(--un-preset-radix-slate12)]">
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
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
      />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,0,0,0.04),rgba(0,0,0,0.24)_46%,rgba(0,0,0,0.44)_100%)]" />
    </div>

    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>
