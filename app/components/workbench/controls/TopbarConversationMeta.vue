<script setup lang="ts">
defineProps<{
  title: string
  repo: string
}>()
</script>

<template>
  <div class="ml-1 inline-flex items-center gap-2.5">
    <strong class="text-[14px] leading-none font-semibold text-white/[0.96]">{{ title }}</strong>
    <span class="font-[var(--font-code)] text-[13px] text-white/[0.54]">{{ repo }}</span>
    <button class="inline-flex h-6 w-6 items-center justify-center rounded-[7px] bg-transparent text-white/[0.56] transition-colors hover:bg-white/[0.06] hover:text-white/[0.9]">
      <Icon name="ph:dots-three-outline-fill" class="h-[14px] w-[14px]" />
    </button>
  </div>
</template>
