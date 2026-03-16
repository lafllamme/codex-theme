<script setup lang="ts">
const props = defineProps<{
  collapsed?: boolean
}>()

const groups = [
  {
    label: 'Threads',
    items: [
      { title: 'Codex Theme', meta: '49 min', active: true },
      { title: 'Theme Quality', meta: '21 min' },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { title: 'Design System Sync', meta: '3 h' },
      { title: 'Review Config', meta: '1 d' },
      { title: 'Experiment Log', meta: '5 d' },
    ],
  },
]
</script>

<template>
  <aside
    :class="[
      'sidebar-shell border border-white/10 rounded-[18px] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-3 backdrop-blur-xl transition-all duration-300 ease-out',
      props.collapsed ? 'w-[72px]' : 'w-full',
    ]"
  >
    <div class="flex items-center justify-between gap-2 px-2 pb-2">
      <p v-if="!props.collapsed" class="font-geist-500 text-[11px] text-white/54 tracking-[0.13em] uppercase">
        Navigation
      </p>
      <button class="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70">
        <Icon name="ph:plus-bold" class="h-4 w-4" />
      </button>
    </div>

    <nav class="space-y-4">
      <section v-for="group in groups" :key="group.label" class="space-y-2">
        <p v-if="!props.collapsed" class="px-2 font-geist-500 text-[10px] text-white/42 tracking-[0.12em] uppercase">
          {{ group.label }}
        </p>

        <div class="space-y-1">
          <button
            v-for="item in group.items"
            :key="item.title"
            :class="[
              'group/item flex w-full items-center justify-between rounded-xl border px-2.5 py-2 text-left transition-all',
              item.active
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-transparent bg-transparent text-white/62 hover:border-white/12 hover:bg-white/6 hover:text-white/84',
            ]"
          >
            <span class="min-w-0 flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full" :class="item.active ? 'bg-[var(--un-preset-radix-mint9)]' : 'bg-white/35'" />
              <span v-if="!props.collapsed" class="truncate font-geist-500 text-[13px]">{{ item.title }}</span>
            </span>
            <span v-if="!props.collapsed" class="font-geist-mono-400 text-[11px] text-white/46">{{ item.meta }}</span>
          </button>
        </div>
      </section>
    </nav>

    <footer class="mt-6 border-t border-white/8 px-2 pt-3">
      <button class="flex w-full items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-white/62 transition-colors hover:border-white/12 hover:text-white/86">
        <Icon name="ph:gear-six-bold" class="h-4 w-4" />
        <span v-if="!props.collapsed" class="font-geist-500 text-[13px]">Settings</span>
      </button>
    </footer>
  </aside>
</template>

<style scoped>
.sidebar-shell {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 18px 30px rgba(0, 0, 0, 0.18);
}
</style>
