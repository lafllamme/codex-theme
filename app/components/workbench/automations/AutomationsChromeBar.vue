<script setup lang="ts">
function onNewAutomation() {
  /* stub: hook create-automation flow */
}
</script>

<template>
  <div
    class="automations-chrome-bar grid grid-cols-[minmax(0,1fr)_auto] min-h-[38px] min-w-0 w-full items-center gap-2 px-0.5"
  >
    <div class="automations-chrome-left min-w-0" aria-hidden="true" />
    <button
      type="button"
      class="h-8 inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border-none bg-[color:var(--wb-text-primary)] px-3 text-[length:var(--wb-ui-text-sm)] text-[color:var(--wb-bg-panel)] font-medium outline-none transition-opacity hover:opacity-90"
      @click="onNewAutomation"
    >
      <Icon name="ph:plus-bold" class="size-3.5" aria-hidden="true" />
      New automation
    </button>
  </div>
</template>

<style scoped>
/* Match ChatHeaderBar `.chat-header-left`: reserve space for window chrome when sidebar is collapsed. */
.automations-chrome-left {
  padding-inline-start: var(--wb-header-left-safe-area, 0px);
  transform: translateX(var(--wb-header-title-shift, 0px));
  transition: padding-inline-start 220ms var(--wb-sidebar-ease, cubic-bezier(0.22, 1, 0.36, 1));
}
</style>
