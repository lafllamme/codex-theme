<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'

const props = withDefaults(defineProps<{
  open: boolean
  menuClass?: string
  align?: 'left' | 'right'
  direction?: 'up' | 'down'
}>(), {
  menuClass: 'w-[220px]',
  align: 'left',
  direction: 'up',
})

const emit = defineEmits<{
  toggle: []
  close: []
}>()

const rootRef = ref<HTMLElement | null>(null)

function toggle() {
  emit('toggle')
}

function close() {
  emit('close')
}

onClickOutside(rootRef, () => {
  if (props.open)
    close()
})

useEventListener(document, 'keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.open)
    close()
})
</script>

<template>
  <div ref="rootRef" class="relative inline-flex">
    <slot name="trigger" :open="open" :toggle="toggle" />

    <div
      v-if="open"
      class="absolute z-40 border border-[color:color-mix(in_srgb,var(--wb-border-2)_56%,transparent)] rounded-[20px] bg-[color:color-mix(in_srgb,var(--wb-bubble-bg)_72%,transparent)] p-2.5 shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-[16px]"
      :class="[
        align === 'right' ? 'right-0' : 'left-0',
        direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2',
        menuClass,
      ]"
    >
      <slot :close="close" />
    </div>
  </div>
</template>
