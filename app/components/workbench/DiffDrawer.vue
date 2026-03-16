<script setup lang="ts">
defineProps<{
  open: boolean
  accent: string
  contrast: number
}>()
</script>

<template>
  <aside class="diff-drawer overflow-hidden rounded-[var(--wb-r-md)] border border-transparent bg-[rgba(7,8,10,0.96)]" :class="open ? 'diff-drawer--open' : ''">
    <header class="flex h-[34px] items-center justify-between border-b border-[var(--wb-border-2)] px-3 text-[12px] text-white/[0.84]">
      <span>Not staged</span>
      <span class="rounded-full border border-[var(--wb-border-2)] px-2 font-[var(--font-code)]">3</span>
    </header>
    <div class="grid grid-cols-1 gap-2 p-2.5 font-[var(--font-code)] text-[var(--code-font-size)]">
      <div class="overflow-hidden rounded-[10px] border border-[var(--wb-border-2)] bg-[color-mix(in_srgb,var(--theme-removed)_18%,transparent)]">
        <p class="m-0 p-[8px_10px] leading-[1.45]">
          <span class="inline-block w-6 opacity-[0.55]">2</span> surface: "sidebar",
        </p>
        <p class="m-0 p-[8px_10px] leading-[1.45]">
          <span class="inline-block w-6 opacity-[0.55]">3</span> accent: "#2563eb",
        </p>
        <p class="m-0 p-[8px_10px] leading-[1.45]">
          <span class="inline-block w-6 opacity-[0.55]">4</span> contrast: 42,
        </p>
      </div>
      <div class="overflow-hidden rounded-[10px] border border-[var(--wb-border-2)] bg-[color-mix(in_srgb,var(--theme-added)_18%,transparent)]">
        <p class="m-0 p-[8px_10px] leading-[1.45]">
          <span class="inline-block w-6 opacity-[0.55]">2</span> surface: "sidebar-elevated",
        </p>
        <p class="m-0 p-[8px_10px] leading-[1.45]">
          <span class="inline-block w-6 opacity-[0.55]">3</span> accent: "{{ accent }}",
        </p>
        <p class="m-0 p-[8px_10px] leading-[1.45]">
          <span class="inline-block w-6 opacity-[0.55]">4</span> contrast: {{ contrast }},
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
