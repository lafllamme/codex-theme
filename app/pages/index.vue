<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const controls = useDitherControls()
const controlsOpen = ref(false)
</script>

<template>
  <main class="p-4 sm:p-6 lg:p-8">
    <section class="relative mx-auto min-h-[86vh] max-w-[1600px] overflow-hidden">
      <div class="relative z-10 min-h-[86vh]">
        <DsHero />

        <button
          class="fixed top-4 right-4 z-30 border border-white/15 rounded-full bg-black/70 px-4 py-2 text-white/88 backdrop-blur-xl transition-colors hover:border-[var(--un-preset-radix-mint7)] hover:text-[var(--un-preset-radix-mint10)] sm:top-6 sm:right-6"
          @click="controlsOpen = !controlsOpen"
        >
          <span class="font-geist-500 text-[12px] tracking-[0.08em] uppercase">
            {{ controlsOpen ? 'Hide Controls' : 'Show Controls' }}
          </span>
        </button>

        <aside
          v-show="controlsOpen"
          class="fixed top-16 right-4 z-20 w-[286px] border border-white/11 rounded-2xl bg-black/68 p-3.5 backdrop-blur-xl shadow-[0_24px_50px_rgba(0,0,0,0.45)] sm:top-18 sm:right-6"
        >
          <p class="font-geist-500 text-[11px] text-white/75 tracking-[0.14em] uppercase">
            Dither Control Center
          </p>

          <div class="mt-3 space-y-3">
            <label class="flex items-center justify-between gap-3">
              <span class="font-geist-400 text-[12px] text-white/84">Mouse Interaction</span>
              <input v-model="controls.enableMouseInteraction.value" type="checkbox" class="h-4.5 w-8 accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="flex items-center justify-between gap-3">
              <span class="font-geist-400 text-[12px] text-white/84">Disable Animation</span>
              <input v-model="controls.disableAnimation.value" type="checkbox" class="h-4.5 w-8 accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-white/80">Wave Speed</span>
                <span class="font-geist-mono-400 text-[12px] text-white/72">{{ controls.waveSpeed.value.toFixed(2) }}</span>
              </div>
              <input v-model.number="controls.waveSpeed.value" type="range" min="0" max="0.25" step="0.01" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-white/80">Wave Frequency</span>
                <span class="font-geist-mono-400 text-[12px] text-white/72">{{ controls.waveFrequency.value.toFixed(1) }}</span>
              </div>
              <input v-model.number="controls.waveFrequency.value" type="range" min="1" max="5" step="0.1" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-white/80">Wave Amplitude</span>
                <span class="font-geist-mono-400 text-[12px] text-white/72">{{ controls.waveAmplitude.value.toFixed(2) }}</span>
              </div>
              <input v-model.number="controls.waveAmplitude.value" type="range" min="0.05" max="0.8" step="0.01" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-white/80">Color Count</span>
                <span class="font-geist-mono-400 text-[12px] text-white/72">{{ controls.colorNum.value }}</span>
              </div>
              <input v-model.number="controls.colorNum.value" type="range" min="2" max="8" step="1" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-white/80">Pixel Size</span>
                <span class="font-geist-mono-400 text-[12px] text-white/72">{{ controls.pixelSize.value }}</span>
              </div>
              <input v-model.number="controls.pixelSize.value" type="range" min="1" max="8" step="1" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-white/80">Mouse Radius</span>
                <span class="font-geist-mono-400 text-[12px] text-white/72">{{ controls.mouseRadius.value.toFixed(1) }}</span>
              </div>
              <input v-model.number="controls.mouseRadius.value" type="range" min="0.1" max="2" step="0.1" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-white/80">Wave Color R</span>
                <span class="font-geist-mono-400 text-[12px] text-white/72">{{ controls.waveColorR.value.toFixed(2) }}</span>
              </div>
              <input v-model.number="controls.waveColorR.value" type="range" min="0" max="1" step="0.01" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-white/80">Wave Color G</span>
                <span class="font-geist-mono-400 text-[12px] text-white/72">{{ controls.waveColorG.value.toFixed(2) }}</span>
              </div>
              <input v-model.number="controls.waveColorG.value" type="range" min="0" max="1" step="0.01" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-white/80">Wave Color B</span>
                <span class="font-geist-mono-400 text-[12px] text-white/72">{{ controls.waveColorB.value.toFixed(2) }}</span>
              </div>
              <input v-model.number="controls.waveColorB.value" type="range" min="0" max="1" step="0.01" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>
          </div>
        </aside>
      </div>
    </section>
  </main>
</template>
