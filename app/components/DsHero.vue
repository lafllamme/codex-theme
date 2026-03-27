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
      ? 'pointer-events-auto absolute left-0 top-5 z-1 h-[52px] w-full sm:top-6 sm:h-[60px]'
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

      <h1 class="hero-headline-glow font-geist-800 max-w-[12ch] text-pureWhite text-[clamp(3.5rem,8vw,7.7rem)] leading-[0.88] tracking-[-0.03em]">
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
          class="font-geist-500 pointer-events-auto inline-flex items-center justify-center rounded-[999px] border border-pureWhite/90 !bg-pureWhite px-7 py-2.5 text-[13px] !text-pureBlack no-underline shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 hover:!bg-pureWhite/92 sm:px-9 sm:py-3 sm:text-[14px]"
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
      class="grid h-full min-h-0 w-full grid-cols-1 items-center gap-10 px-0 pt-[80px] pb-0 lg:grid-cols-12 lg:gap-6 2xl:grid-cols-14 2xl:gap-8"
    >
      <div class="w-full text-center lg:col-start-2 lg:col-span-6 lg:text-left 2xl:col-start-3 2xl:col-span-6">
        <div class="mb-6 hero-intro hero-delay-1">
          <HyperText
            text="Tokens · Preview · Export"
            :duration="1500"
            class="font-geist-mono-500 text-[11px] text-pureWhite/58 tracking-[0.24em] uppercase"
          />
        </div>

        <h1 class="hero-headline-glow font-geist-800 w-fit max-w-full text-[clamp(3.25rem,8vw,6rem)] text-pureWhite leading-[0.9] tracking-[-0.04em]">
          <span class="hero-intro hero-delay-2 block whitespace-normal sm:whitespace-nowrap">{{ heroHeadlineTop }}</span>
          <span class="hero-intro hero-delay-3 block whitespace-normal sm:whitespace-nowrap">{{ heroHeadlineBottom }}</span>
        </h1>

        <p class="hero-intro hero-delay-4 font-geist-400 mt-2 max-w-xl text-[19px] text-pureWhite/74 leading-[1.6]">
          {{ body }}
        </p>

        <div class="mt-4 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
          <NuxtLink
            to="/themes"
            class="hero-intro hero-delay-5 font-geist-600 pointer-events-auto inline-flex items-center justify-center rounded-full bg-pureWhite px-8 py-4 text-[15px] !text-pureBlack no-underline shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-[1.02] hover:bg-pureWhite/92"
          >
            {{ mainCtaText }}
          </NuxtLink>
          <NuxtLink
            to="/old.view"
            class="hero-intro hero-delay-6 font-geist-600 pointer-events-auto inline-flex items-center justify-center rounded-full border border-pureWhite/16 bg-[rgba(255,255,255,0.08)] px-8 py-4 text-[15px] !text-pureWhite/92 no-underline shadow-[0_8px_24px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.25 hover:border-pureWhite/24 hover:bg-[rgba(255,255,255,0.14)] hover:!text-pureWhite"
          >
            {{ secondCtaText }}
          </NuxtLink>
        </div>
      </div>

      <div class="relative w-full lg:col-start-8 lg:col-span-4 2xl:col-start-9 2xl:col-span-4">
        <div class="pointer-events-none absolute inset-0 z-0 rounded-full bg-emerald-500/10 blur-[80px] translate-x-10 -translate-y-10" />
        <DsGlassSurface
          class="hero-ref-card pointer-events-auto box-border relative z-10 ml-auto w-full max-w-[500px] overflow-hidden rounded-[32px] p-8 md:p-10"
        >
          <div class="mb-10 flex items-center">
            <NativeTypewriter
              content="What you can generate"
              speed="fast"
              class-name="font-geist-700 text-2xl text-pureWhite tracking-tight md:text-3xl"
            />
          </div>

          <div class="relative z-10 flex flex-col gap-8">
            <div class="group flex items-start gap-6">
              <span class="font-geist-mono-700 mt-1 text-[22px] text-emerald-400 leading-none transition-colors group-hover:text-emerald-300">
                {}
              </span>
              <div class="flex flex-col gap-1">
                <p class="m-0 font-geist-600 text-base text-pureWhite tracking-wide">
                  Semantic Token Sets
                </p>
                <p class="m-0 font-geist-400 text-sm text-gray-400 leading-relaxed">
                  Surface, text, accent and state colors tuned for dark-first UIs.
                </p>
              </div>
            </div>

            <div class="group flex items-start gap-6">
              <Icon name="ph:sliders" class="mt-[2px] h-6 w-6 text-emerald-400 transition-colors group-hover:text-emerald-300" />
              <div class="flex flex-col gap-1">
                <p class="m-0 font-geist-600 text-base text-pureWhite tracking-wide">
                  Live Multi-Preview
                </p>
                <p class="m-0 font-geist-400 text-sm text-gray-400 leading-relaxed">
                  Validate themes in editor, docs, and terminal-style previews.
                </p>
              </div>
            </div>

            <div class="group flex items-start gap-6">
              <Icon name="ph:file-arrow-down" class="mt-[2px] h-6 w-6 text-emerald-400 transition-colors group-hover:text-emerald-300" />
              <div class="flex flex-col gap-1">
                <p class="m-0 font-geist-600 text-base text-pureWhite tracking-wide">
                  Export-Ready Output
                </p>
                <p class="m-0 font-geist-400 text-sm text-gray-400 leading-relaxed">
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

      <h1 class="hero-headline-glow font-geist-700 max-w-[10.5ch] text-pureWhite text-[clamp(3.9rem,9.2vw,9.2rem)] leading-[0.86] tracking-[-0.035em]">
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
          class="font-geist-600 pointer-events-auto inline-flex items-center justify-center rounded-[999px] border border-pureWhite/92 !bg-pureWhite px-7 py-2.5 text-[13px] !text-pureBlack no-underline transition-all hover:-translate-y-0.5 hover:!bg-pureWhite/92 sm:px-8 sm:text-[14px]"
        >
          {{ mainCtaText }}
        </NuxtLink>
        <NuxtLink
          to="/old.view"
          class="font-geist-500 pointer-events-auto rounded-[999px] border border-pureWhite/20 bg-[rgba(255,255,255,0.06)] px-7 py-2.5 text-[13px] !text-pureWhite/82 no-underline shadow-[0_8px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl transition-all hover:border-pureWhite/35 hover:bg-[rgba(255,255,255,0.1)] hover:!text-pureWhite/92 sm:px-8 sm:text-[14px]"
        >
          {{ secondCtaText }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-headline-glow {
  color: rgba(255, 255, 255, 0.995);
  text-shadow:
    0 0 16px rgba(255, 255, 255, 0.4),
    0 0 43px rgba(255, 255, 255, 0.2),
    0 0 80px rgba(255, 255, 255, 0.1);
  filter: drop-shadow(0 0 13px rgba(255, 255, 255, 0.16));
}

.hero-ref-card {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.035);
  box-shadow:
    0 18px 36px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.11);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

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

.hero-delay-1 {
  animation-delay: 120ms;
}

.hero-delay-2 {
  animation-delay: 260ms;
}

.hero-delay-3 {
  animation-delay: 380ms;
}

.hero-delay-4 {
  animation-delay: 540ms;
}

.hero-delay-5 {
  animation-delay: 680ms;
}

.hero-delay-6 {
  animation-delay: 800ms;
}

.hero-delay-7 {
  animation-delay: 920ms;
}

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
