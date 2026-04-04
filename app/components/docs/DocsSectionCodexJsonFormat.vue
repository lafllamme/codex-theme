<script setup lang="ts">
import DocsSectionShell from '~/components/docs/DocsSectionShell.vue'
import SyntaxBlock from '~/components/workbench/code/SyntaxBlock.vue'

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
</script>

<template>
  <DocsSectionShell
    id="codex-json-format"
    title="Codex JSON Format"
    content-class="flex flex-col gap-8 pb-20 text-base color-sand-12 font-light leading-normal max-lg:pb-14 lg:text-lg"
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
            <code class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]">accent</code>,
            <code class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]">surface</code>,
            <code class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]">ink</code>,
            <code class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]">contrast</code>,
            <code class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]">opaqueWindows</code>,
            <code class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]">fonts</code>, and
            <code class="font-geist-mono-500 transition-colors duration-200 color-pureWhite group-hover:color-[#10b981]">semanticColors</code>.
          </p>
        </article>
      </div>
    </section>

    <section class="pt-2 space-y-6">
      <div class="mb-1 flex items-center gap-4">
        <h3 class="font-geist-mono-500 text-[11px] color-sand-8 tracking-[0.2em] uppercase">
          Token Definitions
        </h3>
        <div class="h-px flex-1 from-sand-9/40 to-transparent bg-gradient-to-r" />
      </div>
      <div class="flex items-center gap-6 border-b border-sand-9/45 pb-4 text-[11px] color-sand-8 tracking-wider uppercase">
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
          :class="index === tokenDefinitionRows.length - 1 ? 'border-transparent' : ''"
        >
          <div class="w-56 flex shrink-0 flex-wrap items-center gap-2">
            <span class="font-geist-mono-500 border border-sand-4 rounded border-solid bg-sand-1 px-2.5 py-1.5 text-[13px] color-sand-11 leading-normal transition-all duration-200 group-hover:border-sand-10 group-hover:color-pureWhite">
              {{ row.key }}
            </span>
          </div>
          <div class="flex-1 text-[14px] color-sand-10 leading-relaxed transition-colors duration-200 group-hover:color-pureWhite">
            {{ row.description }}
          </div>
        </div>
      </div>
    </section>

    <section class="pt-2 space-y-6">
      <div class="mb-1 flex items-center gap-4">
        <h3 class="font-geist-mono-500 text-[11px] color-sand-8 tracking-[0.2em] uppercase">
          Payload Example
        </h3>
        <div class="h-px flex-1 from-sand-9/40 to-transparent bg-gradient-to-r" />
      </div>
      <div class="overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <div class="flex items-center gap-2 border border-b-0 border-sand-5 rounded-xl rounded-bl-0 rounded-br-0 border-solid px-4 py-2.5 bg-pureBlack">
          <Icon name="ph:file-code" class="size-4 color-pureWhite" />
          <span class="font-geist-500 text-sm color-pureWhite">theme-payload.json</span>
        </div>
        <div class="overflow-x-auto border border-sand-5 rounded-xl rounded-tl-0 rounded-tr-0 border-solid bg-slate-1 px-4 py-3 text-xs leading-relaxed">
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
  </DocsSectionShell>
</template>
