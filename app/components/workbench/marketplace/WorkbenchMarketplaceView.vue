<script setup lang="ts">
import MarketplacePluginRow from '~/components/workbench/marketplace/MarketplacePluginRow.vue'
import MarketplaceSearchRow from '~/components/workbench/marketplace/MarketplaceSearchRow.vue'
import MarketplaceSection from '~/components/workbench/marketplace/MarketplaceSection.vue'
import MarketplaceToolbar from '~/components/workbench/marketplace/MarketplaceToolbar.vue'
import { useWorkbenchMarketplaceStore } from '~/stores/workbench-marketplace'

const store = useWorkbenchMarketplaceStore()

const heroTitle = 'Make Codex work your way'

const searchPlaceholder = computed(() =>
  store.marketplaceTab === 'plugins' ? 'Search plugins' : 'Search skills',
)

const installLabel = computed(() =>
  store.marketplaceTab === 'plugins' ? 'Install plugin' : 'Install skill',
)
</script>

<template>
  <div class="marketplace-view mx-auto max-w-[1100px] w-full flex flex-col px-4 pb-12 pt-2 md:px-8">
    <MarketplaceToolbar />

    <h1
      class="m-0 mb-8 text-center text-[clamp(22px,3.2vw,34px)] text-[color:var(--wb-text-primary)] font-normal leading-tight tracking-[-0.02em]"
    >
      {{ heroTitle }}
    </h1>

    <MarketplaceSearchRow :search-placeholder="searchPlaceholder" class="mb-10" />

    <div v-if="store.groupedSections.length === 0" class="py-16 text-center text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-muted)]">
      No results match your filters.
    </div>

    <template v-else>
      <MarketplaceSection
        v-for="section in store.groupedSections"
        :key="section.id"
        :title="section.title"
      >
        <MarketplacePluginRow
          v-for="item in section.items"
          :key="item.id"
          :item="item"
          :installed="store.isInstalled(item.id)"
          :install-label="installLabel"
          @toggle-install="store.toggleInstalled"
        />
      </MarketplaceSection>
    </template>
  </div>
</template>
