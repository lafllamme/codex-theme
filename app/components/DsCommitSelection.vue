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
    <div class="commit-chip-shell h-[24px] flex items-center overflow-hidden rounded-[10px] text-[color:var(--wb-text-primary)] leading-none font-[var(--font-ui)]">
      <button
        class="h-full flex items-center rounded-l-[8px] border-none bg-transparent px-1 text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-chip-ghost-bg-hover)]"
        @click.stop="triggerPrimary"
      >
        <Icon :name="selectedOption?.icon || 'ph:git-commit-bold'" class="ml-1 mr-2 size-5" />
        <span>{{ selectedOption?.label || 'Commit' }}</span>
      </button>
      <button
        class="h-full inline-flex items-center justify-center rounded-r-[8px] border-none bg-transparent px-1 text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-chip-ghost-bg-hover)]"
        aria-label="Open commit actions"
        @click.stop="toggleOpen"
      >
        <Icon name="ph:caret-down-bold" class="h-[12px] w-[12px]" />
      </button>
    </div>

    <div
      v-if="isOpen"
      class="absolute right-0 top-full z-40 mt-1.5 w-[142px] border border-[color:color-mix(in_srgb,var(--wb-border-2)_56%,transparent)] rounded-[17px] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_72%,transparent)] p-1.5 shadow-[0_12px_28px_rgba(0,0,0,0.24)] backdrop-blur-[16px]"
    >
      <p class="mb-1 px-1.5 text-[10px] text-[color:var(--wb-text-muted)] font-semibold leading-none">
        {{ menuTitle || 'Git Actions' }}
      </p>
      <ul class="grid m-0 list-none gap-0.5 p-0">
        <li v-for="option in options" :key="option.key">
          <button
            class="h-8 w-full flex appearance-none items-center gap-1.5 rounded-[8px] border-none bg-transparent px-1.5 text-left text-[10.5px] outline-none transition-colors"
            :class="option.disabled
              ? 'cursor-not-allowed text-[color:var(--wb-text-faint)]'
              : 'text-[color:var(--wb-text-primary)] hover:bg-[var(--wb-hover-bg)]'"
            @click="selectOption(option)"
          >
            <Icon :name="option.icon" class="size-4" />
            <span class="truncate font-medium">{{ option.label }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.commit-chip-shell {
  border: 1px solid var(--wb-chip-ghost-border);
  background: var(--wb-chip-ghost-bg);
}
</style>
