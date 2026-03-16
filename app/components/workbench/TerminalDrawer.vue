<script setup lang="ts">
defineProps<{
  open: boolean
  contrast: number
  opaqueWindows: boolean
}>()
</script>

<template>
  <section class="terminal-drawer" :class="open ? 'terminal-drawer--open' : ''">
    <header class="drawer-head">
      <span>Terminal</span>
      <span class="drawer-meta">local</span>
    </header>
    <div class="terminal-body">
      <p class="term-line">
        <span class="term-dim">$</span> pnpm dev
      </p>
      <p class="term-line">
        <span class="term-info">info</span> Nuxt ready at http://localhost:3000
      </p>
      <p class="term-line">
        <span class="term-add">+ added</span> app/components/workbench/TerminalDrawer.vue
      </p>
      <p class="term-line">
        <span class="term-del">- removed</span> old/theme-panel.vue
      </p>
      <p class="term-line">
        contrast: {{ contrast }} · opaqueWindows: {{ opaqueWindows }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.terminal-drawer {
  margin-top: 8px;
  border: 1px solid var(--wb-border-1);
  border-radius: var(--wb-r-md);
  background: rgba(8, 9, 11, 0.95);
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transform: translateY(12px);
  transition:
    max-height 280ms ease,
    opacity 220ms ease,
    transform 220ms ease;
}

.terminal-drawer--open {
  max-height: 240px;
  opacity: 1;
  transform: translateY(0);
}

.drawer-head {
  height: 34px;
  border-bottom: 1px solid var(--wb-border-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 12px;
}

.drawer-meta {
  font-family: var(--font-code);
  opacity: 0.62;
}

.terminal-body {
  padding: 10px 12px 12px;
  font-family: var(--font-code);
  font-size: var(--code-font-size);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.term-line {
  margin: 0;
  line-height: 1.5;
}

.term-dim { opacity: 0.65; }
.term-info { color: #59a8ff; }
.term-add { color: var(--theme-added); }
.term-del { color: var(--theme-removed); }

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
