<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

export type ComposerMenuTrigger = '/' | '@' | '$'
export type ComposerMenuItemType = 'command' | 'plugin' | 'skill' | 'file'

type ComposerMenuTone = 'command' | 'plugin' | 'skill' | 'file'

export interface ComposerMenuItem {
  id: string
  type: ComposerMenuItemType
  label: string
  description?: string
  icon: string
  path?: string
  meta?: string
  tone?: ComposerMenuTone
  disabled?: boolean
}

export interface ComposerMenuSection {
  id: string
  title: string
  items: ComposerMenuItem[]
}

const props = withDefaults(
  defineProps<{
    open: boolean
    trigger: ComposerMenuTrigger | null
    sections: ComposerMenuSection[]
    activeItemId?: string
    insetClass?: string
  }>(),
  {
    activeItemId: '',
    insetClass: 'left-0 right-0',
  },
)

const emit = defineEmits<{
  select: [item: ComposerMenuItem]
  close: []
}>()

const rootRef = ref<HTMLElement | null>(null)

onClickOutside(rootRef, () => {
  if (props.open)
    emit('close')
})

function toneClass(item: ComposerMenuItem) {
  if (item.disabled)
    return 'text-[color:var(--wb-text-faint)]'

  switch (item.tone ?? item.type) {
    case 'plugin':
    case 'skill':
      return 'text-[color:color-mix(in_srgb,var(--theme-skill)_70%,var(--wb-text-primary)_30%)]'
    case 'file':
      return 'text-[color:color-mix(in_srgb,var(--theme-accent)_68%,var(--wb-text-primary)_32%)]'
    default:
      return 'text-[color:var(--wb-text-primary)]'
  }
}

function select(item: ComposerMenuItem) {
  if (item.disabled)
    return
  emit('select', item)
}
</script>

<template>
  <div
    v-if="open"
    ref="rootRef"
    class="pointer-events-auto absolute bottom-full z-[65] mb-3 border border-[color:color-mix(in_srgb,var(--wb-border-2)_56%,transparent)] rounded-[20px] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_72%,transparent)] p-2 backdrop-blur-[16px]"
    :class="insetClass"
  >
    <div class="max-h-[320px] overflow-y-auto">
      <div
        v-for="section in sections"
        :key="section.id"
        class="pb-1"
      >
        <p class="mb-1 mt-1 px-2 text-[12px] text-[color:var(--wb-text-muted)] font-semibold leading-none">
          {{ section.title }}
        </p>
        <div class="grid gap-0.5">
          <button
            v-for="item in section.items"
            :key="item.id"
            class="min-h-[36px] w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 text-left text-[15px] font-[var(--font-ui)] outline-none transition-colors"
            :class="[
              item.disabled
                ? 'cursor-default text-[color:var(--wb-text-faint)]'
                : 'hover:bg-[var(--wb-hover-bg)]',
              activeItemId === item.id && !item.disabled
                ? 'bg-[var(--wb-hover-bg)]'
                : '',
            ]"
            @click="select(item)"
          >
            <span class="min-w-0 inline-flex items-center gap-2.5">
              <Icon
                :name="item.icon"
                class="h-[16px] w-[16px] shrink-0 text-[color:var(--wb-text-secondary)]"
              />
              <span class="min-w-0 inline-flex items-center gap-2">
                <span class="truncate" :class="toneClass(item)">{{ item.label }}</span>
                <span
                  v-if="item.description"
                  class="truncate text-[color:var(--wb-text-muted)]"
                >
                  {{ item.description }}
                </span>
              </span>
            </span>

            <span
              v-if="item.meta"
              class="ml-3 shrink-0 text-[14px] text-[color:var(--wb-text-muted)]"
            >
              {{ item.meta }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
