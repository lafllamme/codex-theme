<script setup lang="ts">
import DocsInstallBento from '~/components/docs/DocsInstallBento.vue'
import DocsSectionShell from '~/components/docs/DocsSectionShell.vue'
</script>

<template>
  <DocsSectionShell id="installation" title="Installation">
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
  </DocsSectionShell>
</template>
