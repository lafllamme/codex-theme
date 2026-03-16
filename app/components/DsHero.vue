<script setup lang="ts">
interface DsHeroProps {
  headline?: string
  body?: string
  mainCtaText?: string
  secondCtaText?: string
}

withDefaults(defineProps<DsHeroProps>(), {
  headline: 'Codex Theme Generator',
  body: 'Create, preview, and export Codex themes with live tokens, instant contrast checks, and ready-to-share presets.',
  mainCtaText: 'Get Started',
  secondCtaText: 'Learn More',
})
</script>

<template>
  <div class="pointer-events-none absolute inset-0 select-none">
    <div class="pointer-events-auto absolute left-0 top-5 z-1 h-[60px] w-full sm:top-6">
      <DsHeader />
    </div>

    <div class="mx-auto flex h-full w-full max-w-[1180px] flex-col items-center justify-center px-4 pt-28 pb-8 text-center sm:pt-30 sm:pb-10">
      <h1
        class="font-geist-700 text-white max-w-4xl text-[clamp(2.9rem,6.1vw,6.35rem)] leading-[0.96]"
      >
        Codex Theme
        <br>
        Generator
      </h1>

      <p class="font-geist-400 text-white/76 mt-7 max-w-[64ch] text-[15px] leading-relaxed sm:text-[18px]">
        {{ body }}
      </p>

      <div class="mt-9 flex flex-wrap items-center justify-center gap-4">
        <NuxtLink
          to="/themes"
          class="border-white/90 font-geist-500 pointer-events-auto border rounded-[50px] bg-[rgba(255,255,255,0.98)] px-6 py-2 text-[12px] no-underline shadow-[0_8px_22px_rgba(0,0,0,0.24)] transition-all duration-200 ease-in-out hover:translate-y-[-1px] hover:bg-[rgba(255,255,255,0.92)] md:px-10 md:py-3 md:text-[14px] !text-[rgba(0,0,0,0.92)]"
        >
          {{ mainCtaText }}
        </NuxtLink>
        <NuxtLink
          to="/old.view"
          class="font-geist-500 !text-white/50 pointer-events-auto border-[1px] border-[rgba(255,255,255,0.2)] rounded-full border-solid bg-[rgba(255,255,255,0.05)] px-6 py-2 text-[12px] no-underline shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px] transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] md:px-10 md:py-3 md:text-[14px] hover:-translate-y-0.5"
        >
          {{ secondCtaText }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
