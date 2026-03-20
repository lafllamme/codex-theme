<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'

interface CommitOption {
  key: string
  label: string
  icon: string
  disabled?: boolean
}

const props = defineProps<{
  options: CommitOption[]
  menuTitle?: string
}>()
const emit = defineEmits<{
  primaryAction: [key: string]
}>()

const selectedValue = defineModel<string>({ required: true })

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const selectedOption = computed(() => {
  return props.options.find(option => option.key === selectedValue.value) ?? props.options[0]
})

function toggleOpen() {
  isOpen.value = !isOpen.value
}

function selectOption(option: CommitOption) {
  if (option.disabled)
    return
  selectedValue.value = option.key
  isOpen.value = false
}

function triggerPrimary() {
  emit('primaryAction', selectedOption.value?.key ?? 'commit')
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
  <div ref="rootRef" class="relative inline-flex">
    <div class="group h-8 inline-flex items-center border border-[color:var(--wb-chip-ghost-border)] rounded-[11px] bg-[var(--wb-chip-ghost-bg)] text-[11px] text-[color:var(--wb-text-primary)] font-[var(--font-ui)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--wb-chip-ghost-border)_42%,transparent)_inset] transition-colors hover:bg-[var(--wb-chip-ghost-bg-hover)]">
      <button
        class="h-full inline-flex items-center gap-1 rounded-l-[10px] border-none bg-transparent px-2 text-[color:var(--wb-text-primary)] outline-none transition-colors"
        @click.stop="triggerPrimary"
      >
        <Icon :name="selectedOption?.icon || 'ph:git-commit'" class="h-[14px] w-[14px]" />
        <span>{{ selectedOption?.label || 'Commit' }}</span>
      </button>
      <button
        class="mr-1 h-[22px] w-[22px] inline-flex items-center justify-center rounded-[8px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors group-hover:text-[color:var(--wb-text-primary)]"
        aria-label="Open commit actions"
        @click.stop="toggleOpen"
      >
        <Icon name="ph:caret-down-bold" class="h-[11px] w-[11px]" />
      </button>
    </div>

    <div
      v-if="isOpen"
      class="absolute right-0 top-full z-40 mt-2 w-[140px] border border-[color:var(--wb-border-2)] rounded-[22px] bg-[var(--wb-bubble-bg)] p-2.5 shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-[12px]"
    >
      <p class="mb-2 px-2 text-[11px] text-[color:var(--wb-text-muted)] font-semibold">
        {{ menuTitle || 'Git Actions' }}
      </p>
      <ul class="grid m-0 list-none gap-1 p-0">
        <li v-for="option in options" :key="option.key">
          <button
            class="h-9 w-full flex appearance-none items-center gap-2 rounded-[10px] border-none bg-transparent px-2.5 text-left text-[11.5px] outline-none transition-colors"
            :class="option.disabled
              ? 'cursor-not-allowed text-[color:var(--wb-text-faint)]'
              : 'text-[color:var(--wb-text-primary)] hover:bg-[var(--wb-hover-bg)]'"
            @click="selectOption(option)"
          >
            <Icon :name="option.icon" class="h-[14px] w-[14px]" />
            <span class="truncate font-medium">{{ option.label }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
