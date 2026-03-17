<script setup lang="ts">
defineProps<{
  open: boolean
  contrast: number
  opaqueWindows: boolean
}>()
</script>

<template>
  <section
    class="terminal-drawer overflow-hidden rounded-[var(--wb-r-md)] border border-[var(--wb-border-1)] bg-[rgba(8,9,11,0.95)]"
    :class="open ? 'terminal-drawer--open terminal-drawer--spaced' : 'terminal-drawer--closed'"
  >
    <header class="flex h-[34px] items-center justify-between border-b border-[var(--wb-border-2)] px-3 text-[12px] text-white/[0.82]">
      <span>Terminal</span>
      <span class="font-[var(--font-code)] opacity-[0.62]">local</span>
    </header>
    <div class="flex flex-col gap-2 p-[10px_12px_12px] font-[var(--font-code)] text-[var(--code-font-size)]">
      <p class="m-0 leading-[1.5]">
        <span class="opacity-[0.65]">$</span> pnpm dev
      </p>
      <p class="m-0 leading-[1.5]">
        <span class="text-[#59a8ff]">info</span> Nuxt ready at http://localhost:3000
      </p>
      <p class="m-0 leading-[1.5]">
        <span class="text-[var(--theme-added)]">+ added</span> app/components/workbench/TerminalDrawer.vue
      </p>
      <p class="m-0 leading-[1.5]">
        <span class="text-[var(--theme-removed)]">- removed</span> old/theme-panel.vue
      </p>
      <p class="m-0 leading-[1.5]">
        contrast: {{ contrast }} · opaqueWindows: {{ opaqueWindows }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.terminal-drawer {
  margin-top: 0;
  max-height: 0;
  opacity: 0;
  transform: translateY(12px);
  border-color: transparent;
  transition:
    margin-top 220ms ease,
    max-height 280ms ease,
    opacity 220ms ease,
    transform 220ms ease,
    border-color 220ms ease;
}

.terminal-drawer--spaced {
  margin-top: 8px;
}

.terminal-drawer--open {
  max-height: 240px;
  opacity: 1;
  transform: translateY(0);
  border-color: var(--wb-border-1);
}

.terminal-drawer--closed {
  pointer-events: none;
}

@media (max-width: 1180px) {
  .terminal-drawer {
    position: fixed;
    left: 8px;
    right: 8px;
    bottom: 8px;
    z-index: 41;
    box-shadow: 0 24px 40px rgba(0, 0, 0, 0.45);
  }

  .terminal-drawer--open {
    max-height: min(48vh, 320px);
  }
}
</style>
