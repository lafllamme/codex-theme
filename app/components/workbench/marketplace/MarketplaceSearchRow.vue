<script setup lang="ts">
import ComposerDropdownMenu from '~/components/workbench/chat/ComposerDropdownMenu.vue'
import { useWorkbenchMarketplaceStore } from '~/stores/workbench-marketplace'

defineProps<{
  searchPlaceholder: string
}>()

const store = useWorkbenchMarketplaceStore()
const openBuiltBy = ref(false)
const openCategory = ref(false)

const builtByLabel = computed(() =>
  store.builtByOptions.find(o => o.id === store.builtByFilter)?.label ?? 'All',
)

const categoryLabel = computed(() =>
  store.categoryOptions.find(o => o.id === store.categoryFilter)?.label ?? 'All',
)
</script>

<template>
  <div class="min-w-0 w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2.5">
    <div
      class="min-h-[40px] min-w-0 flex flex-1 items-center gap-2 border border-[color:color-mix(in_srgb,var(--wb-border-2)_65%,transparent)] rounded-full bg-[color:color-mix(in_srgb,var(--wb-bg-panel-elevated,var(--wb-bg-panel))_88%,transparent)] px-3.5 py-2 pl-3"
    >
      <Icon name="ph:magnifying-glass-bold" class="size-[18px] shrink-0 text-[color:var(--wb-text-muted)]" aria-hidden="true" />
      <input
        v-model="store.searchQuery"
        type="search"
        :placeholder="searchPlaceholder"
        class="min-w-0 flex-1 border-none bg-transparent p-0 text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-primary)] outline-none placeholder:text-[color:var(--wb-text-faint)]"
        :aria-label="searchPlaceholder"
        autocomplete="off"
      >
    </div>

    <div class="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
      <ComposerDropdownMenu
        :open="openBuiltBy"
        menu-class="min-w-[200px]"
        panel-padding-class="p-1.5"
        panel-class="normal-case rounded-[14px] border-[color:color-mix(in_srgb,var(--wb-border-2)_72%,transparent)] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_96%,transparent)] text-[color:var(--wb-text-primary)] shadow-[0_14px_34px_rgba(0,0,0,0.34)] backdrop-blur-[10px]"
        align="left"
        direction="down"
        @toggle="openBuiltBy = !openBuiltBy"
        @close="openBuiltBy = false"
      >
        <template #trigger="{ toggle }">
          <button
            type="button"
            class="h-9 max-w-full min-w-0 inline-flex items-center gap-1.5 border border-[color:color-mix(in_srgb,var(--wb-border-2)_55%,transparent)] rounded-full bg-[color:color-mix(in_srgb,var(--wb-bg-panel-elevated,var(--wb-bg-panel))_90%,transparent)] px-3 py-1.5 text-[length:var(--wb-ui-text-sm)] text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
            :aria-expanded="openBuiltBy"
            @click="toggle"
          >
            <span class="truncate">{{ builtByLabel }}</span>
            <Icon name="ph:caret-down-bold" class="size-3 shrink-0 opacity-80" aria-hidden="true" />
          </button>
        </template>
        <template #default="{ close }">
          <p class="m-0 mb-1 px-1.5 text-[11px] text-[color:var(--wb-text-muted)] font-semibold tracking-wide uppercase">
            Source
          </p>
          <button
            v-for="opt in store.builtByOptions"
            :key="opt.id"
            type="button"
            class="h-9 w-full flex items-center justify-between rounded-[9px] border-none bg-transparent px-1.5 text-left text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
            @click="store.builtByFilter = opt.id; close()"
          >
            <span>{{ opt.label }}</span>
            <Icon v-if="store.builtByFilter === opt.id" name="ph:check-bold" class="size-4 text-[color:var(--wb-text-secondary)]" />
          </button>
        </template>
      </ComposerDropdownMenu>

      <ComposerDropdownMenu
        :open="openCategory"
        menu-class="min-w-[200px]"
        panel-padding-class="p-1.5"
        panel-class="normal-case rounded-[14px] border-[color:color-mix(in_srgb,var(--wb-border-2)_72%,transparent)] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_96%,transparent)] text-[color:var(--wb-text-primary)] shadow-[0_14px_34px_rgba(0,0,0,0.34)] backdrop-blur-[10px]"
        align="left"
        direction="down"
        @toggle="openCategory = !openCategory"
        @close="openCategory = false"
      >
        <template #trigger="{ toggle }">
          <button
            type="button"
            class="h-9 max-w-full min-w-0 inline-flex items-center gap-1.5 border border-[color:color-mix(in_srgb,var(--wb-border-2)_55%,transparent)] rounded-full bg-[color:color-mix(in_srgb,var(--wb-bg-panel-elevated,var(--wb-bg-panel))_90%,transparent)] px-3 py-1.5 text-[length:var(--wb-ui-text-sm)] text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
            :aria-expanded="openCategory"
            @click="toggle"
          >
            <span class="truncate">{{ categoryLabel }}</span>
            <Icon name="ph:caret-down-bold" class="size-3 shrink-0 opacity-80" aria-hidden="true" />
          </button>
        </template>
        <template #default="{ close }">
          <p class="m-0 mb-1 px-1.5 text-[11px] text-[color:var(--wb-text-muted)] font-semibold tracking-wide uppercase">
            Category
          </p>
          <button
            v-for="opt in store.categoryOptions"
            :key="opt.id"
            type="button"
            class="h-9 w-full flex items-center justify-between rounded-[9px] border-none bg-transparent px-1.5 text-left text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
            @click="store.categoryFilter = opt.id; close()"
          >
            <span>{{ opt.label }}</span>
            <Icon v-if="store.categoryFilter === opt.id" name="ph:check-bold" class="size-4 text-[color:var(--wb-text-secondary)]" />
          </button>
        </template>
      </ComposerDropdownMenu>
    </div>
  </div>
</template>
