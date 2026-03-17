<script setup lang="ts">
defineProps<{
  title: string
  repo: string
}>()
</script>

<template>
  <div class="ml-1 inline-flex items-center gap-2.5">
    <strong class="text-white/[0.96] text-[14px] font-semibold leading-none">{{ title }}</strong>
    <span class="text-white/[0.54] text-[13px] font-[var(--font-code)]">{{ repo }}</span>
    <button class="text-white/[0.56] hover:bg-white/[0.06] hover:text-white/[0.9] h-6 w-6 inline-flex items-center justify-center rounded-[7px] bg-transparent transition-colors">
      <Icon name="ph:dots-three-outline-fill" class="h-[14px] w-[14px]" />
    </button>
  </div>
</template>
