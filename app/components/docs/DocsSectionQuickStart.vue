<script setup lang="ts">
import DocsSectionShell from '~/components/docs/DocsSectionShell.vue'
import DsExpandableCodeBlock from '~/components/docs/DsExpandableCodeBlock.vue'
import DsInstallationTabs from '~/components/docs/DsInstallationTabs.vue'
import DsLogoStepper from '~/components/docs/DsLogoStepper.vue'
import DsTerminalBlock from '~/components/docs/DsTerminalBlock.vue'

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
  { icon: 'ph:sparkle-light', label: 'Create' },
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
  () => `cd codex-themes\n${runConvertByPm[quickStartPm.value]}`,
)

const quickStartCloneCommand = 'git clone https://github.com/lafllamme/codex-themes'

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
</script>

<template>
  <DocsSectionShell id="quick-start" title="Quick Start">
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
        <div class="flex items-start gap-4">
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
        <div class="flex items-start gap-4">
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
        <div class="flex items-start gap-4">
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
      <div class="border-borderSubtle border-b py-3">
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
      <div class="pb-6 pt-0">
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
            class="list-disc pl-6 text-[1.02rem] color-sand-11 leading-relaxed space-y-1 marker:color-sand-8"
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
        <div class="pt-8 space-y-10 lg:space-y-12">
          <div class="space-y-5">
            <div class="flex items-start gap-4">
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
            <div class="flex items-start gap-4">
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
            <p class="pt-6 text-sm color-sand-10">
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
            <div class="flex items-start gap-4">
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
  </DocsSectionShell>
</template>
