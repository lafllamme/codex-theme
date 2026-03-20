<script setup lang="ts">
const checked = defineModel<boolean>({ required: true })

const props = withDefaults(defineProps<{
  disabled?: boolean
  trackWidth?: number
  trackHeight?: number
  thumbSize?: number
  onClass?: string
  offClass?: string
  thumbOnClass?: string
  thumbOffClass?: string
}>(), {
  disabled: false,
  trackWidth: 42,
  trackHeight: 24,
  thumbSize: 20,
  onClass: 'bg-pureBlack/18',
  offClass: 'bg-pureBlack/10',
  thumbOnClass: 'bg-pureBlack',
  thumbOffClass: 'bg-pureWhite ring-1 ring-pureBlack/10',
})

const pad = computed(() => 2)

function toggle() {
  if (props.disabled)
    return
  checked.value = !checked.value
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="checked"
    :disabled="disabled"
    class="inline-flex items-center rounded-full border-none p-[2px] transition-colors duration-200 ease-out focus:outline-none"
    :class="[
      checked ? `justify-end ${onClass}` : `justify-start ${offClass}`,
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    ]"
    :style="{
      width: `${trackWidth}px`,
      height: `${trackHeight}px`,
      minWidth: `${trackWidth}px`,
    }"
    @click="toggle"
  >
    <span
      class="rounded-full shadow-sm transition-all duration-200 ease-out"
      :class="checked ? thumbOnClass : thumbOffClass"
      :style="{
        width: `${thumbSize}px`,
        height: `${thumbSize}px`,
      }"
    />
  </button>
</template>
