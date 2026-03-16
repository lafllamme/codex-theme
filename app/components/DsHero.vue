<script setup lang="ts">
import { computed } from 'vue'

type HeroVariant = 'tight' | 'typo' | 'grid'

interface DsHeroProps {
  headline?: string
  body?: string
  mainCtaText?: string
  secondCtaText?: string
  variant?: HeroVariant
}

const props = withDefaults(defineProps<DsHeroProps>(), {
  headline: 'Codex Theme\nGenerator',
  body: 'Design, preview, and ship signature Codex themes in minutes with live tokens, instant contrast scoring, and one-click exports.',
  mainCtaText: 'Get Started',
  secondCtaText: 'Learn More',
  variant: 'tight',
})

const headlineLines = computed(() => props.headline.split('\n'))

const headerWrapClass = computed(() =>
  props.variant === 'grid'
    ? 'pointer-events-auto absolute left-0 top-5 z-1 h-[60px] w-full sm:top-6'
    : 'pointer-events-auto absolute left-0 top-7 z-1 h-[60px] w-full sm:top-8',
)
</script>

<template>
  <div class="pointer-events-none absolute inset-0 select-none">
    <div :class="headerWrapClass">
      <DsHeader />
    </div>

    <div
      v-if="variant === 'tight'"
      class="mx-auto flex h-full w-full max-w-[1160px] flex-col items-center justify-center px-4 pt-14 pb-8 text-center sm:pt-16"
    >
      <p class="font-geist-mono-500 mb-5 text-[11px] text-pureWhite/60 tracking-[0.22em] uppercase">
        Editorial Theme Engine
      </p>

      <h1 class="font-geist-800 max-w-[12ch] text-white text-[clamp(3.5rem,8vw,7.7rem)] leading-[0.88] tracking-[-0.03em]">
        <template v-for="(line, index) in headlineLines" :key="`${line}-${index}`">
          <span>{{ line }}</span>
          <br v-if="index < headlineLines.length - 1">
        </template>
      </h1>

      <p class="font-geist-400 mt-5 max-w-[54ch] text-[16px] text-pureWhite/76 leading-[1.45] sm:text-[20px]">
        {{ body }}
      </p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-3.5">
        <NuxtLink
          to="/themes"
          class="font-geist-500 pointer-events-auto inline-flex items-center justify-center rounded-[999px] border border-white/90 !bg-white px-7 py-2.5 text-[13px] !text-black no-underline shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 hover:!bg-white/92 sm:px-9 sm:py-3 sm:text-[14px]"
        >
          {{ mainCtaText }}
        </NuxtLink>
        <NuxtLink
          to="/old.view"
          class="font-geist-500 pointer-events-auto rounded-[999px] border border-white/20 bg-white/6 px-7 py-2.5 text-[13px] !text-pureWhite/72 no-underline backdrop-blur-[10px] transition-all hover:bg-white/10 hover:!text-pureWhite/86 sm:px-9 sm:py-3 sm:text-[14px]"
        >
          {{ secondCtaText }}
        </NuxtLink>
      </div>
    </div>

    <div
      v-else-if="variant === 'typo'"
      class="mx-auto grid h-full w-full max-w-[1280px] grid-cols-1 items-center gap-8 px-6 pt-18 pb-8 md:grid-cols-12 md:gap-10"
    >
      <div class="text-center md:col-span-8 md:text-left">
        <p class="font-geist-mono-500 mb-3 text-[11px] text-pureWhite/58 tracking-[0.18em] uppercase">
          Tokens · Preview · Export
        </p>

        <h1 class="font-geist-800 text-white text-[clamp(4.4rem,9vw,8.6rem)] leading-[0.84] tracking-[-0.04em]">
          <template v-for="(line, index) in headlineLines" :key="`${line}-${index}`">
            <span>{{ line }}</span>
            <br v-if="index < headlineLines.length - 1">
          </template>
        </h1>

        <p class="font-geist-400 mt-4 max-w-[56ch] text-[15px] text-pureWhite/74 leading-[1.5] md:text-[19px]">
          {{ body }}
        </p>

        <div class="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <NuxtLink
            to="/themes"
            class="font-geist-600 pointer-events-auto inline-flex items-center justify-center rounded-[999px] border border-white/90 bg-[rgba(255,255,255,0.98)] px-6 py-2.5 text-[13px] !text-[rgba(0,0,0,0.92)] no-underline shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[rgba(255,255,255,0.92)] hover:!text-[rgba(0,0,0,0.92)] sm:px-8 sm:text-[14px]"
          >
            {{ mainCtaText }}
          </NuxtLink>
          <NuxtLink
            to="/old.view"
            class="font-geist-500 pointer-events-auto rounded-[999px] border border-white/20 bg-white/6 px-6 py-2.5 text-[13px] !text-pureWhite/74 no-underline backdrop-blur-[10px] transition-all hover:bg-white/10 hover:!text-pureWhite/88 sm:px-8 sm:text-[14px]"
          >
            {{ secondCtaText }}
          </NuxtLink>
        </div>
      </div>

      <aside class="pointer-events-auto border border-white/16 rounded-[22px] bg-black/38 p-4 backdrop-blur-[12px] md:col-span-4 md:ml-auto md:w-[360px]">
        <p class="font-geist-mono-500 text-[10px] text-pureWhite/60 tracking-[0.18em] uppercase">
          What You Can Generate
        </p>

        <div class="mt-4 space-y-3">
          <div class="rounded-xl border border-white/10 bg-black/22 px-0 py-2.5">
            <div class="grid grid-cols-[16px_1fr] items-center gap-x-2 gap-y-1">
              <Icon name="ph:brackets-curly-bold" class="h-4 w-4 text-pureWhite/70" aria-hidden="true" />
              <p class="font-geist-700 text-[14px] leading-none text-pureWhite/90">
                Semantic Token Sets
              </p>
              <p class="col-start-2 mt-1.5 font-geist-400 text-[12px] text-pureWhite/62 leading-[1.45]">
                Surface, text, accent and state colors tuned for dark-first UIs.
              </p>
            </div>
          </div>

          <div class="rounded-xl border border-white/10 bg-black/22 px-0 py-2.5">
            <div class="grid grid-cols-[16px_1fr] items-center gap-x-2 gap-y-1">
              <Icon name="ph:sliders" class="h-4 w-4 text-pureWhite/70" aria-hidden="true" />
              <p class="font-geist-700 text-[14px] leading-none text-pureWhite/90">
                Live Multi-Preview
              </p>
              <p class="col-start-2 mt-1.5 font-geist-400 text-[12px] text-pureWhite/62 leading-[1.45]">
                Validate themes in editor, docs, and terminal-style previews.
              </p>
            </div>
          </div>

          <div class="rounded-xl border border-white/10 bg-black/22 px-0 py-2.5">
            <div class="grid grid-cols-[16px_1fr] items-center gap-x-2 gap-y-1">
              <Icon name="ph:file-arrow-up-fill" class="h-4 w-4 text-pureWhite/70" aria-hidden="true" />
              <p class="font-geist-700 text-[14px] leading-none text-pureWhite/90">
                Export-Ready Output
              </p>
              <p class="col-start-2 mt-1.5 font-geist-400 text-[12px] text-pureWhite/62 leading-[1.45]">
                Ship JSON tokens and theme files with consistent naming.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <div
      v-else
      class="mx-auto flex h-full w-full max-w-[1180px] flex-col justify-start px-5 pt-28 pb-8 sm:pt-30"
    >
      <p class="font-geist-mono-500 mb-4 text-[11px] text-pureWhite/56 tracking-[0.24em] uppercase">
        Minimal Editorial
      </p>

      <h1 class="font-geist-700 max-w-[10.5ch] text-white text-[clamp(3.9rem,9.2vw,9.2rem)] leading-[0.86] tracking-[-0.035em]">
        <template v-for="(line, index) in headlineLines" :key="`${line}-${index}`">
          <span>{{ line }}</span>
          <br v-if="index < headlineLines.length - 1">
        </template>
      </h1>

      <p class="font-geist-400 mt-6 max-w-[48ch] text-[15px] text-pureWhite/71 leading-[1.5] sm:text-[17px]">
        {{ body }}
      </p>

      <div class="mt-9 flex flex-wrap items-center gap-3.5">
        <NuxtLink
          to="/themes"
          class="font-geist-600 pointer-events-auto inline-flex items-center justify-center rounded-[999px] border border-white/92 !bg-white px-7 py-2.5 text-[13px] !text-black no-underline transition-all hover:-translate-y-0.5 hover:!bg-white/92 sm:px-8 sm:text-[14px]"
        >
          {{ mainCtaText }}
        </NuxtLink>
        <NuxtLink
          to="/old.view"
          class="font-geist-500 pointer-events-auto rounded-[999px] border border-white/20 bg-transparent px-7 py-2.5 text-[13px] !text-pureWhite/68 no-underline transition-all hover:border-white/35 hover:!text-pureWhite/86 sm:px-8 sm:text-[14px]"
        >
          {{ secondCtaText }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
