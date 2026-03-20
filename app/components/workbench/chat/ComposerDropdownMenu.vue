<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'

const props = withDefaults(defineProps<{
  open: boolean
  width?: string
  align?: 'left' | 'right'
}>(), {
  width: '220px',
  align: 'left',
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
      class="absolute bottom-full z-40 mb-2 border border-[color:var(--wb-border-2)] rounded-[20px] bg-[var(--wb-bubble-bg)] p-2.5 shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-[16px]"
      :class="align === 'right' ? 'right-0' : 'left-0'"
      :style="{ width }"
    >
      <slot :close="close" />
    </div>
  </div>
</template>
