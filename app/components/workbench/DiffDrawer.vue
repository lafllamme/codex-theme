<script setup lang="ts">
defineProps<{
  open: boolean
  accent: string
  contrast: number
}>()
</script>

<template>
  <aside class="diff-drawer" :class="open ? 'diff-drawer--open' : ''">
    <header class="drawer-head">
      <span>Not staged</span>
      <span class="drawer-meta">3</span>
    </header>
    <div class="diff-body">
      <div class="diff-column diff-column--remove">
        <p class="diff-line">
          <span class="line-no">2</span> surface: "sidebar",
        </p>
        <p class="diff-line">
          <span class="line-no">3</span> accent: "#2563eb",
        </p>
        <p class="diff-line">
          <span class="line-no">4</span> contrast: 42,
        </p>
      </div>
      <div class="diff-column diff-column--add">
        <p class="diff-line">
          <span class="line-no">2</span> surface: "sidebar-elevated",
        </p>
        <p class="diff-line">
          <span class="line-no">3</span> accent: "{{ accent }}",
        </p>
        <p class="diff-line">
          <span class="line-no">4</span> contrast: {{ contrast }},
        </p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.diff-drawer {
  width: 0;
  opacity: 0;
  transform: translateX(18px);
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: var(--wb-r-md);
  background: rgba(7, 8, 10, 0.96);
  transition:
    width 260ms ease,
    opacity 220ms ease,
    transform 220ms ease,
    border-color 220ms ease;
}

.diff-drawer--open {
  width: min(36vw, 460px);
  opacity: 1;
  transform: translateX(0);
  border-color: var(--wb-border-1);
}

.drawer-head {
  height: 34px;
  border-bottom: 1px solid var(--wb-border-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  color: rgba(255, 255, 255, 0.84);
  font-size: 12px;
}

.drawer-meta {
  border-radius: 999px;
  border: 1px solid var(--wb-border-2);
  padding: 0 8px;
  font-family: var(--font-code);
}

.diff-body {
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  font-family: var(--font-code);
  font-size: var(--code-font-size);
}

.diff-column {
  border-radius: 10px;
  border: 1px solid var(--wb-border-2);
  overflow: hidden;
}

.diff-column--remove {
  background: color-mix(in srgb, var(--theme-removed) 18%, transparent);
}

.diff-column--add {
  background: color-mix(in srgb, var(--theme-added) 18%, transparent);
}

.diff-line {
  margin: 0;
  padding: 8px 10px;
  line-height: 1.45;
}

.line-no {
  display: inline-block;
  width: 24px;
  opacity: 0.55;
}

@media (max-width: 1180px) {
  .diff-drawer {
    position: fixed;
    inset: 104px 8px 8px;
    z-index: 42;
    width: auto;
    max-width: none;
    transform: translateX(105%);
  }

  .diff-drawer--open {
    width: auto;
    transform: translateX(0);
  }
}
</style>
