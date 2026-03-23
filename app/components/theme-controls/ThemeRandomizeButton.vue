<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="group inline-flex outline-none appearance-none cursor-pointer items-center px-3 gap-1.5 py-1 rounded-full bg-pureWhite text-[13px] text-[#374151] font-semibold border-sand-6 border-solid shadow-sm transition-all active:scale-95 hover:bg-sand-12"
    @click="emit('click')"
  >
    <span class="flex items-center justify-center  text-[#6366f1] transition-transform duration-200 group-hover:rotate-12">
      <Icon name="ph:dice-five-bold" class="size-5" />
    </span>
    <span>Randomize</span>
  </button>
</template>
