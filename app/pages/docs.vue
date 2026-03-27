<script setup lang="ts">
import CircularTextOrbit from '@/components/CircularTextOrbit.vue'

definePageMeta({
  layout: 'default',
})

const schemaExample = `codex-theme-v1:{
  "codeThemeId": "rose-pine",
  "variant": "dark",
  "theme": {
    "accent": "#ea9a97",
    "surface": "#232136",
    "ink": "#e0def4",
    "contrast": 60,
    "opaqueWindows": false,
    "fonts": { "ui": null, "code": null },
    "semanticColors": {
      "diffAdded": "#9ccfd8",
      "diffRemoved": "#908caa",
      "skill": "#c4a7e7"
    }
  }
}`
</script>

<template>
  <main class="p-0">
    <section class="sm:border-white/8 relative mx-auto max-w-[1600px] w-full overflow-visible border-0 rounded-none sm:border sm:rounded-[30px]">
      <div class="relative z-10 min-h-screen sm:min-h-[88vh]">
        <div class="pointer-events-auto absolute left-0 z-1 h-[52px] w-full -top-12 sm:h-[60px]">
          <DsHeader />
        </div>

        <div class="pointer-events-none relative z-10  mx-auto mt-[var(--hero-top-offset)] -translate-y-full max-w-[1320px] px-5 lg:px-12 sm:px-8">
          <NuxtLink
            to="/"
            class="font-geist-500 pointer-events-auto inline-flex items-center gap-2 border rounded-full px-3.5 py-2 text-[13px] no-underline backdrop-blur-md transition-all text-pureWhite/88 bg-pureWhite/6 border-pureWhite/18 hover:text-pureWhite hover:bg-pureWhite/10 hover:border-pureWhite/30 hover:-translate-x-0.5"
          >
            <Icon name="ph:arrow-left" class="h-[14px] w-[14px]" aria-hidden="true" />
            Back to Home
          </NuxtLink>
        </div>

        <div class="relative z-20 mx-auto max-w-[1320px] px-5 pb-20 pt-16 lg:px-12 sm:px-8 lg:pt-24 sm:pt-20">
          <CircularTextOrbit
            text-class="text-pureWhite font-geist-900"
            wrap-class="absolute top-0 right-0 hidden lg:block -translate-x-1/4"
            orbit-class="w-[clamp(120px,10vw,168px)] h-[clamp(120px,10vw,168px)] text-[clamp(0.82rem,0.9vw,1.14rem)]"
          />
          <div class="mb-8 max-w-[920px] sm:mb-10">
            <p class="font-geist-mono-500 text-[10px] color-sand-11 tracking-[0.24em] uppercase sm:text-[11px]">
              Documentation
            </p>
            <h1 class="font-geist-700 mt-4 text-[clamp(2rem,5.4vw,4.3rem)] leading-[0.92] tracking-[-0.024em] text-pureWhite">
              How Codex Theme Studio Works
            </h1>
            <p class="font-geist-400 mt-5 max-w-[62ch] text-[15px] leading-relaxed text-pureWhite/74 sm:text-[17px]">
              This page explains the core idea behind the theme generator, the JSON import/export format, and why some code themes are still partially hardcoded upstream.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <article class="docs-glass-card p-4.5 lg:col-span-7 lg:p-6 sm:p-5.5">
              <h2 class="font-geist-600 text-[clamp(1.48rem,1.35rem+0.9vw,2rem)] leading-tight text-pureWhite">
                1) Core Idea
              </h2>
              <p class="font-geist-400 mt-3.5 text-[clamp(1.02rem,0.96rem+0.28vw,1.2rem)] leading-relaxed text-pureWhite/72">
                We intentionally separate UI colors, semantic colors, and code theme IDs. That keeps the system stable, exportable, and compatible with future Codex updates.
              </p>

              <ul class="mt-4.5 text-pureWhite/78 space-y-2">
                <li class="flex items-start gap-3">
                  <Icon name="ph:check-circle" class="mt-[1px] h-[20px] w-[20px] text-[var(--un-preset-radix-sand11)]" aria-hidden="true" />
                  <span class="font-geist-400 text-[clamp(1rem,0.95rem+0.24vw,1.14rem)] leading-[1.45] text-pureWhite/82">Token-driven system instead of hardcoded UI values.</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ph:check-circle" class="mt-[1px] h-[20px] w-[20px] text-[var(--un-preset-radix-sand11)]" aria-hidden="true" />
                  <span class="font-geist-400 text-[clamp(1rem,0.95rem+0.24vw,1.14rem)] leading-[1.45] text-pureWhite/82">Single format for export, sharing, and re-import.</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ph:check-circle" class="mt-[1px] h-[20px] w-[20px] text-[var(--un-preset-radix-sand11)]" aria-hidden="true" />
                  <span class="font-geist-400 text-[clamp(1rem,0.95rem+0.24vw,1.14rem)] leading-[1.45] text-pureWhite/82">Dark-first readability with a pure black / pure white baseline.</span>
                </li>
              </ul>
            </article>

            <article class="docs-glass-card docs-glass-card--thin p-4.5 lg:col-span-5 lg:p-6 sm:p-5.5">
              <h2 class="font-geist-600 text-[clamp(1.2rem,1.7vw,1.6rem)] leading-tight text-pureWhite">
                2) JSON Schema
              </h2>
              <p class="font-geist-400 mt-3.5 text-[14px] leading-relaxed text-pureWhite/70 sm:text-[15px]">
                Theme exports use the
                <code class="mx-1 rounded px-1.5 py-0.5 text-pureWhite/90 bg-pureWhite/10">codex-theme-v1:</code>
                prefix followed by a JSON payload.
              </p>

              <pre class="mt-4.5 overflow-x-auto border rounded-2xl p-4 text-[12px] leading-relaxed text-pureWhite/86 bg-pureBlack/55 border-pureWhite/12"><code>{{ schemaExample }}</code></pre>
            </article>

            <article class="docs-glass-card p-4.5 lg:col-span-12 lg:p-6 sm:p-5.5">
              <h2 class="font-geist-600 text-[clamp(1.2rem,1.7vw,1.6rem)] leading-tight text-pureWhite">
                3) Limitation: Hardcoded Code Themes
              </h2>
              <p class="font-geist-400 mt-3.5 max-w-[86ch] text-[14px] leading-relaxed text-pureWhite/70 sm:text-[15px]">
                Codex currently enforces built-in mapping for some code themes. Because of that, fully custom syntax overrides are not always possible yet.
                We reference this limitation explicitly here for transparency.
              </p>

              <a
                href="https://github.com/openai/codex/issues/14766"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-5 inline-flex items-center gap-2 border rounded-full px-4 py-2 text-[14px] no-underline transition-colors text-pureWhite/92 bg-pureWhite/6 border-pureWhite/24 hover:bg-pureWhite/12"
              >
                GitHub issue #14766
                <Icon name="ph:arrow-up-right-bold" class="h-[14px] w-[14px]" aria-hidden="true" />
              </a>
            </article>

            <article class="docs-glass-card p-4.5 lg:col-span-7 lg:p-6 sm:p-5.5">
              <h2 class="font-geist-600 text-[clamp(1.2rem,1.7vw,1.6rem)] leading-tight text-pureWhite">
                4) Runtime Mapping Pipeline
              </h2>
              <p class="font-geist-400 mt-3.5 text-[14px] leading-relaxed text-pureWhite/70 sm:text-[15px]">
                At runtime, the app maps your exported payload into shell and workbench CSS variables, then binds those values to all preview surfaces.
              </p>
              <ol class="mt-4.5 text-pureWhite/78 space-y-2.5">
                <li class="font-geist-400 text-[14px] sm:text-[15px]">
                  1. Parse `codex-theme-v1` payload.
                </li>
                <li class="font-geist-400 text-[14px] sm:text-[15px]">
                  2. Resolve semantic tokens and code theme.
                </li>
                <li class="font-geist-400 text-[14px] sm:text-[15px]">
                  3. Apply variables to UI shell, previews, and syntax blocks.
                </li>
              </ol>
            </article>

            <article class="docs-glass-card p-4.5 lg:col-span-5 lg:p-6 sm:p-5.5">
              <h2 class="font-geist-600 text-[clamp(1.2rem,1.7vw,1.6rem)] leading-tight text-pureWhite">
                5) Design Rules
              </h2>
              <ul class="mt-4 text-pureWhite/78 space-y-2.5">
                <li class="flex items-start gap-2.5">
                  <Icon name="ph:dot-outline-fill" class="mt-0.75 h-[15px] w-[15px] text-[var(--un-preset-radix-sand12)]" aria-hidden="true" />
                  <span class="font-geist-400 text-[14px] sm:text-[15px]">Pure black and pure white as baseline anchors.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <Icon name="ph:dot-outline-fill" class="mt-0.75 h-[15px] w-[15px] text-[var(--un-preset-radix-sand12)]" aria-hidden="true" />
                  <span class="font-geist-400 text-[14px] sm:text-[15px]">Accent colors only for hierarchy and states.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <Icon name="ph:dot-outline-fill" class="mt-0.75 h-[15px] w-[15px] text-[var(--un-preset-radix-sand12)]" aria-hidden="true" />
                  <span class="font-geist-400 text-[14px] sm:text-[15px]">Readable contrast before decorative styling.</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.docs-glass-card {
  background: linear-gradient(145deg, rgba(18, 37, 28, 0.38) 0%, rgba(4, 12, 9, 0.56) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.25rem;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow:
    0 14px 34px rgba(0, 0, 0, 0.34),
    inset 0 1px 18px rgba(255, 255, 255, 0.02);
}

.docs-glass-card--thin {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
