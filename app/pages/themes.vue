<script setup lang="ts">
definePageMeta({
  layout: 'default',
  pageTransition: {
    name: 'theme-page',
    mode: 'out-in',
  },
})
</script>

<template>
  <DsCodexWorkbench />
</template>

<style>
.theme-page-enter-active,
.theme-page-leave-active {
  transition: all 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.theme-page-enter-from,
.theme-page-leave-to {
  opacity: 0;
  filter: blur(18px);
  transform: translateY(16px) scale(0.985);
}
</style>
