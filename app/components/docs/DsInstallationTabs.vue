<script setup lang="ts">
import { useEventListener, useResizeObserver } from '@vueuse/core'
import SyntaxBlock from '~/components/workbench/code/SyntaxBlock.vue'

interface InstallTabItem {
  command: string
  id: string
  icon?: string
  label: string
}

const props = withDefaults(
  defineProps<{
    codeThemeId?: string
    modelValue: string
    tabs: InstallTabItem[]
  }>(),
  {
    codeThemeId: 'vscode-plus',
  },
)

const emit = defineEmits<{
  (event: 'copy', value: string): void
  (event: 'update:modelValue', value: string): void
}>()

const copyState = ref<'idle' | 'ok'>('idle')
let copyTimer: ReturnType<typeof setTimeout> | null = null
const tabRailRef = ref<HTMLElement | null>(null)
const tabRefs = new Map<string, HTMLElement>()
const activePillStyle = ref<Record<string, string>>({
  opacity: '0',
  transform: 'translate3d(0,0,0)',
})

const activeTab = computed(
  () =>
    props.tabs.find(tab => tab.id === props.modelValue) ?? props.tabs[0],
)
const activeCommand = computed(() => activeTab.value?.command ?? '')

function selectTab(id: string) {
  emit('update:modelValue', id)
}

function setTabRef(id: string, el: Element | null) {
  if (!el) {
    tabRefs.delete(id)
    return
  }
  tabRefs.set(id, el as HTMLElement)
}

function updateActivePill() {
  const rail = tabRailRef.value
  const active = tabRefs.get(props.modelValue)
  if (!rail || !active) {
    activePillStyle.value = {
      opacity: '0',
      transform: 'translate3d(0,0,0)',
    }
    return
  }

  const left = active.offsetLeft - rail.scrollLeft
  const top = active.offsetTop - rail.scrollTop
  activePillStyle.value = {
    width: `${active.offsetWidth}px`,
    height: `${active.offsetHeight}px`,
    transform: `translate3d(${left}px, ${top}px, 0)`,
    opacity: '1',
  }
}

async function copyCommand() {
  if (!activeCommand.value)
    return

  try {
    await navigator.clipboard.writeText(activeCommand.value)
    copyState.value = 'ok'
    emit('copy', activeCommand.value)
    if (copyTimer)
      clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copyState.value = 'idle'
      copyTimer = null
    }, 1200)
  }
  catch {
    // Ignore clipboard failures silently in docs context.
  }
}

onBeforeUnmount(() => {
  if (copyTimer)
    clearTimeout(copyTimer)
})

watch(
  () => [props.modelValue, props.tabs.map(tab => tab.id).join('|')],
  async () => {
    await nextTick()
    updateActivePill()
  },
  { immediate: true },
)

useEventListener(window, 'resize', updateActivePill, { passive: true })
useResizeObserver(tabRailRef, () => {
  updateActivePill()
})
</script>

<template>
  <div class="group overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
    <div
      ref="tabRailRef"
      class="relative flex items-center gap-1.5 border border-b-0 border-sand-5 rounded-xl rounded-bl-0 rounded-br-0 border-solid px-2.5 py-2 bg-pureBlack"
    >
      <span
        aria-hidden="true"
        class="pointer-events-none absolute left-0 top-0 rounded-lg bg-sand-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        :style="activePillStyle"
      />
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :ref="el => setTabRef(tab.id, el)"
        type="button"
        class="font-geist-mono-500 relative z-10 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] transition-all duration-180 ease-out"
        :class="
          tab.id === modelValue
            ? 'color-pureWhite'
            : 'color-sand-10 hover:bg-pureWhite/6  hover:color-sand-11 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]'
        "
        @click="selectTab(tab.id)"
      >
        <Icon v-if="tab.icon" :name="tab.icon" class="h-3.5 w-3.5" />
        {{ tab.label }}
      </button>

      <button
        type="button"
        class="font-geist-mono-500 absolute right-2.5 top-1/2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] color-sand-10 opacity-0 transition-all duration-180 ease-out -translate-y-1/2 hover:bg-sand-11/12 hover:color-sand-4 group-hover:opacity-100"
        @click="copyCommand"
      >
        <Icon
          :name="copyState === 'ok' ? 'ph:check' : 'ph:copy'"
          class="h-3.5 w-3.5"
        />
        <span>{{ copyState === "ok" ? "Copied" : "Copy" }}</span>
      </button>
    </div>

    <div
      class="border border-sand-5 rounded-xl rounded-tl-0 rounded-tr-0 border-solid bg-slate-1 px-4 py-3 text-xs leading-relaxed"
    >
      <SyntaxBlock
        class="font-geist-mono-400"
        :text="activeCommand"
        language="shellscript"
        :code-theme-id="codeThemeId"
        fallback-color="rgba(228, 230, 236, 0.94)"
      />
    </div>
  </div>
</template>
