<script setup lang="ts">
import DocsSectionShell from '~/components/docs/DocsSectionShell.vue'

const surfaceLayers = [
  { name: 'Lowest', hex: '#0E0E0E', cardClass: 'bg-[#090A0B]' },
  { name: 'Base', hex: '#131313', cardClass: 'bg-[#131313]' },
  { name: 'High', hex: '#2A2A2A', cardClass: 'bg-[#2A2A2A]' },
] as const

const elevationMetrics = [
  { label: 'Blur', value: '40px' },
  { label: 'Opacity', value: '0.04' },
  { label: 'Tonal Shift', value: '+12%' },
] as const
</script>

<template>
  <DocsSectionShell id="theme-generation-algorithm" title="Theme Generation Algorithm">
    <div class="relative overflow-hidden">
      <div class="pointer-events-none absolute right-[-130px] top-[-120px] h-[300px] w-[300px] rounded-full bg-white/[0.06] blur-3xl" />
      <div class="pointer-events-none absolute bottom-[-150px] left-[-140px] h-[320px] w-[320px] rounded-full bg-white/[0.04] blur-3xl" />

      <div class="relative z-10 flex items-center gap-4 overflow-hidden">
        <span class="font-geist-mono-500 text-[11px] tracking-[0.2em] color-sand-8 uppercase">
          Algorithm Engine // Architecture
        </span>
        <div class="h-px flex-1 bg-gradient-to-r from-sand-7/55 to-transparent" />
      </div>

      <header class="relative z-10 mt-8">
        <p class="max-w-3xl text-[clamp(0.98rem,1.5vw,1.34rem)] leading-relaxed color-sand-10">
          Our pipeline translates source palettes into high-performance,
          WCAG-compliant design tokens with deterministic scoring and
          production-safe normalization.
        </p>
      </header>

      <div class="relative z-10 mt-9 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:[grid-auto-rows:minmax(240px,auto)]">
        <article class="flex flex-col justify-between rounded-[1.7rem] border border-white/6 bg-slate-1 p-6 transition-colors duration-200 hover:bg-[#333338]/85">
          <div>
            <span class="font-geist-mono-500 text-[10px] tracking-[0.18em] color-sand-8 uppercase">Step 01</span>
            <h4 class="mt-5 font-geist-600 text-[clamp(1.3rem,2.2vw,2rem)] leading-tight color-pureWhite">
              Chromatic Analysis
            </h4>
            <p class="mt-3 max-w-[32ch] text-sm leading-relaxed color-sand-10">
              Deconstructing source palettes to detect harmonic anchors,
              luminance weight, and contrast boundaries.
            </p>
          </div>
          <div class="mt-7 grid grid-cols-4 gap-2.5">
            <div class="h-11 rounded-xl border border-black/15 bg-[#FAFAFA]" />
            <div class="h-11 rounded-xl border border-black/15 bg-[#C8C8C8]" />
            <div class="h-11 rounded-xl border border-black/15 bg-[#3A3A3A]" />
            <div class="h-11 rounded-xl border border-black/15 bg-[#0E0E0E]" />
          </div>
        </article>

        <article class="relative overflow-hidden rounded-[1.7rem] border border-white/7 bg-slate-1 p-6 transition-colors duration-200 hover:bg-[#333338]/85 lg:col-span-2">
          <div class="relative z-10">
            <span class="font-geist-mono-500 text-[10px] tracking-[0.18em] color-sand-8 uppercase">Step 02</span>
            <h4 class="mt-5 font-geist-600 text-[clamp(1.35rem,2.35vw,2.1rem)] leading-tight color-pureWhite">
              Surface Mapping
            </h4>
            <p class="mt-3 max-w-[62ch] text-sm leading-relaxed color-sand-10">
              Tonal layers are mathematically spaced for optical depth
              so components remain distinct across dark surfaces.
            </p>
            <div class="mt-8 grid gap-3 sm:grid-cols-3">
              <div
                v-for="layer in surfaceLayers"
                :key="layer.name"
                :class="[
                  'rounded-2xl border border-white/10 p-4',
                  layer.cardClass,
                ]"
              >
                <p class="font-geist-mono-500 text-[9px] tracking-[0.16em] color-sand-8 uppercase">
                  {{ layer.name }}
                </p>
                <p class="mt-2 font-geist-600 text-sm color-pureWhite">
                  {{ layer.hex }}
                </p>
              </div>
            </div>
          </div>
          <Icon
            name="ph:stack-bold"
            class="pointer-events-none absolute -bottom-7 -right-7 h-40 w-40 color-pureWhite/10"
          />
        </article>

        <article class="flex flex-col justify-between rounded-[1.7rem] border border-black/5 bg-[#F2F2F2] p-6 text-[#171717]">
          <div>
            <span class="font-geist-mono-500 text-[10px] tracking-[0.18em] text-[#666666] uppercase">Step 03</span>
            <h4 class="mt-5 font-geist-600 text-[clamp(1.28rem,2.2vw,2rem)] leading-tight">
              WCAG Validation
            </h4>
            <span class="mt-4 inline-flex rounded-full bg-black/9 px-3 py-1 font-geist-mono-500 text-[10px] tracking-[0.06em] text-[#202020] uppercase">
              PASS AAA
            </span>
          </div>
          <div class="mt-8 flex items-end gap-2">
            <span class="font-geist-700 text-[3.5rem] leading-none tracking-[-0.03em]">21:1</span>
            <span class="pb-2 font-geist-mono-500 text-[11px] tracking-[0.16em] text-[#707070] uppercase">Ratio</span>
          </div>
        </article>

        <article class="rounded-[1.7rem] border border-white/7 bg-slate-1 p-6 transition-colors duration-200 hover:bg-[#333338]/85">
          <span class="font-geist-mono-500 text-[10px] tracking-[0.18em] color-sand-8 uppercase">Step 04</span>
          <h4 class="mt-5 font-geist-600 text-[clamp(1.28rem,2.2vw,2rem)] leading-tight color-pureWhite">
            Elevation Matrix
          </h4>
          <div class="mt-6 space-y-4">
            <div
              v-for="item in elevationMetrics"
              :key="item.label"
              class="flex items-center justify-between border-b border-white/8 pb-2.5"
            >
              <span class="font-geist-mono-500 text-[10px] tracking-[0.14em] color-sand-8 uppercase">
                {{ item.label }}
              </span>
              <span class="font-geist-mono-500 text-sm color-pureWhite">
                {{ item.value }}
              </span>
            </div>
          </div>
        </article>

        <article class="rounded-[1.7rem] border border-white/7 bg-slate-1 p-6 transition-colors duration-200 hover:bg-[#333338]/85">
          <span class="font-geist-mono-500 text-[10px] tracking-[0.18em] color-sand-8 uppercase">Step 05</span>
          <h4 class="mt-5 font-geist-600 text-[clamp(1.28rem,2.2vw,2rem)] leading-tight color-pureWhite">
            Token Serialization
          </h4>
          <div class="mt-5 overflow-x-auto rounded-3xl border border-white/10 bg-black/70 px-4 py-4">
            <pre class="font-geist-mono-500 text-[11px] leading-relaxed color-sand-9">{
  "theme": "obsidian",
  "tokens": {
    "primary": "#FFFFFF",
    "surface": "#131313",
    "on-surface": "#E5E2E1"
  }
}</pre>
          </div>
        </article>
      </div>

      <article class="relative z-10 mt-4 flex flex-col gap-8 rounded-[1.8rem] border border-white/8 bg-[#1C1B1E]/92 p-7 sm:p-8 lg:mt-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-10">
        <div>
          <span class="font-geist-mono-500 text-[10px] tracking-[0.18em] color-sand-8 uppercase">Step 06</span>
          <h4 class="mt-5 font-geist-700 text-[clamp(1.9rem,4vw,3.35rem)] leading-[0.98] tracking-[-0.02em] color-pureWhite">
            Export Ready
          </h4>
          <p class="mt-3 max-w-[44ch] text-[15px] leading-relaxed color-sand-10">
            Design tokens are calculated, validated, and serialized.
            The artifact is deployment-ready with stable readability.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2.5 rounded-full border border-black/8 bg-white px-7 py-3.5 text-[13px] font-geist-600 tracking-[0.05em] text-[#1B1B1B] uppercase transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99] sm:px-10 sm:py-4"
        >
          Deploy to Production
          <Icon name="ph:rocket-launch-bold" class="h-4 w-4" />
        </button>
      </article>

      <div class="relative z-10 mt-7 flex items-center gap-3.5 opacity-65">
        <div class="h-px flex-1 bg-gradient-to-r from-sand-7/55 to-transparent" />
        <span class="font-geist-mono-500 text-[9px] tracking-[0.34em] color-sand-8 uppercase">
          Proprietary Core // End of Algorithm
        </span>
        <div class="h-px flex-1 bg-gradient-to-l from-sand-7/55 to-transparent" />
      </div>
    </div>
  </DocsSectionShell>
</template>
