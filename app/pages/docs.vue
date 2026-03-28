<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

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
  { id: 'preset-sources', label: 'Preset Sources' },
  { id: 'design-intent', label: 'Design Intent' },
  { id: 'algorithm', label: 'The Algorithm' },
  { id: 'json-reference', label: 'JSON Reference' },
  { id: 'import-export', label: 'Import & Export' },
  { id: 'limitations', label: 'Known Limitations' },
] as const

type TocSectionId = (typeof tocSections)[number]['id']

const activeSection = ref<TocSectionId>('preset-sources')

const navIndicatorStyle = computed(() => {
  const index = tocSections.findIndex(section => section.id === activeSection.value)
  return {
    transform: `translateY(${Math.max(index, 0) * 44}px)`,
  }
})

function updateActiveSectionFromScroll() {
  let currentSection: TocSectionId = tocSections[0].id

  for (const item of tocSections) {
    const section = document.getElementById(item.id)
    if (!section)
      continue

    if (window.pageYOffset >= section.offsetTop - 150)
      currentSection = item.id
  }

  activeSection.value = currentSection
}

function scrollToSection(id: TocSectionId) {
  const section = document.getElementById(id)
  if (!section)
    return

  section.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })

  if (window.location.hash !== `#${id}`)
    window.history.replaceState(null, '', `#${id}`)
}

function handleTocClick(event: MouseEvent, id: TocSectionId) {
  event.preventDefault()
  activeSection.value = id
  scrollToSection(id)
}

onMounted(() => {
  const currentHash = window.location.hash.replace('#', '')
  if (tocSections.some(section => section.id === currentHash))
    activeSection.value = currentHash as TocSectionId

  updateActiveSectionFromScroll()
  window.addEventListener('scroll', updateActiveSectionFromScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveSectionFromScroll)
})
</script>

<template>
  <main class="docs-page antialiased">
    <aside class="docs-sidebar fixed bottom-0 left-0 top-0 z-40 hidden w-72 px-8 py-10 lg:flex lg:flex-col">
      <div class="mb-12 flex items-center gap-3">
        <div class="border-brand-500/30 bg-brand-500/20 h-6 w-6 flex items-center justify-center border rounded">
          <div class="bg-brand-400 h-1.5 w-1.5 animate-pulse rounded-full" />
        </div>
        <span class="font-geist-mono-500 text-brand-400 text-xs tracking-[0.2em] uppercase">Documentation</span>
      </div>

      <nav class="border-borderSubtle relative flex flex-col gap-6 border-l">
        <div class="nav-indicator" :style="navIndicatorStyle" />
        <a
          v-for="item in tocSections"
          :key="item.id"
          :href="`#${item.id}`"
          class="font-geist-500 hover:text-brand-400 pl-6 text-sm transition-colors"
          :class="activeSection === item.id ? 'text-text-primary' : 'text-text-secondary'"
          @click="handleTocClick($event, item.id)"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="mt-auto">
        <NuxtLink to="/" class="text-text-tertiary hover:text-text-secondary flex items-center gap-2 text-xs transition-colors">
          <Icon name="ph:arrow-left" class="h-3 w-3" />
          Back to Theme Lab
        </NuxtLink>
      </div>
    </aside>

    <section class="docs-main relative z-10 lg:ml-72">
      <div class="mx-auto max-w-4xl px-6 pb-28 lg:px-16 sm:px-8 lg:pb-40">
        <header class="pb-18 pt-[calc(var(--hero-top-offset)+44px)] lg:pb-24 lg:pt-32">
          <h1 class="font-geist-300 text-white mb-8 text-[clamp(2.4rem,5.2vw,4.7rem)] leading-tight tracking-tight">
            How Codex Theme <br>
            <span class="font-geist-400 text-text-secondary italic">Studio Works</span>
          </h1>
          <p class="text-text-secondary font-geist-300 max-w-2xl text-[clamp(1.05rem,1.4vw,1.32rem)] leading-relaxed">
            An architectural overview of the theme generator core, the unified JSON contract, and the normalization pipeline for cross-platform theme portability.
          </p>
        </header>

        <section id="preset-sources" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              Preset Sources & Catalog Size
            </h2>
          </div>
          <div class="docs-section-content">
            <p>
              Codex Theme Studio combines curated flagship presets with converted terminal palettes and stores both in one unified payload format.
            </p>
            <p>
              The current catalog comprises <span class="text-text-primary">507 total presets</span> indexed in <code class="text-brand-400 px-1 text-xs">app/assets/theme-presets</code>. This includes 24 curated Codex designs and 483 converted assets.
            </p>
            <div class="grid grid-cols-1 gap-6 py-4 sm:grid-cols-2 sm:gap-8">
              <div class="border-brand-500/20 border-l pl-6">
                <div class="font-geist-300 text-white text-2xl">
                  507
                </div>
                <div class="text-text-tertiary mt-1 text-xs tracking-widest uppercase">
                  Active Presets
                </div>
              </div>
              <div class="border-brand-500/20 border-l pl-6">
                <div class="font-geist-300 text-white text-2xl">
                  484
                </div>
                <div class="text-text-tertiary mt-1 text-xs tracking-widest uppercase">
                  Raw Sources
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="design-intent" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              Design Intent
            </h2>
          </div>
          <div class="docs-section-content">
            <p>
              The system is contract-first. Themes are structured JSON payloads with a stable schema so import, export, and preview stay deterministic.
            </p>
            <p>
              Semantic keys describe usage intent (for example <code class="text-xs">theme.ink</code>) rather than raw palette positions, so visual behavior stays coherent across contexts.
            </p>
          </div>
        </section>

        <section id="algorithm" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              The Algorithm
            </h2>
          </div>
          <div class="docs-section-content">
            <p>
              Normalization follows a deterministic pipeline: parse source colors, derive variant from luminance, map semantic slots, and resolve compatible syntax theme ids.
            </p>
            <div class="border-borderSubtle bg-surface flex flex-col gap-6 border rounded-xl p-8">
              <div class="flex gap-4">
                <span class="text-brand-400 font-geist-mono-500 text-sm">01</span>
                <p class="text-sm">
                  Parse color sources into internal theme fields.
                </p>
              </div>
              <div class="flex gap-4">
                <span class="text-brand-400 font-geist-mono-500 text-sm">02</span>
                <p class="text-sm">
                  Map semantic slots and compute variant.
                </p>
              </div>
              <div class="flex gap-4">
                <span class="text-brand-400 font-geist-mono-500 text-sm">03</span>
                <p class="text-sm">
                  Normalize compatibility fields and export payload.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="json-reference" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              JSON Reference
            </h2>
          </div>
          <div class="docs-section-content">
            <div class="space-y-10">
              <div>
                <h4 class="text-brand-400 font-geist-mono-500 mb-2 text-sm">
                  Top-Level Keys
                </h4>
                <p class="max-w-xl text-sm">
                  <code>codeThemeId</code>, <code>variant</code>, and the <code>theme</code> object define global behavior and rendering compatibility.
                </p>
              </div>
              <div>
                <h4 class="text-brand-400 font-geist-mono-500 mb-2 text-sm">
                  Theme Object Keys
                </h4>
                <p class="max-w-xl text-sm">
                  Includes <code>accent</code>, <code>surface</code>, <code>ink</code>, <code>contrast</code>, <code>opaqueWindows</code>, <code>fonts.ui</code>, <code>fonts.code</code>, and semantic color keys.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="import-export" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              Import & Export
            </h2>
          </div>
          <div class="docs-section-content">
            <p>
              Payload exchange uses the <code class="text-text-primary text-xs">codex-theme-v1:</code> prefix as parser signature.
            </p>
            <div class="relative mt-8">
              <div class="bg-brand-500/5 absolute inset-0 rounded-3xl blur-2xl" />
              <pre class="text-text-secondary border-borderSubtle bg-black/40 relative overflow-x-auto border rounded-2xl p-8 text-xs leading-relaxed"><code>{{ schemaExample }}</code></pre>
            </div>
          </div>
        </section>

        <section id="limitations" class="docs-section relative">
          <div class="section-header">
            <h2 class="font-geist-500 text-white text-2xl">
              Known Limitations
            </h2>
          </div>
          <div class="docs-section-content pb-40">
            <p>
              Some syntax behavior remains constrained by upstream mappings, so grammar-level control is not fully theme-driven yet.
            </p>
            <a href="https://github.com/openai/codex/issues/14766" target="_blank" rel="noopener noreferrer" class="text-brand-400 inline-flex items-center gap-2 text-sm hover:underline">
              View GitHub Discussion
              <Icon name="ph:arrow-up-right" class="h-3.5 w-3.5" />
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
  left: -1px;
  width: 2px;
  height: 24px;
  background: #10b981;
  box-shadow: 0 0 12px #10b981;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
