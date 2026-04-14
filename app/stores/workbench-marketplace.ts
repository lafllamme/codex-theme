import type { MarketplaceKind } from '~/data/workbench-plugins-catalog'
import { marketplaceCatalog } from '~/data/workbench-plugins-catalog'

export type MainStageView = 'chat' | 'marketplace'
export type MarketplaceTab = 'plugins' | 'skills'
export type BuiltByFilter = 'all' | 'openai' | 'community'

const pluginSectionOrder = ['featured', 'coding', 'design', 'productivity'] as const
const skillSectionOrder = ['recommended', 'system', 'personal'] as const

const pluginSectionTitles: Record<string, string> = {
  featured: 'Featured',
  coding: 'Coding',
  design: 'Design',
  productivity: 'Productivity',
}

const skillSectionTitles: Record<string, string> = {
  recommended: 'Recommended',
  system: 'System',
  personal: 'Personal',
}

export const useWorkbenchMarketplaceStore = defineStore('workbench-marketplace', () => {
  const mainStageView = ref<MainStageView>('chat')
  const marketplaceTab = ref<MarketplaceTab>('plugins')
  const searchQuery = ref('')
  const builtByFilter = ref<BuiltByFilter>('all')
  /** `all` or a section id (featured, coding, … / recommended, …). */
  const categoryFilter = ref<string>('all')
  const installedIds = ref<string[]>(['github', 'notion', 'imggen', 'openaidocs', 'plugincreator', 'skillcreator', 'skillinstaller', 'agentbrowser', 'squirrelscan'])

  function setMainStageView(view: MainStageView) {
    mainStageView.value = view
  }

  function openMarketplace() {
    mainStageView.value = 'marketplace'
    marketplaceTab.value = 'plugins'
  }

  function setMarketplaceTab(tab: MarketplaceTab) {
    marketplaceTab.value = tab
    categoryFilter.value = 'all'
  }

  function isInstalled(id: string) {
    return installedIds.value.includes(id)
  }

  function toggleInstalled(id: string) {
    const set = new Set(installedIds.value)
    if (set.has(id))
      set.delete(id)
    else
      set.add(id)
    installedIds.value = [...set]
  }

  const activeKind = computed<MarketplaceKind>(() =>
    marketplaceTab.value === 'plugins' ? 'plugin' : 'skill',
  )

  const filteredItems = computed(() => {
    let list = marketplaceCatalog.filter(item => item.kind === activeKind.value)
    if (builtByFilter.value !== 'all')
      list = list.filter(item => item.builtBy === builtByFilter.value)
    if (categoryFilter.value !== 'all')
      list = list.filter(item => item.section === categoryFilter.value)
    const q = searchQuery.value.trim().toLowerCase()
    if (q) {
      list = list.filter(
        item =>
          item.name.toLowerCase().includes(q)
          || item.description.toLowerCase().includes(q),
      )
    }
    return list
  })

  const groupedSections = computed(() => {
    const order = marketplaceTab.value === 'plugins' ? pluginSectionOrder : skillSectionOrder
    const titles = marketplaceTab.value === 'plugins' ? pluginSectionTitles : skillSectionTitles
    const items = filteredItems.value
    return order.map((id) => {
      const sectionItems = items.filter(i => i.section === id)
      return {
        id,
        title: titles[id] ?? id,
        items: sectionItems,
      }
    }).filter(section => section.items.length > 0)
  })

  const categoryOptions = computed(() => {
    if (marketplaceTab.value === 'plugins') {
      return [
        { id: 'all', label: 'All' },
        { id: 'featured', label: 'Featured' },
        { id: 'coding', label: 'Coding' },
        { id: 'design', label: 'Design' },
        { id: 'productivity', label: 'Productivity' },
      ]
    }
    return [
      { id: 'all', label: 'All' },
      { id: 'recommended', label: 'Recommended' },
      { id: 'system', label: 'System' },
      { id: 'personal', label: 'Personal' },
    ]
  })

  const builtByOptions = [
    { id: 'all' as const, label: 'All' },
    { id: 'openai' as const, label: 'Built by OpenAI' },
    { id: 'community' as const, label: 'Community' },
  ]

  return {
    mainStageView,
    marketplaceTab,
    searchQuery,
    builtByFilter,
    categoryFilter,
    installedIds,
    setMainStageView,
    openMarketplace,
    setMarketplaceTab,
    isInstalled,
    toggleInstalled,
    filteredItems,
    groupedSections,
    categoryOptions,
    builtByOptions,
  }
})
