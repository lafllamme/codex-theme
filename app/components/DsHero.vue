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
const heroHeadlineTop = computed(
  () => heroHeadline.value.split('\n')[0] ?? 'CODEX',
)
const heroHeadlineBottom = computed(
  () => heroHeadline.value.split('\n')[1] || 'THEME STUDIO',
)

const headerWrapClass = computed(() =>
  props.variant === 'grid'
    ? 'pointer-events-auto absolute left-0 -top-5 md:top-0 z-1 h-[52px] w-full sm:-top-12 sm:h-[60px]'
    : props.variant === 'typo'
      ? 'pointer-events-auto absolute left-0 -top-5 md:top-0 z-1 h-[52px] w-full sm:-top-12 sm:h-[60px]'
      : 'pointer-events-auto absolute left-0 -top-5 md:top-0 z-1 h-[52px] w-full sm:-top-12 sm:h-[60px]',
)
</script>

<template>
  <div class="relative h-full w-full select-none">
    <div :class="headerWrapClass">
      <DsHeader />
    </div>

    <div
      v-if="variant === 'tight'"
      class="mx-auto h-full max-w-[1160px] w-full flex flex-col items-center justify-center px-4 pb-8 pt-14 text-center sm:pt-16"
    >
      <p
        class="font-geist-mono-500 mb-5 text-[11px] tracking-[0.22em] uppercase text-pureWhite/60"
      >
        Editorial Theme Engine
      </p>

      <h1
        class="hero-headline-glow font-geist-800 max-w-[12ch] text-[clamp(3.5rem,8vw,7.7rem)] leading-[0.88] tracking-[-0.03em] text-pureWhite"
      >
        <template
          v-for="(line, index) in headlineLines"
          :key="`${line}-${index}`"
        >
          <span>{{ line }}</span>
          <br v-if="index < headlineLines.length - 1">
        </template>
      </h1>

      <p
        class="font-geist-400 mt-5 max-w-[54ch] text-[16px] leading-[1.45] text-pureWhite/76 sm:text-[20px]"
      >
        {{ body }}
      </p>

      <div
        class="mt-8 flex flex-wrap items-center justify-center gap-3.5"
      >
        <NuxtLink
          to="/themes"
          class="font-geist-500 pointer-events-auto inline-flex items-center justify-center border rounded-[999px] px-7 py-2.5 text-[13px] no-underline shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition-all border-pureWhite/90 sm:px-9 sm:py-3 sm:text-[14px] !text-pureBlack !bg-pureWhite hover:-translate-y-0.5 hover:!bg-pureWhite/92"
        >
          {{ mainCtaText }}
        </NuxtLink>
        <DsGlassSurface
          as="NuxtLink"
          to="/docs"
          tone="soft"
          class="font-geist-500 pointer-events-auto inline-flex items-center justify-center rounded-[999px] px-7 py-2.5 text-[13px] no-underline transition-all hover:bg-[rgba(255,255,255,0.08)] sm:px-9 sm:py-3 sm:text-[14px] !text-pureWhite/72 hover:!text-pureWhite/86"
        >
          {{ secondCtaText }}
        </DsGlassSurface>
      </div>
    </div>

    <div
      v-else-if="variant === 'typo'"
      class="box-border mx-auto mt-[var(--hero-top-offset)] grid min-h-[calc(100dvh-var(--hero-top-offset))] w-full max-w-[1440px] grid-cols-1 items-center gap-18 md:gap-16 px-4 pb-0 pt-28 sm:px-6 lg:grid-cols-12 lg:gap-20 lg:px-12"
    >
      <div class="relative w-full text-center lg:col-span-7 lg:text-left">
        <div class="hero-intro hero-delay-1">
          <HyperText
            text="Tokens · Preview · Export"
            :duration="1500"
            class="font-geist-mono font-semibold text-xs tracking-[0.25em] uppercase color-sand-11"
          />
        </div>

        <h1
          class="my-4 hero-headline-glow font-geist-800 w-full max-w-full text-[clamp(2.85rem,15vw,4.8rem)] leading-[0.9] tracking-[-0.04em] text-pureWhite sm:w-fit sm:text-6xl md:text-7xl xl:text-[96px]"
        >
          <span
            class="hero-intro hero-delay-2 block whitespace-normal sm:whitespace-nowrap"
          >{{ heroHeadlineTop }}</span>
          <span
            class="hero-intro hero-delay-3 block whitespace-normal sm:whitespace-nowrap"
          >{{ heroHeadlineBottom }}</span>
        </h1>

        <p
          class="hero-intro hero-delay-4 mb-8 font-geist-300 max-w-xl text-[19px] leading-[1.6] color-sand-11"
        >
          {{ body }}
        </p>

        <div
          class="mt-2 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
        >
          <NuxtLink
            to="/themes"
            class="hero-intro hero-delay-5 font-geist-600 pointer-events-auto inline-flex items-center justify-center rounded-full px-8 py-4 text-[15px] no-underline shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 bg-pureWhite hover:scale-[1.02] !text-pureBlack hover:bg-pureWhite/92"
          >
            {{ mainCtaText }}
          </NuxtLink>
          <NuxtLink
            to="/docs"
            class="hero-intro hero-delay-6 font-geist-600 pointer-events-auto inline-flex items-center justify-center border rounded-full bg-[rgba(255,255,255,0.08)] px-8 py-4 text-[15px] no-underline shadow-[0_8px_24px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition-all duration-300 border-pureWhite/16 hover:bg-[rgba(255,255,255,0.14)] !text-pureWhite/92 hover:border-pureWhite/24 hover:-translate-y-0.25 hover:!text-pureWhite"
          >
            {{ secondCtaText }}
          </NuxtLink>
        </div>
      </div>

      <div class="relative w-full lg:col-span-5">
        <div
          class="bg-emerald-500/10 pointer-events-none absolute inset-0 z-0 translate-x-10 rounded-full blur-[80px] -translate-y-10"
        />
        <DsGlassSurface
          class="hero-ref-card pointer-events-auto relative z-10 ml-auto box-border w-full max-w-[500px] overflow-hidden rounded-[32px] p-10 md:p-12"
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
              <Icon
                name="ph:brackets-curly-bold"
                class="size-6 color-sand-11 transition-colors group-hover:color-pureWhite"
              />
              <div class="flex flex-col gap-1">
                <p
                  class="font-geist-600 m-0 text-base tracking-wide text-pureWhite"
                >
                  Semantic Token Sets
                </p>
                <p
                  class="font-geist-300 m-0 text-sm color-sand-11 leading-relaxed"
                >
                  Surface, text, accent and state colors tuned
                  for dark-first UIs.
                </p>
              </div>
            </div>

            <div class="group flex items-start gap-6">
              <Icon
                name="ph:sliders"
                class="size-6 color-sand-11 transition-colors group-hover:color-pureWhite"
              />
              <div class="flex flex-col gap-1">
                <p
                  class="font-geist-600 m-0 text-base tracking-wide text-pureWhite"
                >
                  Live Multi-Preview
                </p>
                <p
                  class="font-geist-300 m-0 text-sm color-sand-11 leading-relaxed"
                >
                  Validate themes in editor, docs, and
                  terminal-style previews.
                </p>
              </div>
            </div>

            <div class="group flex items-start gap-6">
              <Icon
                name="ph:export-bold"
                class="size-6 color-sand-11 transition-colors group-hover:color-pureWhite"
              />
              <div class="flex flex-col gap-1">
                <p
                  class="font-geist-600 m-0 text-base tracking-wide text-pureWhite"
                >
                  Export-Ready Output
                </p>
                <p
                  class="font-geist-300 m-0 text-sm color-sand-11 leading-relaxed"
                >
                  Ship JSON tokens and theme files with
                  consistent naming.
                </p>
              </div>
            </div>
          </div>
        </DsGlassSurface>
      </div>
    </div>

    <div
      v-else
      class="mx-auto h-full max-w-[1180px] w-full flex flex-col justify-start px-5 pb-8 pt-28 sm:pt-30"
    >
      <p
        class="font-geist-mono-500 mb-4 text-[11px] tracking-[0.24em] uppercase text-pureWhite/56"
      >
        Minimal Editorial
      </p>

      <h1
        class="hero-headline-glow font-geist-700 max-w-[10.5ch] text-[clamp(3.9rem,9.2vw,9.2rem)] leading-[0.86] tracking-[-0.035em] text-pureWhite"
      >
        <template
          v-for="(line, index) in headlineLines"
          :key="`${line}-${index}`"
        >
          <span>{{ line }}</span>
          <br v-if="index < headlineLines.length - 1">
        </template>
      </h1>

      <p
        class="font-geist-400 sm: mt-6 max-w-[48ch] text-[15px] leading-[1.5] text-pureWhite/71"
      >
        {{ body }}
      </p>

      <div class="mt-9 flex flex-wrap items-center gap-3.5">
        <NuxtLink
          to="/themes"
          class="font-geist-600 pointer-events-auto inline-flex items-center justify-center border rounded-[999px] px-7 py-2.5 text-[13px] no-underline transition-all border-pureWhite/92 sm:px-8 sm:text-[14px] !text-pureBlack !bg-pureWhite hover:-translate-y-0.5 hover:!bg-pureWhite/92"
        >
          {{ mainCtaText }}
        </NuxtLink>
        <NuxtLink
          to="/docs"
          class="font-geist-500 pointer-events-auto border rounded-[999px] bg-[rgba(255,255,255,0.06)] px-7 py-2.5 text-[13px] no-underline shadow-[0_8px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl transition-all border-pureWhite/20 hover:bg-[rgba(255,255,255,0.1)] sm:px-8 sm:text-[14px] !text-pureWhite/82 hover:border-pureWhite/35 hover:!text-pureWhite/92"
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
