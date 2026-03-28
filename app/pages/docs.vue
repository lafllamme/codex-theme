<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'

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

const tocSections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'installation', label: 'Installation' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'codex-json-format', label: 'Codex JSON Format' },
  { id: 'theme-generation-algorithm', label: 'Theme Generation Algorithm' },
  { id: 'preset-sources', label: 'Preset Sources (iTerm2 + Curated)' },
  { id: 'reference', label: 'Reference' },
  { id: 'known-limitations', label: 'Known Limitations' },
] as const

type TocSectionId = (typeof tocSections)[number]['id']

const activeSection = ref<TocSectionId>('introduction')
const scrollContainer = ref<HTMLElement | null>(null)

const navIndicatorStyle = computed(() => {
  const index = tocSections.findIndex(section => section.id === activeSection.value)
  const safeIndex = Math.max(index, 0)
  return {
    transform: `translateY(${safeIndex * 44}px)`,
  }
})

function updateActiveSectionFromScroll() {
  if (!scrollContainer.value)
    return

  const container = scrollContainer.value
  const activationOffset = 150
  const marker = container.scrollTop + activationOffset
  const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 2

  let currentSection: TocSectionId = tocSections[0].id

  for (const [index, item] of tocSections.entries()) {
    const section = document.getElementById(item.id)
    if (!section)
      continue

    const sectionTop = section.offsetTop
    const isLastSection = index === tocSections.length - 1

    if (isAtBottom && isLastSection) {
      currentSection = item.id
      break
    }

    if (sectionTop <= marker)
      currentSection = item.id
  }

  activeSection.value = currentSection
}

function scrollToSection(id: TocSectionId) {
  const section = document.getElementById(id)
  if (!section)
    return

  if (scrollContainer.value) {
    const containerRect = scrollContainer.value.getBoundingClientRect()
    const sectionRect = section.getBoundingClientRect()
    const topOffset = 148
    const targetTop = scrollContainer.value.scrollTop + (sectionRect.top - containerRect.top) - topOffset

    scrollContainer.value.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth',
    })
  }
  else {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  if (window.location.hash !== `#${id}`)
    window.history.replaceState(null, '', `#${id}`)
}

function handleTocClick(event: MouseEvent, id: TocSectionId) {
  event.preventDefault()
  activeSection.value = id
  scrollToSection(id)
}

onMounted(() => {
  scrollContainer.value = document.querySelector('[data-app-scroll-container]') as HTMLElement | null

  const currentHash = window.location.hash.replace('#', '')
  if (tocSections.some(section => section.id === currentHash))
    activeSection.value = currentHash as TocSectionId

  updateActiveSectionFromScroll()
  useEventListener(scrollContainer, 'scroll', updateActiveSectionFromScroll, { passive: true })
})
</script>

<template>
  <main class="docs-page antialiased">
    <aside class="docs-sidebar fixed bottom-0 left-0 top-0 z-40 hidden w-72 px-8 py-10 lg:flex lg:flex-col">
      <div class="flex flex-1 flex-col justify-start pt-[calc(3rem+var(--hero-top-offset))]">
        <div class="group mb-7 flex items-center gap-2 -ml-2">
          <Icon name="ph:book-open-text" class="size-5 color-sand-11 group-hover:hidden" />
          <Icon name="ph:book-open-text-fill" class="hidden size-5 color-sand-11 group-hover:block" />
          <p class="font-geist-mono-500 text-[11px] color-sand-11 leading-none tracking-[0.22em] uppercase">
            Documentation
          </p>
        </div>

        <nav class="docs-toc-track relative flex flex-col gap-6">
          <div class="nav-indicator" :style="navIndicatorStyle" />
          <div
            v-for="item in tocSections"
            :key="item.id"
            class="pl-5 text-sm transition-colors ease-out"
            :class="activeSection === item.id ? 'color-pureWhite' : 'color-sand-10 hover:color-[#10b981]'"
          >
            <a
              :href="`#${item.id}`"
              class="font-geist font-light transition-colors"
              @click="handleTocClick($event, item.id)"
            >
              {{ item.label }}
            </a>
          </div>
        </nav>
      </div>

      <div class="mt-auto">
        <NuxtLink
          to="/"
          class="text-text-tertiary inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs transition-all duration-200 hover:text-pureWhite/82 hover:bg-pureWhite/6"
        >
          <Icon name="ph:arrow-left" class="h-3 w-3" />
          Back to Home
        </NuxtLink>
      </div>
    </aside>

    <section class="docs-main relative z-10 lg:ml-72">
      <div class="mx-auto max-w-4xl px-6 pb-28 lg:px-16 sm:px-8 lg:pb-40">
        <header class="pb-18 pt-[calc(var(--hero-top-offset)+44px)] lg:pb-24 lg:pt-32">
          <div class="mb-8">
            <p class="font-geist-400 mb-3 text-[clamp(2.1rem,4.4vw,4.9rem)] color-sand-10 leading-4 tracking-[-0.02em] uppercase">
              Dive Into
            </p>
            <h1 class="text-white text-[clamp(2.6rem,6.4vw,6rem)] leading-4 tracking-tight">
              <span class="font-geist-700">Theme</span>
              <span class="font-imbue-400 ml-2 color-[#10b981] italic">studio</span>
            </h1>
          </div>
          <p class="text-text-secondary font-geist-300 max-w-2xl text-[clamp(1.05rem,1.4vw,1.32rem)] leading-relaxed">
            Builder-first documentation for Codex Theme Studio: how to build themes fast, how the Codex JSON contract works, and how generation stays reproducible.
          </p>
        </header>

        <section id="introduction" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              Introduction
            </h2>
          </div>
          <div class="docs-section-content">
            <p>
              Codex Theme Studio helps you generate, iterate, and export Codex-compatible themes with a predictable contract. The product is optimized for fast visual iteration first, then technical control when you need it.
            </p>
            <p>
              This page is intentionally single-page and package-style: start with Installation and Quick Start if you just want a working theme, then continue into JSON and algorithm details if you want to customize or automate.
            </p>
          </div>
        </section>

        <section id="installation" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              Installation
            </h2>
          </div>
          <div class="docs-section-content">
            <p>
              Choose the path that matches your goal. Most users should use the web builder directly.
            </p>
            <div class="border-borderSubtle bg-surface/70 flex flex-col gap-6 border rounded-xl p-8">
              <div>
                <h4 class="text-brand-400 font-geist-mono-500 mb-2 text-sm tracking-[0.18em] uppercase">
                  Option A (Primary)
                </h4>
                <p class="text-sm">
                  Use the <span class="text-text-primary">web builder</span> to generate, randomize, tune, and export a Codex JSON payload without local setup.
                </p>
              </div>
              <div>
                <h4 class="text-brand-400 font-geist-mono-500 mb-2 text-sm tracking-[0.18em] uppercase">
                  Option B (Secondary, Coming Soon)
                </h4>
                <p class="text-sm">
                  Use the repository + scripts pipeline for local reproducible generation and automation workflows. Public repo/script docs will be linked in the Reference section once released.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="quick-start" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              Quick Start
            </h2>
          </div>
          <div class="docs-section-content">
            <p>
              If you only want a usable theme quickly, follow this path and skip internals for now.
            </p>
            <div class="border-borderSubtle bg-surface flex flex-col gap-5 border rounded-xl p-8 text-sm">
              <div class="flex gap-4">
                <span class="text-brand-400 font-geist-mono-500">01</span>
                <p>Open the builder and select a base preset.</p>
              </div>
              <div class="flex gap-4">
                <span class="text-brand-400 font-geist-mono-500">02</span>
                <p>Use randomize to explore variants, then tweak accent/surface/ink for final tone.</p>
              </div>
              <div class="flex gap-4">
                <span class="text-brand-400 font-geist-mono-500">03</span>
                <p>Adjust contrast and semantic colors to improve readability in your real code context.</p>
              </div>
              <div class="flex gap-4">
                <span class="text-brand-400 font-geist-mono-500">04</span>
                <p>Export your payload, import it into Codex, and run a quick visual sanity check.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="codex-json-format" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              Codex JSON Format
            </h2>
          </div>
          <div class="docs-section-content">
            <p>
              Payload exchange uses the <code class="text-text-primary text-xs">codex-theme-v1:</code> prefix as parser signature. The contract is stable and designed for predictable import/export.
            </p>
            <div class="space-y-8">
              <div>
                <h4 class="text-brand-400 font-geist-mono-500 mb-2 text-sm tracking-[0.18em] uppercase">
                  Top-Level Fields
                </h4>
                <p class="text-sm">
                  <code>codeThemeId</code> (theme identity), <code>variant</code> (<code>dark</code>/<code>light</code>), and <code>theme</code> (all visual tokens).
                </p>
              </div>
              <div>
                <h4 class="text-brand-400 font-geist-mono-500 mb-2 text-sm tracking-[0.18em] uppercase">
                  Theme Fields
                </h4>
                <p class="text-sm">
                  <code>accent</code>, <code>surface</code>, <code>ink</code>, <code>contrast</code>, <code>opaqueWindows</code>, <code>fonts</code> (<code>ui</code>, <code>code</code>), and <code>semanticColors</code>.
                </p>
              </div>
            </div>
            <div class="relative mt-8">
              <div class="bg-brand-500/5 absolute inset-0 rounded-3xl blur-2xl" />
              <pre class="text-text-secondary border-borderSubtle bg-black/40 relative overflow-x-auto border rounded-2xl p-8 text-xs leading-relaxed"><code>{{ schemaExample }}</code></pre>
            </div>
            <div class="border-borderSubtle mt-8 overflow-hidden border rounded-xl">
              <table class="w-full text-left text-sm">
                <thead class="bg-surface/70 text-text-primary">
                  <tr>
                    <th class="font-geist-500 px-4 py-3">
                      Field
                    </th>
                    <th class="font-geist-500 px-4 py-3">
                      Visual Effect
                    </th>
                    <th class="font-geist-500 px-4 py-3">
                      Edit Priority
                    </th>
                  </tr>
                </thead>
                <tbody class="text-text-secondary">
                  <tr class="border-borderSubtle/70 border-t">
                    <td class="px-4 py-3">
                      <code>accent</code>
                    </td>
                    <td class="px-4 py-3">
                      Interactive highlights, emphasis color, visual personality.
                    </td>
                    <td class="px-4 py-3">
                      First
                    </td>
                  </tr>
                  <tr class="border-borderSubtle/70 border-t">
                    <td class="px-4 py-3">
                      <code>surface</code>
                    </td>
                    <td class="px-4 py-3">
                      Background plane and overall depth impression.
                    </td>
                    <td class="px-4 py-3">
                      First
                    </td>
                  </tr>
                  <tr class="border-borderSubtle/70 border-t">
                    <td class="px-4 py-3">
                      <code>ink</code>
                    </td>
                    <td class="px-4 py-3">
                      Foreground text legibility and perceived sharpness.
                    </td>
                    <td class="px-4 py-3">
                      First
                    </td>
                  </tr>
                  <tr class="border-borderSubtle/70 border-t">
                    <td class="px-4 py-3">
                      <code>contrast</code>
                    </td>
                    <td class="px-4 py-3">
                      Global separation between content and background.
                    </td>
                    <td class="px-4 py-3">
                      As needed
                    </td>
                  </tr>
                  <tr class="border-borderSubtle/70 border-t">
                    <td class="px-4 py-3">
                      <code>semanticColors.*</code>
                    </td>
                    <td class="px-4 py-3">
                      Status and meaning tokens (diffs, skills, contextual cues).
                    </td>
                    <td class="px-4 py-3">
                      After base tones
                    </td>
                  </tr>
                  <tr class="border-borderSubtle/70 border-t">
                    <td class="px-4 py-3">
                      <code>fonts</code>, <code>opaqueWindows</code>
                    </td>
                    <td class="px-4 py-3">
                      Runtime and rendering behavior adjustments.
                    </td>
                    <td class="px-4 py-3">
                      Rarely
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="theme-generation-algorithm" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              Theme Generation Algorithm
            </h2>
          </div>
          <div class="docs-section-content">
            <p>
              Generation is pipeline-based and deterministic: same input palette + same settings produce the same output payload.
            </p>
            <div class="border-borderSubtle bg-surface flex flex-col gap-6 border rounded-xl p-8">
              <div class="flex gap-4">
                <span class="text-brand-400 font-geist-mono-500 text-sm">01</span>
                <p class="text-sm">
                  Parse source palette into normalized color primitives.
                </p>
              </div>
              <div class="flex gap-4">
                <span class="text-brand-400 font-geist-mono-500 text-sm">02</span>
                <p class="text-sm">
                  Normalize semantics (<code>accent</code>, <code>surface</code>, <code>ink</code>, semantic colors) and evaluate compatibility.
                </p>
              </div>
              <div class="flex gap-4">
                <span class="text-brand-400 font-geist-mono-500 text-sm">03</span>
                <p class="text-sm">
                  Infer <code>variant</code> and finalize Codex JSON output.
                </p>
              </div>
            </div>
            <p>
              Practical note: two different sources can converge visually after normalization because semantic mapping intentionally compresses wild palette variance into usable UI behavior.
            </p>
          </div>
        </section>

        <section id="preset-sources" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              Preset Sources (iTerm2 + Curated)
            </h2>
          </div>
          <div class="docs-section-content">
            <p>
              Many presets are pre-generated from iTerm2-like source palettes, combined with curated in-house sets. All are converted into the same Codex JSON structure.
            </p>
            <p>
              This is intentional: the website remains the easiest creation path, while the repository/script path exists for reproducibility, local generation, and future automation workflows.
            </p>
          </div>
        </section>

        <section id="reference" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              Reference
            </h2>
          </div>
          <div class="docs-section-content">
            <ul class="text-sm space-y-3">
              <li>
                Repository (coming soon)
              </li>
              <li>
                Script documentation (coming soon)
              </li>
              <li>
                Codex schema/version reference (coming soon)
              </li>
            </ul>
          </div>
        </section>

        <section id="known-limitations" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              Known Limitations
            </h2>
          </div>
          <div class="docs-section-content pb-40">
            <p>
              Some syntax and semantic behavior remains constrained by upstream Codex mappings, so not every color token can be fully overridden in every editor context.
            </p>
            <a
              href="https://github.com/openai/codex/issues/14766"
              target="_blank"
              rel="noopener noreferrer"
              class="relative w-fit inline-flex items-center self-start gap-2 pb-0.5 text-sm after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#10b981] !text-[#10b981] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100"
            >
              View GitHub Discussion
              <Icon name="ph:arrow-square-out" class="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<style scoped>
.docs-page {
  background-color: #030507;
  color: #f8fafc;
}

.docs-sidebar {
  background: linear-gradient(to bottom, rgba(3, 5, 7, 0.8), rgba(3, 5, 7, 0.4));
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-indicator {
  position: absolute;
  left: 0;
  width: 2px;
  height: 24px;
  background: #10b981;
  box-shadow:
    0 0 8px rgba(16, 185, 129, 0.9),
    0 0 16px rgba(16, 185, 129, 0.35);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.docs-toc-track {
  padding-left: 1px;
}

.docs-toc-track::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(148, 163, 184, 0.22);
  box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.05);
}

.docs-section {
  position: relative;
  scroll-margin-top: calc(var(--hero-top-offset) + 96px);
}

.section-header {
  position: sticky;
  top: calc(var(--hero-top-offset) + 12px);
  z-index: 20;
  background: linear-gradient(to bottom, #030507 80%, transparent);
  padding-top: 4rem;
  padding-bottom: 2rem;
}

.docs-section-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 5rem;
  color: #94a3b8;
  line-height: 1.625;
}

@media (max-width: 1023px) {
  .docs-section {
    scroll-margin-top: calc(var(--hero-top-offset) + 112px);
  }

  .section-header {
    top: calc(var(--hero-top-offset) + 8px);
    padding-top: 2.25rem;
  }

  .docs-section-content {
    padding-bottom: 3.5rem;
  }
}
</style>
