<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import DsExpandableCodeBlock from '~/components/docs/DsExpandableCodeBlock.vue'
import DsInstallationTabs from '~/components/docs/DsInstallationTabs.vue'
import DsLogoStepper from '~/components/docs/DsLogoStepper.vue'
import DsTerminalBlock from '~/components/docs/DsTerminalBlock.vue'
import DsNumberFlow from '~/components/DsNumberFlow.vue'
import SyntaxBlock from '~/components/workbench/code/SyntaxBlock.vue'
import { themePresetEntries } from '~/data/theme-preset-catalog'
import { OFFICIAL_CODE_THEME_IDS } from '~/utils/code-theme-registry'

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

type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'

const quickStartPm = ref<PackageManager>('pnpm')

const installCommandByPm: Record<PackageManager, string> = {
  npm: 'npm install',
  yarn: 'yarn install',
  pnpm: 'pnpm install',
  bun: 'bun install',
}

const runConvertByPm: Record<PackageManager, string> = {
  npm: 'npm run convert',
  yarn: 'yarn convert',
  pnpm: 'pnpm convert',
  bun: 'bun run convert',
}

const quickStartStepperLogos = [
  { icon: 'ph:magnifying-glass-light', label: 'Explore' },
  { icon: 'ph:sparkle-light', label: 'Studio' },
  { icon: 'ph:sliders-horizontal-light', label: 'Configure' },
  { icon: 'ph:terminal', label: 'CLI' },
  { icon: 'ph:download-simple-light', label: 'Download' },
  { icon: 'ph:cursor-click-light', label: 'Apply' },
]

const quickStartInstallTabs = computed(() => [
  {
    id: 'npm',
    label: 'npm',
    icon: 'simple-icons:npm',
    command: installCommandByPm.npm,
  },
  {
    id: 'yarn',
    label: 'yarn',
    icon: 'simple-icons:yarn',
    command: installCommandByPm.yarn,
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    icon: 'simple-icons:pnpm',
    command: installCommandByPm.pnpm,
  },
  {
    id: 'bun',
    label: 'bun',
    icon: 'simple-icons:bun',
    command: installCommandByPm.bun,
  },
])

const quickStartPipelineCommand = computed(
  () => `cd codex-themes
${runConvertByPm[quickStartPm.value]}`,
)

const quickStartCloneCommand = `git clone https://github.com/lafllamme/codex-themes`

const quickStartInputPresetExample = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Ansi 0 Color</key>
  <dict>
    <key>Alpha Component</key>
    <real>1</real>
    <key>Blue Component</key>
    <real>0.015686275437474251</real>
    <key>Color Space</key>
    <string>sRGB</string>
    <key>Green Component</key>
    <real>0.015686275437474251</real>
    <key>Red Component</key>
    <real>0.015686275437474251</real>
  </dict>
  <key>Ansi 1 Color</key>
  <dict>
    <key>Alpha Component</key>
    <real>1</real>
    <key>Blue Component</key>
    <real>0.2010747492313385</real>
    <key>Color Space</key>
    <string>sRGB</string>
    <key>Green Component</key>
    <real>0.29108250141143799</real>
    <key>Red Component</key>
    <real>0.84613037109375</real>
  </dict>
  <key>Background Color</key>
  <dict>
    <key>Alpha Component</key>
    <real>1</real>
    <key>Blue Component</key>
    <real>0.015686275437474251</real>
    <key>Color Space</key>
    <string>sRGB</string>
    <key>Green Component</key>
    <real>0.015686275437474251</real>
    <key>Red Component</key>
    <real>0.015686275437474251</real>
  </dict>
  <key>Foreground Color</key>
  <dict>
    <key>Alpha Component</key>
    <real>1</real>
    <key>Blue Component</key>
    <real>1</real>
    <key>Color Space</key>
    <string>sRGB</string>
    <key>Green Component</key>
    <real>1</real>
    <key>Red Component</key>
    <real>0.99607843160629272</real>
  </dict>
</dict>
</plist>`

const tokenDefinitionRows = [
  {
    key: 'codeThemeId',
    description:
            'Selects the syntax theme preset used for code highlighting output.',
  },
  {
    key: 'variant',
    description:
            'Controls whether the rendered theme should be used as dark or light mode.',
  },
  {
    key: 'theme',
    description:
            'Main theme object that groups the runtime visual tokens below.',
  },
  {
    key: 'accent',
    description:
            'Primary highlight color for emphasized UI states: mentions, skill files, @-references, and other interactive callouts in Codex surfaces.',
  },
  {
    key: 'surface',
    description:
            'Base background plane for the UI; sets the dominant panel/shell atmosphere.',
  },
  {
    key: 'ink',
    description:
            'Primary foreground/readability color used for text and high-contrast foreground content.',
  },
  {
    key: 'contrast',
    description: 'Global separation between content and background.',
  },
  {
    key: 'opaqueWindows',
    description:
            'Toggles translucent glass-like system surfaces vs. fully opaque solid backgrounds for UI window elements.',
  },
  {
    key: 'ui',
    description:
            'UI font family string for interface text. Works with system/web-safe fonts and custom installed fonts available on the target system.',
  },
  {
    key: 'code',
    description:
            'Code/editor font family string for monospaced code surfaces. Availability depends on fonts installed on the target system.',
  },
  {
    key: 'diffAdded',
    description:
            'Semantic color for added lines/positive diffs in compare and review views.',
  },
  {
    key: 'diffRemoved',
    description:
            'Semantic color for removed lines/negative diffs in compare and review views.',
  },
  {
    key: 'skill',
    description:
            'Semantic accent for skill-related labels and contextual skill cues.',
  },
] as const

const generationTargets = ['convert', 'rescore', 'test', 'all'] as const

const themeGenerationSteps = [
  {
    id: '01',
    title: 'Source Ingest',
    detail: 'Read `.itermcolors` files from `input/themes-raw` and convert plist payloads into structured JSON.',
    script: 'convert-iterm-themes.ts',
    output: 'normalized source colors',
  },
  {
    id: '02',
    title: 'Token Mapping',
    detail: 'Map source channels to Codex tokens: surface, ink, accent, plus semantic colors for diff and skill states.',
    script: 'convert-iterm-themes.ts',
    output: 'codex-theme-v1 token object',
  },
  {
    id: '03',
    title: 'Variant + Fonts',
    detail: 'Infer `variant` from surface luminance and assign deterministic font stacks from seeded weighted pools.',
    script: 'assign-fonts.ts',
    output: 'stable variant + fonts',
  },
  {
    id: '04',
    title: 'Theme Resolver Scoring',
    detail: 'Score official code themes against contrast thresholds and semantic color distance, then pick best `codeThemeId`.',
    script: 'resolve-code-theme-id.ts',
    output: 'recommended codeThemeId',
  },
  {
    id: '05',
    title: 'Normalization Pass',
    detail: 'Re-score all generated presets and rewrite mismatched theme ids for consistent output across the full preset set.',
    script: 'normalize-code-theme-ids.ts',
    output: 'normalized preset files',
  },
  {
    id: '06',
    title: 'Smoke Validation',
    detail: 'Run resolver smoke tests on representative dark/light payloads to verify non-empty stable recommendations.',
    script: 'verify-resolver.ts',
    output: 'pipeline verification result',
  },
] as const

const presetSourceStats = computed(() => {
  const officialIdSet = new Set<string>(OFFICIAL_CODE_THEME_IDS)
  const official = themePresetEntries.filter(entry =>
    officialIdSet.has(entry.id),
  ).length
  const total = themePresetEntries.length
  const importedIterm = Math.max(0, total - official)

  return {
    official,
    importedIterm,
    total,
  }
})

const presetStatsNumberWidthCh = computed(() => {
  const lengths = [
    presetSourceStats.value.total.toLocaleString().length,
    presetSourceStats.value.official.toLocaleString().length,
    presetSourceStats.value.importedIterm.toLocaleString().length,
  ]

  return Math.max(...lengths, 1)
})

const presetStatsStripRef = ref<HTMLElement | null>(null)
const isPresetStatsStripVisible = useElementVisibility(presetStatsStripRef)
const displayedPresetSourceStats = ref({
  official: 0,
  importedIterm: 0,
  total: 0,
})
let presetStatsReplayTimer: ReturnType<typeof setTimeout> | null = null
const presetStatsInteractionTimers: Partial<
  Record<
        'total' | 'official' | 'importedIterm',
        ReturnType<typeof setTimeout>
  >
> = {}

function resetPresetStatsDisplay() {
  displayedPresetSourceStats.value = {
    official: 0,
    importedIterm: 0,
    total: 0,
  }
}

function replayPresetStatsAnimation() {
  if (!isPresetStatsStripVisible.value)
    return

  if (presetStatsReplayTimer) {
    clearTimeout(presetStatsReplayTimer)
    presetStatsReplayTimer = null
  }

  resetPresetStatsDisplay()

  // Keep `0` visible for a short beat so NumberFlow always replays.
  presetStatsReplayTimer = setTimeout(() => {
    displayedPresetSourceStats.value = {
      ...presetSourceStats.value,
    }
    presetStatsReplayTimer = null
  }, 120)
}

function replayPresetStatsOnInteraction(
  key: 'total' | 'official' | 'importedIterm',
) {
  if (presetStatsInteractionTimers[key]) {
    clearTimeout(presetStatsInteractionTimers[key])
    delete presetStatsInteractionTimers[key]
  }

  const target = presetSourceStats.value[key]

  displayedPresetSourceStats.value = {
    ...displayedPresetSourceStats.value,
    [key]: 0,
  }

  presetStatsInteractionTimers[key] = setTimeout(() => {
    displayedPresetSourceStats.value = {
      ...displayedPresetSourceStats.value,
      [key]: target,
    }
    delete presetStatsInteractionTimers[key]
  }, 140)
}

watch(
  isPresetStatsStripVisible,
  (visible) => {
    if (visible) {
      replayPresetStatsAnimation()
      return
    }
    resetPresetStatsDisplay()
  },
  { immediate: true },
)

watch(presetSourceStats, (nextStats) => {
  if (!isPresetStatsStripVisible.value)
    return

  displayedPresetSourceStats.value = {
    ...nextStats,
  }
})

onBeforeUnmount(() => {
  if (presetStatsReplayTimer) {
    clearTimeout(presetStatsReplayTimer)
    presetStatsReplayTimer = null
  }
  (['total', 'official', 'importedIterm'] as const).forEach((key) => {
    const timer = presetStatsInteractionTimers[key]
    if (!timer)
      return
    clearTimeout(timer)
    delete presetStatsInteractionTimers[key]
  })
})

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
              class="font-geist-400 mb-3 text-[clamp(2.1rem,4.4vw,4.9rem)] color-sand-10 leading-17 tracking-[-0.02em] uppercase"
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
            class="font-geist-300 max-w-2xl text-[clamp(1.05rem,1.4vw,1.32rem)] color-slate-11 leading-normal"
          >
            A quick primer on how Codex maps a theme JSON payload to
            interface tokens so you can shape your own theme from
            that contract.
          </p>
        </header>

        <section
          id="introduction"
          class="[scroll-margin-top:calc(var(--hero-top-offset)+96px)] relative max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
        >
          <div
            class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pb-8 pt-16 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
          >
            <h2
              class="font-geist-500 text-2xl color-pureWhite lg:text-4xl"
            >
              Introduction
            </h2>
          </div>
          <div
            class="flex flex-col gap-8 pb-20 text-base color-sand-11 font-light leading-normal max-lg:pb-14 lg:text-lg"
          >
            <p>
              I was genuinely excited when Codex themes launched,
              but I kept running into the same friction: the
              default selection felt limited, and comparing
              options took too much back-and-forth. I wanted to
              move faster without losing confidence in what I was
              shipping.
            </p>
            <p>
              The bigger issue was context. A theme could look
              fine in a small preview, then feel wrong in a real
              coding environment once spacing, contrast, and
              especially fonts came into play. That gap between
              preview and real usage was the main reason this
              project exists.
            </p>
            <p>
              Theme Studio is a dev-for-dev web app built to close
              that gap. It maps theme tokens into a
              Codex-compatible JSON payload, so you can generate,
              tweak, and export themes quickly while keeping the
              output predictable and reusable.
            </p>
            <p>
              It also includes extra generated presets for anyone
              who wants a strong starting point with minimal
              setup. As Codex introduces more theming controls,
              this project will continue to adopt those
              capabilities and expose them here.
            </p>
            <p>
              On a personal note, rebuilding a Codex-like
              experience in the browser was genuinely fun and
              surprisingly challenging. It made me respect even
              more how much structure sits behind an app like
              Codex. If this tool saves you even a few clicks, it
              already did its job. Happy theming!
            </p>
          </div>
        </section>

        <section
          id="installation"
          class="[scroll-margin-top:calc(var(--hero-top-offset)+96px)] relative max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
        >
          <div
            class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pb-8 pt-16 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
          >
            <h2
              class="font-geist-500 text-2xl color-pureWhite lg:text-4xl"
            >
              Installation
            </h2>
          </div>
          <div
            class="flex flex-col gap-8 pb-20 text-base color-sand-11 font-light leading-normal max-lg:pb-14 lg:text-lg"
          >
            <p>
              Choose the path that matches your goal. Most users
              should use the web builder directly.
            </p>
            <DocsInstallBento />
            <p class="pt-1 text-sm">
              Under the hood, both paths converge on the same
              contract: source colors are mapped into a stable
              Codex theme payload, semantic fields are normalized,
              and the final JSON is shaped for predictable import
              behavior.
            </p>
          </div>
        </section>

        <section
          id="quick-start"
          class="[scroll-margin-top:calc(var(--hero-top-offset)+96px)] relative max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
        >
          <div
            class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pb-8 pt-16 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
          >
            <h2
              class="font-geist-500 text-2xl color-pureWhite lg:text-4xl"
            >
              Quick Start
            </h2>
          </div>
          <div
            class="flex flex-col gap-8 pb-20 text-base color-sand-11 font-light leading-normal max-lg:pb-14 lg:text-lg"
          >
            <p>
              Start with the fastest flow first. If you prefer a
              local terminal pipeline, expand the advanced section
              below.
            </p>
            <DsLogoStepper
              :logos="quickStartStepperLogos"
              :visible-count="5"
            />
            <div
              class="border-borderSubtle bg-surface/70 flex flex-col gap-7 border rounded-xl py-6 text-sm"
            >
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <h4
                    class="font-geist-mono-500 text-[11px] color-sand-8 tracking-[0.2em] uppercase"
                  >
                    Recommended Flow
                  </h4>
                  <div
                    class="h-px flex-1 from-sand-9/40 to-transparent bg-gradient-to-r"
                  />
                </div>
                <div class="flex gap-4">
                  <span
                    class="text-brand-400 font-geist-mono-500"
                  >01</span>
                  <p>
                    Open
                    <NuxtLink
                      to="/themes"
                      class="group font-geist-500 relative inline-flex items-center gap-1 pb-0.5 leading-5 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#10b981] !text-[#10b981] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100"
                    >
                      Theme Studio
                      <Icon
                        name="ph:arrow-up-right"
                        class="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </NuxtLink>
                    and start from any preset.
                  </p>
                </div>
                <div class="flex gap-4">
                  <span
                    class="text-brand-400 font-geist-mono-500"
                  >02</span>
                  <p>
                    Set your core tokens
                    <span class="font-geist-mono">(accent,surface,ink)</span>
                    then fine-tune
                    <span class="font-geist-mono">contrast</span>
                    and
                    <span class="font-geist-mono">semanticColors</span>.
                  </p>
                </div>
                <div class="flex gap-4">
                  <span
                    class="text-brand-400 font-geist-mono-500"
                  >03</span>
                  <p>
                    Export, download, and apply the JSON in
                    Codex. Then validate in a real coding
                    session.
                  </p>
                </div>
              </div>
            </div>
            <p class="text-sm">
              All flows converge to the same
              <code class="text-text-primary text-xs">codex-theme-v1</code>
              contract. For field-by-field key details, continue
              to the next section:
              <span class="text-text-primary">Codex JSON Format</span>.
            </p>
            <div
              id="advanced-local-pipeline"
              class="border-borderSubtle bg-surface/45 overflow-hidden border rounded-xl"
            >
              <div class="border-borderSubtle border-b py-4">
                <div class="flex items-center gap-4">
                  <h4
                    class="font-geist-mono-500 text-[11px] color-sand-8 tracking-[0.2em] uppercase"
                  >
                    Advanced Flow
                  </h4>
                  <div
                    class="h-px flex-1 from-sand-9/40 to-transparent bg-gradient-to-r"
                  />
                </div>
              </div>
              <div class="py-6">
                <p class="text-xs color-sand-10">
                  Best when you want reproducible generation
                  from raw terminal palettes.
                </p>
                <div class="pt-6 space-y-6">
                  <h5
                    class="font-geist-500 text-2xl color-pureWhite"
                  >
                    Prerequisites
                  </h5>
                  <ul
                    class="list-disc pl-6 text-[1.02rem] color-sand-10 leading-relaxed space-y-1 marker:color-sand-8"
                  >
                    <li class="font-400">
                      <span
                        class="font-geist-500 color-pureWhite"
                      >Node.js</span>
                      -
                      <a
                        href="https://nodejs.org/en"
                        target="_blank"
                        rel="noreferrer noopener"
                        class="font-geist-mono-500 mx-1 inline-flex items-center border-2 rounded-lg border-dashed bg-slate-1 px-2 py-1 text-[0.95em] leading-none transition-colors duration-200 color-pureWhite border-pureWhite/35 hover:bg-slate-2 hover:border-pureWhite/55"
                      >20.x</a>
                      or newer (but we recommend the
                      <a
                        href="https://nodejs.org/en/about/previous-releases"
                        target="_blank"
                        rel="noreferrer noopener"
                        class="font-geist-500 relative inline-block pb-0.5 leading-5 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#10b981] !text-[#10b981] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100"
                      >active LTS release</a>).
                    </li>
                    <li>
                      <span
                        class="font-geist-600 color-pureWhite"
                      >Package manager</span>
                      -
                      <code>pnpm</code>
                      (recommended), <code>npm</code>,
                      <code>yarn</code>, or
                      <code>bun</code>.
                    </li>
                    <li>
                      <span
                        class="font-geist-600 color-pureWhite"
                      >iTerm Preset</span>
                      - at least one
                      <code>.itermcolors</code>
                      file placed in
                      <code>input/</code> (see
                      <a
                        href="https://iterm2colorschemes.com/"
                        target="_blank"
                        rel="noreferrer noopener"
                        class="font-geist-500 relative inline-block pb-0.5 leading-5 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#10b981] !text-[#10b981] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100"
                      >iTerm2 Color Schemes</a>).
                    </li>
                  </ul>
                </div>
                <div class="pt-8 space-y-[4.5rem]">
                  <div class="space-y-5">
                    <div class="flex gap-4">
                      <span
                        class="text-brand-400 font-geist-mono-500"
                      >01</span>
                      <p>
                        Clone
                        <a
                          href="https://github.com/lafllamme/codex-themes"
                          target="_blank"
                          rel="noreferrer noopener"
                          class="group font-geist-500 relative inline-flex items-center gap-1 pb-0.5 leading-5 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#10b981] !text-[#10b981] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100"
                        >
                          lafllamme/codex-themes
                          <Icon
                            name="ph:arrow-up-right"
                            class="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </a>
                      </p>
                    </div>
                    <DsTerminalBlock
                      title="Terminal"
                      :text="quickStartCloneCommand"
                      language="shellscript"
                      code-theme-id="everforest"
                    />
                  </div>

                  <div class="space-y-5">
                    <div class="flex gap-4">
                      <span
                        class="text-brand-400 font-geist-mono-500"
                      >02</span>
                      <p>
                        Add an iTerm preset file to
                        <code>input/</code>, either from
                        the official iTerm2 collection
                        or your own custom preset.
                      </p>
                    </div>
                    <p class="text-sm color-sand-10">
                      Place your preferred iTerm2 color
                      preset (or your own custom preset)
                      in the local
                      <code>codex-themes</code>
                      input folder as
                      <code>input/yourTheme.itermcolors</code>, as shown in the Adventure example
                      below.
                    </p>
                    <DsExpandableCodeBlock
                      title="input/Adventure.itermcolors"
                      :text="quickStartInputPresetExample"
                      language="xml"
                      code-theme-id="everforest"
                      :collapsed-lines="10"
                    />
                    <p class="pt-16 text-sm color-sand-10">
                      Install dependencies (once) with
                      your preferred package manager:
                    </p>
                    <DsInstallationTabs
                      v-model="quickStartPm"
                      :tabs="quickStartInstallTabs"
                      code-theme-id="everforest"
                    />
                  </div>

                  <div class="space-y-5">
                    <div class="flex gap-4">
                      <span
                        class="text-brand-400 font-geist-mono-500"
                      >03</span>
                      <p>
                        Run the converter command shown
                        below to generate
                        Codex-compatible JSON themes in
                        <code>output/</code>.
                      </p>
                    </div>
                    <DsTerminalBlock
                      title="Terminal"
                      :text="quickStartPipelineCommand"
                      language="shellscript"
                      code-theme-id="everforest"
                    />
                    <p
                      class="color-emerald-7 text-[13px] leading-relaxed"
                    >
                      Converter output is written to
                      <code>output/</code> as
                      Codex-compatible theme JSON files
                      ready for import.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="border border-sand-8 rounded-xl border-dashed bg-slate-1 px-5 py-4 hover:border-sand-11"
            >
              <p class="text-sm color-sand-10">
                <span class="font-geist-600 color-pureWhite">Next step:</span>
                after generating or exporting your theme,
                validate semantic balance in the real workbench,
                then refine in small passes.
              </p>
            </div>
          </div>
        </section>

        <section
          id="codex-json-format"
          class="[scroll-margin-top:calc(var(--hero-top-offset)+96px)] relative max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
        >
          <div
            class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pb-8 pt-16 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
          >
            <h2
              class="font-geist-500 text-2xl color-pureWhite lg:text-4xl"
            >
              Codex JSON Format
            </h2>
          </div>
          <div
            class="flex flex-col gap-8 pb-20 text-base color-sand-12 font-light leading-normal max-lg:pb-14 lg:text-lg"
          >
            <p class="max-w-2xl leading-relaxed">
              Payload exchange uses the
              <code
                class="border border-sand-8/70 rounded bg-sand-12 px-1.5 py-0.5 text-[15px] color-sand-1 font-mono"
              >codex-theme-v1</code>
              prefix as parser signature. The contract is stable
              and designed for predictable import/export.
            </p>

            <section class="space-y-6">
              <div class="mb-1 flex items-center gap-4">
                <h3
                  class="font-geist-mono-500 text-[11px] color-sand-8 tracking-[0.2em] uppercase"
                >
                  Schema Overview
                </h3>
                <div
                  class="h-px flex-1 from-sand-9/40 to-transparent bg-gradient-to-r"
                />
              </div>
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <article
                  class="group relative overflow-hidden border rounded-[2rem] border-solid bg-sand-1 p-6 shadow-[0_14px_32px_rgba(0,0,0,0.24)] transition-all duration-220 ease-[cubic-bezier(0.36,0,0.64,1)] text-pureBlack border-pureBlack/10 hover:border-pureBlack/22 hover:-translate-y-0.5"
                >
                  <div
                    class="relative z-10 mb-4 flex items-center justify-between"
                  >
                    <span
                      class="font-geist-mono-500 text-[10px] color-sand-10 tracking-[0.16em] uppercase group-hover:opacity-0"
                    >
                      Schema
                    </span>
                    <Icon
                      name="ph:brackets-curly-bold"
                      class="size-4 color-sand-8 group-hover:color-sand-12"
                    />
                  </div>
                  <h4
                    class="font-geist-700 relative z-10 text-[1.9rem] color-sand-12 leading-[0.95] tracking-[-0.02em] uppercase transition-all duration-200 ease-out group-hover:-translate-y-1/2"
                  >
                    Top-Level
                    <br>
                    Fields
                  </h4>
                  <p
                    class="font-geist-300 relative z-10 mt-5 text-[15px] color-sand-11 leading-relaxed transition-colors duration-200 group-hover:color-sand-12"
                  >
                    <code
                      class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]"
                    >codeThemeId</code>
                    (theme identity),
                    <code
                      class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]"
                    >variant</code>
                    (dark/light), and
                    <code
                      class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]"
                    >theme</code>
                    (all visual tokens).
                  </p>
                </article>
                <article
                  class="group relative overflow-hidden border rounded-[2rem] border-solid bg-sand-1 p-6 shadow-[0_14px_32px_rgba(0,0,0,0.24)] transition-all duration-220 ease-[cubic-bezier(0.36,0,0.64,1)] text-pureBlack border-pureBlack/10 hover:border-pureBlack/22 hover:-translate-y-0.5"
                >
                  <div
                    class="relative z-10 mb-4 flex items-center justify-between"
                  >
                    <span
                      class="font-geist-mono-500 text-[10px] color-sand-10 tracking-[0.16em] uppercase group-hover:opacity-0"
                    >
                      Tokens
                    </span>
                    <Icon
                      name="ph:swatches-bold"
                      class="size-4 color-sand-8 group-hover:color-sand-12"
                    />
                  </div>
                  <h4
                    class="font-geist-700 relative z-10 text-[1.9rem] color-sand-12 leading-[0.95] tracking-[-0.02em] uppercase transition-all duration-200 ease-out group-hover:-translate-y-1/2"
                  >
                    Theme
                    <br>
                    Fields
                  </h4>
                  <p
                    class="font-geist-300 relative z-10 mt-5 text-[15px] color-sand-11 leading-relaxed transition-colors duration-200 group-hover:color-sand-12"
                  >
                    <code
                      class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]"
                    >accent</code>,
                    <code
                      class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]"
                    >surface</code>,
                    <code
                      class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]"
                    >ink</code>,
                    <code
                      class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]"
                    >contrast</code>,
                    <code
                      class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]"
                    >opaqueWindows</code>,
                    <code
                      class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]"
                    >fonts</code>, and
                    <code
                      class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]"
                    >semanticColors</code>.
                  </p>
                </article>
              </div>
            </section>

            <section class="pt-2 space-y-6">
              <div class="mb-1 flex items-center gap-4">
                <h3
                  class="font-geist-mono-500 text-[11px] color-sand-8 tracking-[0.2em] uppercase"
                >
                  Token Definitions
                </h3>
                <div
                  class="h-px flex-1 from-sand-9/40 to-transparent bg-gradient-to-r"
                />
              </div>
              <div
                class="flex items-center gap-6 border-b border-sand-9/45 pb-4 text-[11px] color-sand-8 tracking-wider uppercase"
              >
                <div class="font-geist-600 w-56 shrink-0">
                  Field Name
                </div>
                <div class="font-geist-600">
                  Visual Effect
                </div>
              </div>
              <div class="flex flex-col">
                <div
                  v-for="(row, index) in tokenDefinitionRows"
                  :key="row.key"
                  class="group flex cursor-default items-center gap-6 border-b border-slate-1 rounded-xl border-solid px-4 py-4 transition-colors ease-out -mx-4 !duration-200 hover:bg-pureWhite/2"
                  :class="
                    index === tokenDefinitionRows.length - 1
                      ? 'border-transparent'
                      : ''
                  "
                >
                  <div
                    class="w-56 flex shrink-0 flex-wrap items-center gap-2"
                  >
                    <span
                      class="font-geist-mono-500 border border-sand-4 rounded border-solid bg-sand-1 px-2.5 py-1.5 text-[13px] color-sand-11 leading-normal transition-all duration-200 group-hover:border-sand-10 group-hover:color-pureWhite"
                    >
                      {{ row.key }}
                    </span>
                  </div>
                  <div
                    class="flex-1 text-[14px] color-sand-10 leading-relaxed transition-colors duration-200 group-hover:color-pureWhite"
                  >
                    {{ row.description }}
                  </div>
                </div>
              </div>
            </section>

            <section class="pt-2 space-y-6">
              <div class="mb-1 flex items-center gap-4">
                <h3
                  class="font-geist-mono-500 text-[11px] color-sand-8 tracking-[0.2em] uppercase"
                >
                  Payload Example
                </h3>
                <div
                  class="h-px flex-1 from-sand-9/40 to-transparent bg-gradient-to-r"
                />
              </div>
              <div
                class="overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
              >
                <div
                  class="flex items-center gap-2 border border-b-0 border-sand-5 rounded-xl rounded-bl-0 rounded-br-0 border-solid px-4 py-2.5 bg-pureBlack"
                >
                  <Icon
                    name="ph:file-code"
                    class="size-4 color-pureWhite"
                  />
                  <span
                    class="font-geist-500 text-sm color-pureWhite"
                  >theme-payload.json</span>
                </div>
                <div
                  class="overflow-x-auto border border-sand-5 rounded-xl rounded-tl-0 rounded-tr-0 border-solid bg-slate-1 px-4 py-3 text-xs leading-relaxed"
                >
                  <SyntaxBlock
                    class="font-geist-mono-500 text-[13px] leading-[1.75]"
                    :text="schemaExample"
                    language="json"
                    code-theme-id="everforest"
                    fallback-color="rgba(220,220,223,0.95)"
                  />
                </div>
              </div>
            </section>
          </div>
        </section>

        <section
          id="theme-generation-algorithm"
          class="[scroll-margin-top:calc(var(--hero-top-offset)+96px)] relative max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
        >
          <div
            class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pb-8 pt-16 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
          >
            <h2
              class="font-geist-500 text-2xl color-pureWhite lg:text-4xl"
            >
              Theme Generation Algorithm
            </h2>
          </div>
          <div
            class="flex flex-col gap-8 pb-20 text-base color-sand-11 font-light leading-normal max-lg:pb-14 lg:text-lg"
          >
            <p class="max-w-3xl">
              The generator is deterministic and script-driven:
              identical source input produces identical output
              JSON. The flow below mirrors the real
              <code>codex-themes</code> pipeline and not a
              simplified mock.
            </p>

            <div
              class="flex flex-wrap items-center gap-2.5 border border-sand-8/45 rounded-2xl bg-slate-1 px-4 py-3"
            >
              <span
                class="font-geist-mono-500 text-[11px] color-sand-8 tracking-[0.14em] uppercase"
              >Pipeline Targets</span>
              <span
                v-for="target in generationTargets"
                :key="target"
                class="font-geist-mono-500 border border-sand-7/55 rounded px-2.5 py-1 text-[11px] color-sand-6 bg-pureBlack/70"
              >
                {{ target }}
              </span>
              <span
                class="font-geist-mono-500 ml-auto text-[11px] color-sand-9"
              >
                schema: <code>codex-theme-v1</code>
              </span>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article
                v-for="step in themeGenerationSteps"
                :key="step.id"
                class="group relative overflow-hidden border border-sand-8/55 rounded-2xl bg-slate-1/92 p-5 transition-all duration-220 ease-out hover:border-sand-6/70 hover:bg-slate-1"
              >
                <div
                  class="mb-3 flex items-center justify-between gap-3"
                >
                  <span
                    class="font-geist-mono-500 text-[11px] color-sand-8 tracking-[0.16em] uppercase"
                  >
                    Step {{ step.id }}
                  </span>
                  <code
                    class="font-geist-mono-500 border border-sand-8/50 rounded px-2 py-0.5 text-[11px] color-sand-6 bg-pureBlack/65"
                  >
                    {{ step.script }}
                  </code>
                </div>
                <h4
                  class="font-geist-600 text-[1.1rem] leading-tight color-pureWhite"
                >
                  {{ step.title }}
                </h4>
                <p
                  class="mt-2 text-[14px] color-sand-10 leading-relaxed"
                >
                  {{ step.detail }}
                </p>
                <div
                  class="mt-3 border-t border-sand-8/45 pt-3"
                >
                  <span
                    class="font-geist-mono-500 text-[11px] color-sand-8 tracking-wide uppercase"
                  >Output</span>
                  <p
                    class="mt-1 text-[13px] color-sand-9 leading-relaxed"
                  >
                    {{ step.output }}
                  </p>
                </div>
              </article>
            </div>

            <div
              class="border border-sand-8/40 rounded-2xl px-5 py-4 bg-pureBlack/65"
            >
              <p class="text-[14px] color-sand-9 leading-relaxed">
                The important behavior is intentional
                convergence: visually different source palettes
                can still map to similar runtime themes after
                readability normalization and resolver scoring.
              </p>
              <p
                class="mt-2 text-[14px] color-sand-10 leading-relaxed"
              >
                This keeps generated themes predictable for
                production usage while still preserving each
                preset's identity.
              </p>
            </div>
          </div>
        </section>

        <section
          id="preset-sources"
          class="[scroll-margin-top:calc(var(--hero-top-offset)+96px)] relative max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
        >
          <div
            class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pb-8 pt-16 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
          >
            <h2
              class="font-geist-500 text-2xl color-pureWhite lg:text-4xl"
            >
              Preset Sources
            </h2>
          </div>
          <div
            class="flex flex-col gap-8 pb-20 text-base color-sand-11 font-light leading-normal max-lg:pb-14 lg:text-lg"
          >
            <p class="max-w-3xl">
              The current catalog combines official Codex presets
              with a large imported iTerm2-derived set. Every
              entry is normalized into the same
              <code>codex-theme-v1</code> payload contract.
            </p>

            <div class="py-2 space-y-6">
              <p
                class="font-geist-mono-500 text-[12px] color-[#10b981] tracking-[0.16em] uppercase"
              >
                Theme Catalog
              </p>

              <div
                ref="presetStatsStripRef"
                class="flex flex-col gap-8 md:flex-row md:items-end md:gap-0"
              >
                <article
                  class="flex flex-col items-center md:w-1/3 md:px-12"
                  @mouseenter="
                    replayPresetStatsOnInteraction('total')
                  "
                  @click="
                    replayPresetStatsOnInteraction('total')
                  "
                >
                  <p
                    class="font-geist-300 w-full inline-flex justify-center whitespace-nowrap text-[clamp(2.7rem,6vw,5.2rem)] leading-none tracking-tight color-pureWhite"
                  >
                    <span
                      class="relative inline-flex items-baseline"
                    >
                      <span
                        class="inline-flex justify-end"
                        :style="{
                          minWidth: `${presetStatsNumberWidthCh}ch`,
                          fontVariantNumeric:
                            'tabular-nums',
                        }"
                      >
                        <DsNumberFlow
                          :value="
                            displayedPresetSourceStats.total
                          "
                        />
                      </span>
                      <Icon
                        name="ph:plus-bold"
                        class="pointer-events-none absolute left-full top-1/2 ml-2 size-12 color-[#10b981] -translate-y-1/2"
                      />
                    </span>
                  </p>
                  <p
                    class="font-geist-mono-600 mt-3 text-center text-[13px] color-sand-8 tracking-[0.12em] uppercase"
                  >
                    Total Themes
                  </p>
                </article>

                <article
                  class="flex flex-col items-center md:w-1/3 md:border-l md:border-sand-9/40 md:px-12"
                  @mouseenter="
                    replayPresetStatsOnInteraction(
                      'official',
                    )
                  "
                  @click="
                    replayPresetStatsOnInteraction(
                      'official',
                    )
                  "
                >
                  <p
                    class="font-geist-300 w-full inline-flex justify-center whitespace-nowrap text-[clamp(2.7rem,6vw,5.2rem)] leading-none tracking-tight color-pureWhite"
                  >
                    <span
                      class="relative inline-flex items-baseline"
                    >
                      <span
                        class="inline-flex justify-end"
                        :style="{
                          minWidth: `${presetStatsNumberWidthCh}ch`,
                          fontVariantNumeric:
                            'tabular-nums',
                        }"
                      >
                        <DsNumberFlow
                          :value="
                            displayedPresetSourceStats.official
                          "
                        <!-- /> -->
                      </span>
                      <Icon
                        name="ph:plus-bold"
                        class="pointer-events-none absolute left-full top-1/2 ml-2 size-12 color-slate-9 -translate-y-1/2"
                      />
                    </span>
                  </p>
                  <p
                    class="font-geist-mono-600 mt-3 text-center text-[13px] color-sand-8 tracking-[0.12em] uppercase"
                  >
                    Codex Native
                  </p>
                </article>

                <article
                  class="flex flex-col items-center md:w-1/3 md:border-l md:border-sand-9/40 md:px-12"
                  @mouseenter="
                    replayPresetStatsOnInteraction(
                      'importedIterm',
                    )
                  "
                  @click="
                    replayPresetStatsOnInteraction(
                      'importedIterm',
                    )
                  "
                >
                  <p
                    class="font-geist-300 w-full inline-flex justify-center whitespace-nowrap text-[clamp(2.7rem,6vw,5.2rem)] leading-none tracking-tight color-pureWhite"
                  >
                    <span
                      class="relative inline-flex items-baseline"
                    >
                      <span
                        class="inline-flex justify-end"
                        :style="{
                          minWidth: `${presetStatsNumberWidthCh}ch`,
                          fontVariantNumeric:
                            'tabular-nums',
                        }"
                      >
                        <DsNumberFlow
                          :value="
                            displayedPresetSourceStats.importedIterm
                          "
                        />
                      </span>
                      <Icon
                        name="ph:plus-bold"
                        class="pointer-events-none absolute left-full top-1/2 ml-2 size-12 color-slate-9 -translate-y-1/2"
                      />
                    </span>
                  </p>
                  <p
                    class="font-geist-mono-600 mt-3 text-center text-[13px] color-sand-8 tracking-[0.12em] uppercase"
                  >
                    iTerm Sources
                  </p>
                </article>
              </div>
            </div>

            <p class="max-w-3xl">
              This split is deliberate: Theme Studio stays the
              fastest creation path, while the
              <code>codex-themes</code> repository pipeline
              provides reproducible local generation for
              automation and versioned workflows.
            </p>
          </div>
        </section>

        <section
          id="reference"
          class="[scroll-margin-top:calc(var(--hero-top-offset)+96px)] relative max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
        >
          <div
            class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pb-8 pt-16 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
          >
            <h2
              class="font-geist-500 text-2xl color-pureWhite lg:text-4xl"
            >
              Reference
            </h2>
          </div>
          <div
            class="flex flex-col gap-8 pb-20 text-base color-sand-11 font-light leading-normal max-lg:pb-14 lg:text-lg"
          >
            <ul class="text-sm space-y-3">
              <li>Repository (coming soon)</li>
              <li>Script documentation (coming soon)</li>
              <li>
                Codex schema/version reference (coming soon)
              </li>
            </ul>
          </div>
        </section>

        <section
          id="known-limitations"
          class="[scroll-margin-top:calc(var(--hero-top-offset)+96px)] relative max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
        >
          <div
            class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pb-8 pt-16 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
          >
            <h2
              class="font-geist-500 text-2xl color-pureWhite lg:text-4xl"
            >
              Known Limitations
            </h2>
          </div>
          <div
            class="flex flex-col gap-8 pb-40 text-base color-sand-11 font-light leading-normal lg:text-lg"
          >
            <p>
              Some syntax and semantic behavior remains
              constrained by upstream Codex mappings, so not every
              color token can be fully overridden in every editor
              context.
            </p>
            <a
              href="https://github.com/openai/codex/issues/14766"
              target="_blank"
              rel="noopener noreferrer"
              class="group font-geist-500 relative w-fit inline-flex items-center self-start gap-2 pb-0.5 text-sm leading-5 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#10b981] !text-[#10b981] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100"
            >
              View GitHub Discussion
              <Icon
                name="ph:arrow-up-right"
                class="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
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
</style>
