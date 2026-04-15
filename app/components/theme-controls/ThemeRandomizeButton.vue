<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()

const { playDiceRoll } = useDiceSfx()

function onRandomizeClick() {
  playDiceRoll()
  emit('click')
}
</script>

<template>
  <button
    type="button"
    class="group inline-flex cursor-pointer appearance-none items-center gap-1.5 border-sand-6 rounded-full border-solid px-3 py-1 text-[13px] text-[#374151] font-semibold shadow-sm outline-none transition-all bg-pureWhite active:scale-95 hover:bg-sand-12"
    @click="onRandomizeClick"
  >
    <span class="flex items-center justify-center text-[#6366f1] transition-transform duration-200 group-hover:rotate-12">
      <Icon name="ph:dice-five-bold" class="size-5" />
    </span>
    <span>Randomize</span>
  </button>
</template>
