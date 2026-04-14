<script setup lang="ts">
import ComposerDropdownMenu from '~/components/workbench/chat/ComposerDropdownMenu.vue'
import { useWorkbenchMarketplaceStore } from '~/stores/workbench-marketplace'

const store = useWorkbenchMarketplaceStore()
const openCreate = ref(false)

function tabClass(active: boolean) {
  return [
    'relative border-none bg-transparent px-1 pb-2 text-[length:var(--wb-ui-text)] font-medium outline-none transition-colors',
    active
      ? 'text-[color:var(--wb-text-primary)]'
      : 'text-[color:var(--wb-text-muted)] hover:text-[color:var(--wb-text-secondary)]',
  ].join(' ')
}
</script>

<template>
  <div class="mb-6 min-w-0 w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-end gap-5 border-b border-[color:var(--wb-chrome-hairline)]">
      <button
        type="button"
        :class="tabClass(store.marketplaceTab === 'plugins')"
        @click="store.setMarketplaceTab('plugins')"
      >
        Plugins
      </button>
      <button
        type="button"
        :class="tabClass(store.marketplaceTab === 'skills')"
        @click="store.setMarketplaceTab('skills')"
      >
        Skills
      </button>
    </div>

    <div class="flex shrink-0 items-center gap-2">
      <button
        type="button"
        class="h-8 inline-flex items-center gap-1.5 rounded-[8px] border-none bg-transparent px-2 text-[length:var(--wb-ui-text-sm)] text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
      >
        <Icon name="ph:gear-six" class="size-4" aria-hidden="true" />
        Manage
      </button>

      <ComposerDropdownMenu
        :open="openCreate"
        menu-class="w-[220px]"
        panel-padding-class="p-1.5"
        panel-class="normal-case rounded-[14px] border-[color:color-mix(in_srgb,var(--wb-border-2)_72%,transparent)] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_96%,transparent)] text-[color:var(--wb-text-primary)] shadow-[0_14px_34px_rgba(0,0,0,0.34)] backdrop-blur-[10px]"
        align="right"
        direction="down"
        @toggle="openCreate = !openCreate"
        @close="openCreate = false"
      >
        <template #trigger="{ toggle }">
          <button
            type="button"
            class="h-8 inline-flex items-center gap-1 rounded-[8px] border-none bg-transparent px-2 text-[length:var(--wb-ui-text-sm)] text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
            :aria-expanded="openCreate"
            @click="toggle"
          >
            Create
            <Icon name="ph:caret-down-bold" class="size-3 opacity-80" aria-hidden="true" />
          </button>
        </template>
        <template #default="{ close }">
          <button
            type="button"
            class="h-9 w-full flex items-center gap-2 rounded-[9px] border-none bg-transparent px-2 text-left text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
            @click="close"
          >
            <Icon name="ph:squares-four" class="size-4 shrink-0" />
            Create plugin
          </button>
          <button
            type="button"
            class="h-9 w-full flex items-center gap-2 rounded-[9px] border-none bg-transparent px-2 text-left text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
            @click="close"
          >
            <Icon name="ph:cube" class="size-4 shrink-0" />
            Create skill
          </button>
        </template>
      </ComposerDropdownMenu>

      <button
        type="button"
        class="size-8 inline-flex items-center justify-center rounded-[8px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
        aria-label="More actions"
      >
        <Icon name="ph:dots-three-bold" class="size-5" />
      </button>
    </div>
  </div>
</template>
