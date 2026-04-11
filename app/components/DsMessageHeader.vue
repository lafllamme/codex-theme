<script setup lang="ts">
const props = defineProps<{
  title: string
  content: string
}>()

const expanded = defineModel<boolean>('expanded', { required: true })
</script>

<template>
  <div class="mb-1 px-1">
    <button
      type="button"
      class="group h-8 w-full inline-flex items-center gap-2 border-none bg-transparent p-0 text-left text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-secondary)] leading-none outline-none"
      @click="expanded = !expanded"
    >
      <span class="truncate font-medium">{{ props.title }}</span>
      <Icon
        name="ph:caret-down-bold"
        class="h-[12px] w-[12px] shrink-0 text-[color:var(--wb-text-muted)] transition-transform duration-160"
        :class="expanded ? 'rotate-180' : 'rotate-0'"
      />
    </button>
    <p
      v-if="expanded"
      class="pb-2 pt-1 text-[length:var(--wb-ui-text-xs)] text-[color:var(--wb-text-muted)] leading-[1.45]"
    >
      {{ props.content }}
    </p>
    <div class="h-px w-full bg-[var(--wb-divider)]" />
  </div>
</template>
