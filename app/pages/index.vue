<script setup lang="ts">
import DsHero from '@/components/DsHero.vue'

definePageMeta({
  layout: 'default',
})

useCodexPageSeo({
  title: 'Build, preview, and export theme packs for OpenAI Codex',
  description:
    'Explore 500+ Codex theme variations, tune colors and fonts, then export a build-ready JSON theme pack for the OpenAI Codex app—free in the browser.',
  keywords: ['theme variations', 'theme pack', 'export theme'],
})

const route = useRoute()
const controls = useDitherControls()
const controlsOpen = ref(false)
const controlsEnabled = computed(() => route.query.controls === '1')
</script>

<template>
  <main class="relative min-h-full w-full flex flex-col overflow-x-hidden">
    <DsHero
      variant="typo"
      headline="Codex Theme Studio"
      body="Discover 500+ possible theme variations, refine your favorites, and export a final build-ready theme pack."
      main-cta-text="Open Builder"
      second-cta-text="Go to Docs"
    />

    <GithubStarsButton username="barvian" repo="number-flow" />

    <div class="min-h-px flex-1" aria-hidden="true" />

    <DsHomeFooter />

    <button
      v-if="controlsEnabled"
      class="font-geist-500 border-white/90 !bg-white !text-black hover:!bg-white/92 fixed right-4 top-18 z-30 inline-flex items-center justify-center border rounded-[999px] px-7 py-2.5 text-[13px] no-underline shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition-all sm:right-6 sm:top-20 sm:px-9 sm:py-3 sm:text-[14px] hover:-translate-y-0.5"
      @click="controlsOpen = !controlsOpen"
    >
      {{ controlsOpen ? 'Hide Controls' : 'Show Controls' }}
    </button>

    <aside
      v-if="controlsEnabled"
      v-show="controlsOpen"
      class="border-white/11 bg-black/68 fixed right-4 top-30 z-20 w-[286px] border rounded-2xl p-3.5 shadow-[0_24px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:right-6 sm:top-32"
    >
      <p
        class="font-geist-500 text-[11px] tracking-[0.14em] uppercase text-pureWhite/75"
      >
        Dither Control Center
      </p>

      <div class="mt-3 space-y-3">
        <label class="flex items-center justify-between gap-3">
          <span class="font-geist-400 text-[12px] text-pureWhite/84">Mouse Interaction</span>
          <input
            v-model="controls.enableMouseInteraction.value"
            type="checkbox"
            class="h-4.5 w-8 accent-[var(--un-preset-radix-mint10)]"
          >
        </label>

        <label class="flex items-center justify-between gap-3">
          <span class="font-geist-400 text-[12px] text-pureWhite/84">Disable Animation</span>
          <input
            v-model="controls.disableAnimation.value"
            type="checkbox"
            class="h-4.5 w-8 accent-[var(--un-preset-radix-mint10)]"
          >
        </label>

        <label class="block">
          <div class="mb-1 flex items-center justify-between">
            <span
              class="font-geist-400 text-[12px] text-pureWhite/80"
            >Wave Speed</span>
            <span
              class="font-geist-mono-400 text-[12px] text-pureWhite/72"
            >{{ controls.waveSpeed.value.toFixed(2) }}</span>
          </div>
          <input
            v-model.number="controls.waveSpeed.value"
            type="range"
            min="0.01"
            max="0.2"
            step="0.01"
            class="w-full accent-[var(--un-preset-radix-mint10)]"
          >
        </label>

        <label class="block">
          <div class="mb-1 flex items-center justify-between">
            <span
              class="font-geist-400 text-[12px] text-pureWhite/80"
            >Wave Frequency</span>
            <span
              class="font-geist-mono-400 text-[12px] text-pureWhite/72"
            >{{ controls.waveFrequency.value.toFixed(1) }}</span>
          </div>
          <input
            v-model.number="controls.waveFrequency.value"
            type="range"
            min="1"
            max="8"
            step="0.1"
            class="w-full accent-[var(--un-preset-radix-mint10)]"
          >
        </label>

        <label class="block">
          <div class="mb-1 flex items-center justify-between">
            <span
              class="font-geist-400 text-[12px] text-pureWhite/80"
            >Wave Amplitude</span>
            <span
              class="font-geist-mono-400 text-[12px] text-pureWhite/72"
            >{{ controls.waveAmplitude.value.toFixed(2) }}</span>
          </div>
          <input
            v-model.number="controls.waveAmplitude.value"
            type="range"
            min="0.1"
            max="0.8"
            step="0.01"
            class="w-full accent-[var(--un-preset-radix-mint10)]"
          >
        </label>

        <label class="block">
          <div class="mb-1 flex items-center justify-between">
            <span
              class="font-geist-400 text-[12px] text-pureWhite/80"
            >Color Count</span>
            <span
              class="font-geist-mono-400 text-[12px] text-pureWhite/72"
            >{{ controls.colorNum.value }}</span>
          </div>
          <input
            v-model.number="controls.colorNum.value"
            type="range"
            min="2"
            max="16"
            step="1"
            class="w-full accent-[var(--un-preset-radix-mint10)]"
          >
        </label>

        <label class="block">
          <div class="mb-1 flex items-center justify-between">
            <span
              class="font-geist-400 text-[12px] text-pureWhite/80"
            >Pixel Size</span>
            <span
              class="font-geist-mono-400 text-[12px] text-pureWhite/72"
            >{{ controls.pixelSize.value }}</span>
          </div>
          <input
            v-model.number="controls.pixelSize.value"
            type="range"
            min="1"
            max="8"
            step="1"
            class="w-full accent-[var(--un-preset-radix-mint10)]"
          >
        </label>

        <label class="block">
          <div class="mb-1 flex items-center justify-between">
            <span
              class="font-geist-400 text-[12px] text-pureWhite/80"
            >Mouse Radius</span>
            <span
              class="font-geist-mono-400 text-[12px] text-pureWhite/72"
            >{{ controls.mouseRadius.value.toFixed(1) }}</span>
          </div>
          <input
            v-model.number="controls.mouseRadius.value"
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            class="w-full accent-[var(--un-preset-radix-mint10)]"
          >
        </label>

        <label class="block">
          <div class="mb-1 flex items-center justify-between">
            <span
              class="font-geist-400 text-[12px] text-pureWhite/80"
            >Wave Color R</span>
            <span
              class="font-geist-mono-400 text-[12px] text-pureWhite/72"
            >{{ controls.waveColorR.value.toFixed(2) }}</span>
          </div>
          <input
            v-model.number="controls.waveColorR.value"
            type="range"
            min="0"
            max="1"
            step="0.01"
            class="w-full accent-[var(--un-preset-radix-mint10)]"
          >
        </label>

        <label class="block">
          <div class="mb-1 flex items-center justify-between">
            <span
              class="font-geist-400 text-[12px] text-pureWhite/80"
            >Wave Color G</span>
            <span
              class="font-geist-mono-400 text-[12px] text-pureWhite/72"
            >{{ controls.waveColorG.value.toFixed(2) }}</span>
          </div>
          <input
            v-model.number="controls.waveColorG.value"
            type="range"
            min="0"
            max="1"
            step="0.01"
            class="w-full accent-[var(--un-preset-radix-mint10)]"
          >
        </label>

        <label class="block">
          <div class="mb-1 flex items-center justify-between">
            <span
              class="font-geist-400 text-[12px] text-pureWhite/80"
            >Wave Color B</span>
            <span
              class="font-geist-mono-400 text-[12px] text-pureWhite/72"
            >{{ controls.waveColorB.value.toFixed(2) }}</span>
          </div>
          <input
            v-model.number="controls.waveColorB.value"
            type="range"
            min="0"
            max="1"
            step="0.01"
            class="w-full accent-[var(--un-preset-radix-mint10)]"
          >
        </label>
      </div>
    </aside>
  </main>
</template>
