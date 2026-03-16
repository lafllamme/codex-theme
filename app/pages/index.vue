<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const controls = useDitherControls()
const controlsOpen = ref(true)
</script>

<template>
  <main class="p-4 sm:p-6 lg:p-8">
    <section class="relative mx-auto min-h-[86vh] max-w-[1600px] overflow-hidden">
      <div class="relative z-10 flex min-h-[86vh] flex-col items-center px-4 py-6 sm:px-8 lg:px-12">
        <nav class="h-16 w-full max-w-[1380px] border border-pureWhite/20 rounded-full bg-pureBlack/48 px-5 backdrop-blur-[10px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] sm:px-7">
          <div class="flex h-full items-center justify-between">
            <div class="flex items-center gap-3.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                class="h-8 w-8 shrink-0 text-pureWhite"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
              </svg>

              <p class="font-geist-500 text-[20px] text-pureWhite leading-none sm:text-[22px]">
                Theme Generator
              </p>
            </div>

            <div class="flex items-center gap-6 text-pureWhite/92">
              <NuxtLink
                to="/"
                class="font-geist-500 text-[14px] color-pureWhite/90 no-underline visited:color-pureWhite/90 active:color-pureWhite/90 hover:color-[var(--un-preset-radix-mint10)]"
              >
                Home
              </NuxtLink>
              <NuxtLink
                to="/old.view"
                class="font-geist-500 text-[14px] color-pureWhite/90 no-underline visited:color-pureWhite/90 active:color-pureWhite/90 hover:color-[var(--un-preset-radix-mint10)]"
              >
                Docs
              </NuxtLink>
            </div>
          </div>
        </nav>

        <div class="mt-14 flex flex-1 flex-col items-center justify-center text-center sm:mt-16">
          <h1 class="font-geist-700 mt-4 max-w-4xl text-[clamp(2.8rem,6vw,6.3rem)] text-pureWhite leading-[0.98]">
            Codex Theme
            <br>
            Generator
          </h1>

          <p class="font-geist-400 mt-7 max-w-2xl text-[15px] text-pureWhite/76 leading-relaxed sm:text-[18px]">
            Build, preview and export dark-first Codex themes with live tokens, mint accents, and production-ready output.
          </p>

          <div class="mt-12 flex flex-wrap items-center justify-center gap-4">
            <NuxtLink
              to="/old.view"
              class="font-geist-500 border border-pureWhite/18 rounded-full bg-pureWhite px-12 py-4 text-[17px] color-pureBlack no-underline visited:color-pureBlack active:color-pureBlack transition-transform hover:translate-y-[-1px]"
            >
              Get Started
            </NuxtLink>
            <NuxtLink
              to="/old.view"
              class="font-geist-500 border border-pureWhite/18 rounded-full bg-pureBlack/44 px-12 py-4 text-[17px] color-pureWhite/90 no-underline visited:color-pureWhite/90 active:color-pureWhite/90 backdrop-blur-xl transition-colors hover:border-[var(--un-preset-radix-mint7)] hover:color-[var(--un-preset-radix-mint10)]"
            >
              Learn More
            </NuxtLink>
          </div>
        </div>

        <button
          class="fixed right-4 top-4 z-30 border border-pureWhite/15 rounded-full bg-pureBlack/70 px-4 py-2 text-pureWhite/88 backdrop-blur-xl transition-colors hover:border-[var(--un-preset-radix-mint7)] hover:text-[var(--un-preset-radix-mint10)] sm:right-6 sm:top-6"
          @click="controlsOpen = !controlsOpen"
        >
          <span class="font-geist-500 text-[12px] tracking-[0.08em] uppercase">
            {{ controlsOpen ? 'Hide Controls' : 'Show Controls' }}
          </span>
        </button>

        <aside
          v-show="controlsOpen"
          class="fixed right-4 top-16 z-20 w-[286px] border border-pureWhite/11 rounded-2xl bg-pureBlack/68 p-3.5 backdrop-blur-xl shadow-[0_24px_50px_rgba(0,0,0,0.45)] sm:right-6 sm:top-18"
        >
          <p class="font-geist-500 text-[11px] text-pureWhite/75 tracking-[0.14em] uppercase">
            Dither Control Center
          </p>

          <div class="mt-3 space-y-3">
            <label class="flex items-center justify-between gap-3">
              <span class="font-geist-400 text-[12px] text-pureWhite/84">Mouse Interaction</span>
              <input v-model="controls.enableMouseInteraction.value" type="checkbox" class="h-4.5 w-8 accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="flex items-center justify-between gap-3">
              <span class="font-geist-400 text-[12px] text-pureWhite/84">Disable Animation</span>
              <input v-model="controls.disableAnimation.value" type="checkbox" class="h-4.5 w-8 accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-pureWhite/80">Wave Speed</span>
                <span class="font-geist-mono-400 text-[12px] text-pureWhite/72">{{ controls.waveSpeed.value.toFixed(2) }}</span>
              </div>
              <input v-model.number="controls.waveSpeed.value" type="range" min="0" max="0.25" step="0.01" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-pureWhite/80">Wave Frequency</span>
                <span class="font-geist-mono-400 text-[12px] text-pureWhite/72">{{ controls.waveFrequency.value.toFixed(1) }}</span>
              </div>
              <input v-model.number="controls.waveFrequency.value" type="range" min="1" max="5" step="0.1" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-pureWhite/80">Wave Amplitude</span>
                <span class="font-geist-mono-400 text-[12px] text-pureWhite/72">{{ controls.waveAmplitude.value.toFixed(2) }}</span>
              </div>
              <input v-model.number="controls.waveAmplitude.value" type="range" min="0.05" max="0.8" step="0.01" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-pureWhite/80">Color Count</span>
                <span class="font-geist-mono-400 text-[12px] text-pureWhite/72">{{ controls.colorNum.value }}</span>
              </div>
              <input v-model.number="controls.colorNum.value" type="range" min="2" max="8" step="1" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-pureWhite/80">Pixel Size</span>
                <span class="font-geist-mono-400 text-[12px] text-pureWhite/72">{{ controls.pixelSize.value }}</span>
              </div>
              <input v-model.number="controls.pixelSize.value" type="range" min="1" max="8" step="1" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-pureWhite/80">Mouse Radius</span>
                <span class="font-geist-mono-400 text-[12px] text-pureWhite/72">{{ controls.mouseRadius.value.toFixed(1) }}</span>
              </div>
              <input v-model.number="controls.mouseRadius.value" type="range" min="0.1" max="2" step="0.1" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-pureWhite/80">Wave Color R</span>
                <span class="font-geist-mono-400 text-[12px] text-pureWhite/72">{{ controls.waveColorR.value.toFixed(2) }}</span>
              </div>
              <input v-model.number="controls.waveColorR.value" type="range" min="0" max="1" step="0.01" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-pureWhite/80">Wave Color G</span>
                <span class="font-geist-mono-400 text-[12px] text-pureWhite/72">{{ controls.waveColorG.value.toFixed(2) }}</span>
              </div>
              <input v-model.number="controls.waveColorG.value" type="range" min="0" max="1" step="0.01" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>

            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-geist-400 text-[12px] text-pureWhite/80">Wave Color B</span>
                <span class="font-geist-mono-400 text-[12px] text-pureWhite/72">{{ controls.waveColorB.value.toFixed(2) }}</span>
              </div>
              <input v-model.number="controls.waveColorB.value" type="range" min="0" max="1" step="0.01" class="w-full accent-[var(--un-preset-radix-mint10)]" />
            </label>
          </div>
        </aside>
      </div>
    </section>
  </main>
</template>
