<script setup lang="ts">
import DocsSectionShell from '~/components/docs/DocsSectionShell.vue'
</script>

<template>
  <DocsSectionShell
    id="known-limitations"
    title="Known Limitations"
    content-class="flex flex-col gap-8 pb-40 text-base color-sand-11 font-light leading-normal lg:text-lg"
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
  </DocsSectionShell>
</template>
