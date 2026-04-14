<script setup lang="ts">
import ComposerDropdownMenu from '~/components/workbench/chat/ComposerDropdownMenu.vue'
import { useWorkbenchMarketplaceStore } from '~/stores/workbench-marketplace'

const store = useWorkbenchMarketplaceStore()
const openCreate = ref(false)

function tabClassHeader(active: boolean) {
  return [
    'relative shrink-0 border-none rounded-[8px] bg-transparent px-2 py-0.5 text-[length:var(--wb-ui-text)] outline-none transition-colors',
    active
      ? 'text-[color:var(--wb-text-primary)] font-semibold'
      : 'text-[color:var(--wb-text-muted)] font-medium hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-secondary)]',
  ].join(' ')
}
</script>

<template>
  <div
    class="marketplace-toolbar grid grid-cols-[minmax(0,1fr)_auto] min-h-[38px] min-w-0 w-full items-center gap-2 px-0.5"
  >
    <div class="marketplace-toolbar-tabs min-w-0 flex min-h-0 items-center gap-1 overflow-hidden">
      <button
        type="button"
        :class="tabClassHeader(store.marketplaceTab === 'plugins')"
        @click="store.setMarketplaceTab('plugins')"
      >
        Plugins
      </button>
      <button
        type="button"
        :class="tabClassHeader(store.marketplaceTab === 'skills')"
        @click="store.setMarketplaceTab('skills')"
      >
        Skills
      </button>
    </div>

    <div class="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        class="h-7 inline-flex items-center gap-1 rounded-[8px] border-none bg-transparent px-1.5 text-[length:var(--wb-ui-text-sm)] text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
      >
        <Icon name="ph:gear-six" class="size-3.5" aria-hidden="true" />
        <span class="max-[520px]:hidden">Manage</span>
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
            class="h-7 inline-flex items-center gap-0.5 rounded-[8px] border-none bg-transparent px-1.5 text-[length:var(--wb-ui-text-sm)] text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
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
        class="size-7 inline-flex items-center justify-center rounded-[8px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
        aria-label="More actions"
      >
        <Icon name="ph:dots-three-bold" class="size-[18px]" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Match ChatHeaderBar `.chat-header-left`: clear fake window controls when sidebar is collapsed. */
.marketplace-toolbar-tabs {
  padding-inline-start: var(--wb-header-left-safe-area, 0px);
  transform: translateX(var(--wb-header-title-shift, 0px));
  transition: padding-inline-start 220ms var(--wb-sidebar-ease, cubic-bezier(0.22, 1, 0.36, 1));
}
</style>
