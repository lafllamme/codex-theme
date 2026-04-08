<script setup lang="ts">
import DocsSectionShell from '~/components/docs/DocsSectionShell.vue'

const referenceCards = [
  {
    title: 'Repository',
    icon: 'ph:swatches',
    description:
      'Source of truth for conversion scripts, preset generation, and reproducible local workflows.',
    href: 'https://github.com/lafllamme/codex-themes',
    cta: 'Open Repository',
  },
  {
    title: 'iTerm',
    icon: 'ph:feather',
    description:
      'Upstream palette source used to import a broad ecosystem of known developer color themes.',
    href: 'https://github.com/mbadolato/iTerm2-Color-Schemes',
    cta: 'View iTerm Source',
  },
  {
    title: 'Codex',
    icon: 'ph:terminal',
    description:
      'Product context and compatibility surface for the generated payload behavior in real Codex usage.',
    href: 'https://github.com/openai/codex',
    cta: 'Open Codex',
  },
] as const
</script>

<template>
  <DocsSectionShell id="reference" title="Reference">
    <p class="max-w-3xl">
      Core references for the Theme Studio pipeline,
      source presets, and Codex compatibility context.
    </p>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <article
        v-for="card in referenceCards"
        :key="card.title"
        class="group rounded-2xl bg-slate-1/92 p-5 transition-colors duration-200"
      >
        <div class="mb-3 flex items-center justify-between">
          <span class="font-geist-mono-500 text-[10px] color-sand-8 tracking-[0.16em] uppercase group-hover:color-sand-12">{{ card.title }}</span>
          <Icon :name="card.icon" class="size-4 color-sand-9 group-hover:color-pureWhite" />
        </div>
        <p class="text-[13px] color-sand-11 leading-relaxed group-hover:color-pureWhite">
          {{ card.description }}
        </p>
        <a
          :href="card.href"
          target="_blank"
          rel="noopener noreferrer"
          class="font-geist-500 relative mt-4 w-fit inline-flex items-center gap-2 pb-0.5 text-sm leading-5 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#10b981] !text-[#10b981] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] after:content-[''] group-hover:after:origin-bottom-left hover:after:origin-bottom-left group-hover:after:scale-x-100 hover:after:scale-x-100"
        >
          {{ card.cta }}
          <Icon
            name="ph:arrow-up-right"
            class="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </article>
    </div>
  </DocsSectionShell>
</template>
