<script setup lang="ts">
defineProps<{
  title: string
  /** e.g. ./imprint */
  commandLine: string
  subtitle: string
}>()

const config = useRuntimeConfig()
const siteName = computed(() => String(config.public.siteName))
const year = new Date().getFullYear()
const copyrightLine = computed(() => `© ${year} ${siteName.value} — all rights reserved`)
</script>

<template>
  <main
    class="legal-page-shell min-h-full bg-pureBlack font-geist-mono-400 text-pureWhite antialiased"
  >
    <header
      class="border-b-2 border-pureWhite pt-[calc(var(--hero-top-offset)+28px)] sm:pt-[calc(var(--hero-top-offset)+36px)]"
    >
      <div class="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
        <div class="mb-8">
          <NuxtLink
            to="/"
            class="font-geist-700 text-xs text-pureWhite/40 no-underline transition hover:text-pureWhite"
          >
            &lt; back /&gt;
          </NuxtLink>
        </div>
        <div class="mb-4">
          <span class="font-geist-700 text-xs text-pureWhite/40">$</span>
          <span class="font-geist-700 ml-2 text-xs">{{ commandLine }}</span>
        </div>
        <h1
          class="font-geist-700 mb-4 text-[clamp(2.25rem,9vw,3.75rem)] tracking-tight uppercase"
        >
          {{ title }}
        </h1>
        <p class="font-geist-400 text-sm text-pureWhite/60">
          {{ subtitle }}
        </p>
      </div>
    </header>

    <div class="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
      <slot />
    </div>

    <footer class="mt-16 border-t-2 border-pureWhite/20">
      <div class="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        <p class="mb-4 text-xs text-pureWhite/40">
          {{ copyrightLine }}
        </p>
        <div class="flex flex-wrap gap-8 font-geist-700 text-xs">
          <NuxtLink
            to="/imprint"
            class="text-pureWhite no-underline transition hover:opacity-50"
          >
            [imprint]
          </NuxtLink>
          <NuxtLink
            to="/privacy"
            class="text-pureWhite no-underline transition hover:opacity-50"
          >
            [privacy]
          </NuxtLink>
        </div>
      </div>
    </footer>
  </main>
</template>
