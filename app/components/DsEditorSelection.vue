<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'

interface EditorOption {
  label: string
  icon: string
}

const props = defineProps<{
  options: EditorOption[]
}>()

const selectedValue = defineModel<string>({ required: true })

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const selectedOption = computed(() => {
  return props.options.find(option => option.label === selectedValue.value) ?? props.options[0]
})

function toggleOpen() {
  isOpen.value = !isOpen.value
}

function selectOption(label: string) {
  selectedValue.value = label
  isOpen.value = false
}

onClickOutside(rootRef, () => {
  isOpen.value = false
})

useEventListener(document, 'keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape')
    isOpen.value = false
})
</script>

<template>
  <div ref="rootRef" class="relative">
    <div class="h-[26px] inline-flex items-center overflow-hidden border border-[color:var(--wb-chip-ghost-border)] rounded-[10px] bg-[var(--wb-chip-ghost-bg)] text-[10.5px] text-[color:var(--wb-text-primary)] leading-none shadow-[inset_0_0_0_1px_var(--wb-chip-ghost-border)]">
      <button
        aria-label="Open editor selection"
        class="h-full inline-flex items-center rounded-l-[9px] border-none bg-transparent pl-2 pr-1.5 outline-none transition-colors hover:bg-[var(--wb-chip-ghost-bg-hover)]"
        @click.stop="toggleOpen"
      >
        <span class="h-[16px] w-[16px] inline-flex items-center justify-center rounded-[5px] bg-[color-mix(in_srgb,var(--wb-bg-panel)_52%,black_48%)]">
          <Icon :name="selectedOption?.icon || 'simple-icons:cursor'" class="h-[10px] w-[10px] text-[color:var(--wb-text-primary)]" />
        </span>
      </button>
      <button
        aria-label="Open editor selection"
        class="h-full inline-flex items-center justify-center rounded-r-[9px] border-none bg-transparent px-1.5 text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-chip-ghost-bg-hover)] hover:text-[color:var(--wb-text-primary)]"
        @click.stop="toggleOpen"
      >
        <Icon name="ph:caret-down-bold" class="h-[12px] w-[12px]" />
      </button>
    </div>

    <div
      v-if="isOpen"
      class="absolute right-0 top-full z-40 mt-2 w-[168px] border border-[color:color-mix(in_srgb,var(--wb-border-2)_56%,transparent)] rounded-[20px] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_72%,transparent)] p-2.5 shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-[16px]"
    >
      <ul class="grid m-0 list-none gap-1 p-0">
        <li v-for="option in options" :key="option.label">
          <button
            class="h-11 w-full flex appearance-none items-center gap-2.5 rounded-[10px] border-none bg-transparent px-2.5 text-left text-[16px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
            @click="selectOption(option.label)"
          >
            <span class="h-[28px] w-[28px] inline-flex shrink-0 items-center justify-center rounded-[7px] bg-[color-mix(in_srgb,var(--wb-bg-panel)_72%,black_28%)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--wb-border-2)_62%,transparent)_inset]">
              <Icon :name="option.icon" class="h-[16px] w-[16px] text-[color:var(--wb-text-primary)]" />
            </span>
            <span class="truncate font-medium leading-none">{{ option.label }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
