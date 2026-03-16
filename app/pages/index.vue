<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <main class="p-4 sm:p-6 lg:p-8">
    <section class="relative mx-auto min-h-[86vh] max-w-[1600px] overflow-hidden border border-[var(--un-preset-radix-mint6A)] rounded-3xl bg-black">
      <Dither
        :wave-speed="0.05"
        :wave-frequency="3"
        :wave-amplitude="0.3"
        :wave-color="[0.06, 0.68, 0.44]"
        :color-num="4"
        :pixel-size="2"
        :disable-animation="false"
        :enable-mouse-interaction="true"
        :mouse-radius="1"
      />

      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,0,0,0.05),rgba(0,0,0,0.56)_45%,rgba(0,0,0,0.88)_100%)]" />

      <div class="relative z-10 flex min-h-[86vh] flex-col items-center px-4 py-6 sm:px-8 lg:px-12">
        <nav class="w-full max-w-[980px] border border-white/14 rounded-full bg-black/58 px-6 py-3 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="h-8 w-8 grid place-items-center border border-[var(--un-preset-radix-mint7)] rounded-full bg-[var(--un-preset-radix-mint3A)] text-[var(--un-preset-radix-mint11)]">
                <span class="font-geist-mono-700 text-xs">LF</span>
              </div>
              <p class="font-geist-600 text-[30px] text-white leading-none">
                Laflam
                <span class="font-geist-400 text-[15px] text-white/76">Theme Lab</span>
              </p>
            </div>

            <div class="flex items-center gap-6 text-white/90">
              <NuxtLink to="/" class="font-geist-500 text-sm transition-colors hover:text-[var(--un-preset-radix-mint10)]">
                Home
              </NuxtLink>
              <NuxtLink to="/old.view" class="font-geist-500 text-sm transition-colors hover:text-[var(--un-preset-radix-mint10)]">
                Docs
              </NuxtLink>
            </div>
          </div>
        </nav>

        <div class="mt-20 flex flex-1 flex-col items-center justify-center text-center">
          <div class="border border-[var(--un-preset-radix-mint7)] rounded-full bg-[var(--un-preset-radix-mint3A)] px-6 py-2 backdrop-blur-md">
            <p class="font-geist-500 text-[18px] text-[var(--un-preset-radix-mint11)]">
              Dynamic Dither Background
            </p>
          </div>

          <h1 class="font-geist-mono-700 mt-8 max-w-4xl text-[clamp(2.4rem,6vw,6rem)] text-white leading-[0.95]">
            Codex Theme Generator
          </h1>

          <p class="font-geist-400 mt-5 max-w-2xl text-[15px] text-white/78 leading-relaxed sm:text-[18px]">
            Build, preview and export dark-first Codex themes with live tokens, mint accents, and production-ready output.
          </p>

          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button class="font-geist-600 appearance-none border border-white/18 rounded-full bg-white px-9 py-3 text-[17px] text-black transition-transform hover:translate-y-[-1px]">
              Get Started
            </button>
            <NuxtLink
              to="/old.view"
              class="font-geist-500 border border-white/18 rounded-full bg-black/44 px-9 py-3 text-[17px] text-white/84 backdrop-blur-xl transition-colors hover:border-[var(--un-preset-radix-mint7)] hover:text-[var(--un-preset-radix-mint10)]"
            >
              Open Old View
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
