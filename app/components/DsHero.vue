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
const WHITESPACE_RE = /\s+/g

const headlineLines = computed(() => props.headline.split('\n'))
const heroHeadline = computed(() => {
  const normalized = props.headline
    .trim()
    .replace(WHITESPACE_RE, ' ')
    .toUpperCase()

  if (!normalized)
    return 'CODEX\nTHEME STUDIO'

  const words = normalized.split(' ')
  if (words[0] !== 'CODEX')
    return normalized

  const rest = words.slice(1).join(' ')
  return rest ? `CODEX\n${rest}` : 'CODEX'
})
const heroHeadlineTop = computed(() => heroHeadline.value.split('\n')[0] ?? 'CODEX')
const heroHeadlineBottom = computed(() => heroHeadline.value.split('\n')[1] || 'THEME STUDIO')

const headerWrapClass = computed(() =>
  props.variant === 'grid'
    ? 'pointer-events-auto absolute left-0 top-5 z-1 h-[52px] w-full sm:top-6 sm:h-[60px]'
    : props.variant === 'typo'
      ? 'pointer-events-auto absolute left-0 top-16 z-1 h-[52px] w-full sm:top-4 sm:h-[60px]'
      : 'pointer-events-auto absolute left-0 top-7 z-1 h-[52px] w-full sm:top-8 sm:h-[60px]',
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
        <DsGlassSurface
          as="NuxtLink"
          to="/old.view"
          tone="soft"
          class="font-geist-500 pointer-events-auto inline-flex items-center justify-center rounded-[999px] px-7 py-2.5 text-[13px] !text-pureWhite/72 no-underline transition-all hover:bg-[rgba(255,255,255,0.08)] hover:!text-pureWhite/86 sm:px-9 sm:py-3 sm:text-[14px]"
        >
          {{ secondCtaText }}
        </DsGlassSurface>
      </div>
    </div>

    <div
      v-else-if="variant === 'typo'"
      class="mx-auto grid h-full w-full max-w-[1320px] grid-cols-1 items-start gap-7 px-4 pt-32 pb-12 sm:gap-9 sm:px-6 sm:pt-26 sm:pb-16 md:grid-cols-12 md:gap-8 md:pr-8 md:pt-30 lg:gap-12"
    >
      <div class="w-full text-center md:col-span-8 md:text-left">
        <div class="mb-3 hero-intro hero-delay-1">
          <HyperText
            text="Tokens · Preview · Export"
            :duration="1500"
            class="font-geist-mono-500 text-[11px] text-pureWhite/58 tracking-[0.18em] uppercase"
          />
        </div>

        <h1 class="font-geist-800 w-fit max-w-full text-[clamp(2.35rem,14vw,6.2rem)] text-white leading-[0.92] tracking-[-0.024em] sm:text-[clamp(2.9rem,9vw,6.2rem)] sm:leading-[0.9]">
          <span class="hero-intro hero-delay-2 block whitespace-normal sm:whitespace-nowrap">{{ heroHeadlineTop }}</span>
          <span class="hero-intro hero-delay-3 block whitespace-normal sm:whitespace-nowrap">{{ heroHeadlineBottom }}</span>
        </h1>

        <p class="hero-intro hero-delay-4 font-geist-400 mt-7 max-w-[56ch] text-[14px] text-pureWhite/74 leading-[1.45] sm:mt-10 sm:text-[15px] sm:leading-[1.5] md:text-[19px]">
          {{ body }}
        </p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-12 md:justify-start">
          <NuxtLink
            to="/themes"
            class="hero-intro hero-delay-5 font-geist-600 pointer-events-auto inline-flex items-center justify-center rounded-[999px] border border-white/90 bg-[rgba(255,255,255,0.98)] px-6 py-2.5 text-[13px] !text-[rgba(0,0,0,0.92)] no-underline shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[rgba(255,255,255,0.92)] hover:!text-[rgba(0,0,0,0.92)] sm:px-8 sm:text-[14px]"
          >
            {{ mainCtaText }}
          </NuxtLink>
          <DsGlassSurface
            as="NuxtLink"
            to="/old.view"
            tone="soft"
            class="hero-intro hero-delay-6 font-geist-500 pointer-events-auto inline-flex items-center justify-center rounded-[999px] px-6 py-2.5 text-[13px] !text-pureWhite/74 no-underline transition-all hover:bg-[rgba(255,255,255,0.08)] hover:!text-pureWhite/88 sm:px-8 sm:text-[14px]"
          >
            {{ secondCtaText }}
          </DsGlassSurface>
        </div>
      </div>

      <div class="md:col-span-4">
        <DsGlassSurface
          class="pointer-events-auto box-border mx-auto w-full max-w-full min-w-0 self-start overflow-hidden rounded-[22px] p-4 sm:rounded-[24px] md:ml-auto md:max-w-[480px] md:p-5"
        >
          <div class="rounded-[14px] border border-white/10 bg-black/18 px-3.5 py-2">
            <NativeTypewriter
              content="What you can generate"
              speed="fast"
              class-name="font-geist-700 text-[clamp(1.28rem,1.9vw,1.75rem)] text-pureWhite/90 leading-[1.12] tracking-[-0.01em]"
            />
          </div>

          <div class="mt-3 space-y-0">
            <div class="rounded-[12px] px-2 py-2.5 transition-colors hover:bg-white/4">
              <div class="grid grid-cols-[18px_1fr] items-start gap-x-2.5 gap-y-1.5">
                <Icon name="ph:brackets-curly-bold" class="col-start-1 row-start-1 h-[18px] w-[18px] self-center text-pureWhite/74" aria-hidden="true" />
                <p class="col-start-2 row-start-1 font-geist-600 text-[clamp(1.08rem,1.35vw,1.22rem)] leading-[1.18] text-pureWhite/92">
                  Semantic Token Sets
                </p>
                <p class="col-start-2 row-start-2 max-w-[31ch] font-geist-400 text-[13px] text-pureWhite/68 leading-[1.5]">
                  Surface, text, accent and state colors tuned for dark-first UIs.
                </p>
              </div>
            </div>

            <div class="my-0 border-t border-white/10" />

            <div class="rounded-[12px] px-2 py-2.5 transition-colors hover:bg-white/4">
              <div class="grid grid-cols-[18px_1fr] items-start gap-x-2.5 gap-y-1.5">
                <Icon name="ph:sliders" class="col-start-1 row-start-1 h-[18px] w-[18px] self-center text-pureWhite/74" aria-hidden="true" />
                <p class="col-start-2 row-start-1 font-geist-600 text-[clamp(1.08rem,1.35vw,1.22rem)] leading-[1.18] text-pureWhite/92">
                  Live Multi-Preview
                </p>
                <p class="col-start-2 row-start-2 max-w-[31ch] font-geist-400 text-[13px] text-pureWhite/68 leading-[1.5]">
                  Validate themes in editor, docs, and terminal-style previews.
                </p>
              </div>
            </div>

            <div class="my-0 border-t border-white/10" />

            <div class="rounded-[12px] px-2 py-2.5 transition-colors hover:bg-white/4">
              <div class="grid grid-cols-[18px_1fr] items-start gap-x-2.5 gap-y-1.5">
                <Icon name="ph:file-arrow-up-fill" class="col-start-1 row-start-1 h-[18px] w-[18px] self-center text-pureWhite/74" aria-hidden="true" />
                <p class="col-start-2 row-start-1 font-geist-600 text-[clamp(1.08rem,1.35vw,1.22rem)] leading-[1.18] text-pureWhite/92">
                  Export-Ready Output
                </p>
                <p class="col-start-2 row-start-2 max-w-[31ch] font-geist-400 text-[13px] text-pureWhite/68 leading-[1.5]">
                  Ship JSON tokens and theme files with consistent naming.
                </p>
              </div>
            </div>
          </div>
        </DsGlassSurface>
      </div>
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

<style scoped>
.hero-intro {
  opacity: 0;
  filter: blur(14px);
  transform: translate3d(0, 24px, 0);
  will-change: transform, opacity, filter;
  animation-name: hero-lift-reveal;
  animation-duration: 720ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  animation-fill-mode: forwards;
}

.hero-delay-1 { animation-delay: 120ms; }
.hero-delay-2 { animation-delay: 260ms; }
.hero-delay-3 { animation-delay: 380ms; }
.hero-delay-4 { animation-delay: 540ms; }
.hero-delay-5 { animation-delay: 680ms; }
.hero-delay-6 { animation-delay: 800ms; }
.hero-delay-7 { animation-delay: 920ms; }

@keyframes hero-lift-reveal {
  0% {
    opacity: 0;
    filter: blur(14px);
    transform: translate3d(0, 24px, 0);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: translate3d(0, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-intro {
    opacity: 1;
    filter: none;
    transform: none;
    animation: none;
  }
}
</style>
