<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useCodexPageSeo({
  title: 'Documentation',
  description:
    'How Codex maps theme JSON to UI tokens: installation, quick start, preset sources, and export workflow for OpenAI Codex themes.',
  keywords: ['Codex JSON', 'theme format', 'installation', 'export'],
})

const tocSections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'installation', label: 'Installation' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'codex-json-format', label: 'Codex JSON Format' },
  { id: 'theme-generation', label: 'Theme Generation' },
  { id: 'preset-sources', label: 'Preset Sources' },
  { id: 'reference', label: 'Reference' },
  { id: 'known-limitations', label: 'Known Limitations' },
  { id: 'disclaimer', label: 'Disclaimer' },
] as const
</script>

<template>
  <main class="docs-page antialiased">
    <DocsTocSidebar :sections="tocSections" />

    <section class="docs-main relative z-10 lg:ml-72">
      <div class="mx-auto max-w-4xl px-6 pb-28 lg:px-0 sm:px-8 lg:pb-40">
        <header
          class="pb-18 pt-[calc(var(--hero-top-offset)+44px)] lg:pb-20 lg:pt-42"
        >
          <div class="mb-8">
            <p
              class="font-geist-400 mb-3 text-[clamp(2.1rem,4.4vw,4.9rem)] color-sand-8 leading-17 tracking-[-0.02em] uppercase"
            >
              Dive Into
            </p>
            <h1
              class="text-[clamp(2.6rem,6.4vw,6rem)] leading-17 tracking-tight color-pureWhite"
            >
              <span class="font-geist-700">Theme</span>
              <span
                class="font-imbue-400 ml-2 color-[#10b981] italic"
              >studio</span>
            </h1>
          </div>
          <p
            class="font-geist-300 max-w-2xl text-[clamp(1.05rem,1.4vw,1.32rem)] color-sand-11 leading-normal"
          >
            A quick primer on how Codex maps a theme JSON payload to
            interface tokens so you can shape your own theme from
            that contract.
          </p>
        </header>

        <DocsSectionIntroduction />
        <DocsSectionInstallation />
        <DocsSectionQuickStart />
        <DocsSectionCodexJsonFormat />
        <DocsSectionThemeGenerationAlgorithm />
        <DocsSectionPresetSources />
        <DocsSectionReference />
        <DocsSectionKnownLimitations />
        <DocsSectionDisclaimer />
      </div>
    </section>
  </main>
</template>
