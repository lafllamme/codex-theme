<script setup lang="ts">
import DocsSectionShell from '~/components/docs/DocsSectionShell.vue'

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
</script>

<template>
  <DocsSectionShell id="theme-generation-algorithm" title="Theme Generation Algorithm">
    <p class="max-w-3xl">
      The generator is deterministic and script-driven:
      identical source input produces identical output
      JSON. The flow below mirrors the real
      <code>codex-themes</code> pipeline and not a
      simplified mock.
    </p>

    <div class="flex flex-wrap items-center gap-2.5 border border-sand-8/45 rounded-2xl bg-slate-1 px-4 py-3">
      <span class="font-geist-mono-500 text-[11px] color-sand-8 tracking-[0.14em] uppercase">Pipeline Targets</span>
      <span
        v-for="target in generationTargets"
        :key="target"
        class="font-geist-mono-500 border border-sand-7/55 rounded px-2.5 py-1 text-[11px] color-sand-6 bg-pureBlack/70"
      >
        {{ target }}
      </span>
      <span class="font-geist-mono-500 ml-auto text-[11px] color-sand-9">
        schema: <code>codex-theme-v1</code>
      </span>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <article
        v-for="step in themeGenerationSteps"
        :key="step.id"
        class="group relative overflow-hidden border border-sand-8/55 rounded-2xl bg-slate-1/92 p-5 transition-all duration-220 ease-out hover:border-sand-6/70 hover:bg-slate-1"
      >
        <div class="mb-3 flex items-center justify-between gap-3">
          <span class="font-geist-mono-500 text-[11px] color-sand-8 tracking-[0.16em] uppercase">
            Step {{ step.id }}
          </span>
          <code class="font-geist-mono-500 border border-sand-8/50 rounded px-2 py-0.5 text-[11px] color-sand-6 bg-pureBlack/65">
            {{ step.script }}
          </code>
        </div>
        <h4 class="font-geist-600 text-[1.1rem] leading-tight color-pureWhite">
          {{ step.title }}
        </h4>
        <p class="mt-2 text-[14px] color-sand-10 leading-relaxed">
          {{ step.detail }}
        </p>
        <div class="mt-3 border-t border-sand-8/45 pt-3">
          <span class="font-geist-mono-500 text-[11px] color-sand-8 tracking-wide uppercase">Output</span>
          <p class="mt-1 text-[13px] color-sand-9 leading-relaxed">
            {{ step.output }}
          </p>
        </div>
      </article>
    </div>

    <div class="border border-sand-8/40 rounded-2xl px-5 py-4 bg-pureBlack/65">
      <p class="text-[14px] color-sand-9 leading-relaxed">
        The important behavior is intentional
        convergence: visually different source palettes
        can still map to similar runtime themes after
        readability normalization and resolver scoring.
      </p>
      <p class="mt-2 text-[14px] color-sand-10 leading-relaxed">
        This keeps generated themes predictable for
        production usage while still preserving each
        preset's identity.
      </p>
    </div>
  </DocsSectionShell>
</template>
