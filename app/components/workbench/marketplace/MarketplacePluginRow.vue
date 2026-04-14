<script setup lang="ts">
import type { MarketplaceItem } from '~/data/workbench-plugins-catalog'

withDefaults(
  defineProps<{
    item: MarketplaceItem
    installed: boolean
    installLabel?: string
  }>(),
  { installLabel: 'Install plugin' },
)

const emit = defineEmits<{
  toggleInstall: [id: string]
}>()
</script>

<template>
  <div
    class="group/marketplace-row min-h-[52px] min-w-0 w-full flex items-center gap-3 rounded-[12px] px-2 py-1.5 transition-colors duration-150 hover:bg-[color:color-mix(in_srgb,var(--wb-hover-bg)_85%,transparent)]"
  >
    <div
      class="size-9 flex shrink-0 items-center justify-center border border-[color:color-mix(in_srgb,var(--wb-border-2)_55%,transparent)] rounded-[10px] bg-[color:color-mix(in_srgb,var(--wb-bg-panel-elevated,var(--wb-bg-panel))_92%,var(--wb-text-primary)_8%)]"
      aria-hidden="true"
    >
      <Icon :name="item.icon" class="size-5 text-[color:var(--wb-text-primary)]" />
    </div>
    <div class="min-w-0 flex-1">
      <p class="m-0 truncate text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-primary)] font-semibold leading-tight">
        {{ item.name }}
      </p>
      <p class="m-0 mt-0.5 truncate text-[length:var(--wb-ui-text-sm)] text-[color:var(--wb-text-muted)] leading-snug">
        {{ item.description }}
      </p>
    </div>
    <div class="flex shrink-0 items-center justify-end">
      <span
        v-if="installed"
        class="size-8 inline-flex items-center justify-center text-[color:var(--wb-text-faint)]"
        aria-label="Installed"
      >
        <Icon name="ph:check-bold" class="size-[18px]" />
      </span>
      <button
        v-else
        type="button"
        class="size-8 inline-flex items-center justify-center rounded-full border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
        :title="installLabel"
        :aria-label="installLabel"
        @click="emit('toggleInstall', item.id)"
      >
        <Icon name="ph:plus-bold" class="size-[18px]" />
      </button>
    </div>
  </div>
</template>
