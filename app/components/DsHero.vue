<script setup lang="ts">
interface DsHeroProps {
  headline?: string
  body?: string
  mainCtaText?: string
  secondCtaText?: string
}

withDefaults(defineProps<DsHeroProps>(), {
  headline: 'Codex Theme Generator',
  body: 'Build, preview and export dark-first Codex themes with live tokens, mint accents, and production-ready output.',
  mainCtaText: 'Get Started',
  secondCtaText: 'Learn More',
})
</script>

<template>
  <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center select-none">
    <div class="pointer-events-auto absolute top-[2em] left-0 z-1 w-full h-[60px]">
      <DsHeader />
    </div>

    <div class="flex flex-col items-center px-4 text-center">
      <h1
        class="mt-4 max-w-4xl font-geist-700 text-[clamp(2.8rem,6vw,6.3rem)] text-white leading-[0.98]"
      >
        Codex Theme
        <br>
        Generator
      </h1>

      <p class="mt-7 max-w-2xl font-geist-400 text-[15px] text-white/76 leading-relaxed sm:text-[18px]">
        {{ body }}
      </p>

      <div class="mt-12 flex flex-wrap items-center justify-center gap-4">
        <NuxtLink
          to="/themes"
          class="pointer-events-auto border border-white/90 rounded-[50px] bg-[rgba(255,255,255,0.98)] px-6 py-2 font-geist-500 text-[12px] !text-[rgba(0,0,0,0.92)] no-underline shadow-[0_8px_22px_rgba(0,0,0,0.24)] transition-all duration-200 ease-in-out hover:translate-y-[-1px] hover:bg-[rgba(255,255,255,0.92)] md:px-10 md:py-3 md:text-[14px]"
        >
          {{ mainCtaText }}
        </NuxtLink>
        <NuxtLink
          to="/old.view"
          class="pointer-events-auto border border-white/20 rounded-full bg-[rgba(255,255,255,0.05)] px-6 py-2 font-geist-500 text-[12px] !text-white/50 no-underline shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px] backdrop-saturate-[65%] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(255,255,255,0.1)] md:px-10 md:py-3 md:text-[14px]"
        >
          {{ secondCtaText }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
