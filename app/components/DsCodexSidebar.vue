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
    class="sidebar-shell p-3 transition-all duration-300 ease-out" :class="[
      props.collapsed ? 'w-[72px]' : 'w-full',
    ]"
  >
    <div class="flex items-center justify-between gap-2 px-2 pb-2">
      <p v-if="!props.collapsed" class="font-geist-500 text-white/56 text-[11px] tracking-[0.13em] uppercase">
        Navigation
      </p>
      <button class="icon-btn">
        <Icon name="ph:plus-bold" class="h-4 w-4" />
      </button>
    </div>

    <nav class="space-y-4">
      <section v-for="group in groups" :key="group.label" class="space-y-2">
        <p v-if="!props.collapsed" class="font-geist-500 text-white/45 px-2 text-[10px] tracking-[0.12em] uppercase">
          {{ group.label }}
        </p>

        <div class="space-y-1">
          <button
            v-for="item in group.items"
            :key="item.title"
            class="group/item w-full flex items-center justify-between border rounded-xl px-2.5 py-2 text-left transition-all" :class="[
              item.active
                ? 'border-white/26 bg-white/12 text-white'
                : 'border-transparent bg-transparent text-white/62 hover:border-white/14 hover:bg-white/8 hover:text-white/84',
            ]"
          >
            <span class="min-w-0 flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full" :class="item.active ? 'bg-[var(--un-preset-radix-mint9)]' : 'bg-white/35'" />
              <span v-if="!props.collapsed" class="font-geist-500 truncate text-[13px]">{{ item.title }}</span>
            </span>
            <span v-if="!props.collapsed" class="font-geist-mono-400 text-white/46 text-[11px]">{{ item.meta }}</span>
          </button>
        </div>
      </section>
    </nav>

    <footer class="border-white/10 mt-6 border-t px-2 pt-3">
      <button class="settings-btn">
        <Icon name="ph:gear-six-bold" class="h-4 w-4" />
        <span v-if="!props.collapsed" class="font-geist-500 text-[13px]">Settings</span>
      </button>
      <div v-if="!props.collapsed" class="border-white/10 bg-black/40 mt-3 border rounded-lg px-2.5 py-2">
        <p class="font-geist-mono-400 text-white/52 text-[11px]">
          Lokal · Vollzugriff
        </p>
        <p class="font-geist-500 text-white/66 mt-1 text-[11px]">
          Workspace synced 2m ago
        </p>
      </div>
    </footer>
  </aside>
</template>

<style scoped>
.sidebar-shell {
  border: 1px solid var(--panel-border, rgba(255, 255, 255, 0.14));
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(9, 10, 12, 0.94), rgba(8, 9, 11, 0.88));
  backdrop-filter: blur(var(--panel-blur, 26px));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 18px 30px rgba(0, 0, 0, 0.22);
}

.icon-btn {
  height: 32px;
  width: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.72);
}

.settings-btn {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid transparent;
  color: rgba(255, 255, 255, 0.66);
  padding: 6px 8px;
  transition: all 160ms ease;
}

.settings-btn:hover {
  border-color: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.9);
}
</style>
