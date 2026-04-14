<script setup lang="ts">
import type { AutomationSection } from '~/data/workbench-automations-catalog'

defineProps<{
  sections: AutomationSection[]
  activeId: string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <nav
    class="min-w-0 w-[200px] shrink-0 md:w-[220px]"
    aria-label="Automation categories"
  >
    <ul class="m-0 list-none p-0">
      <li v-for="s in sections" :key="s.id" class="mb-1 last:mb-0">
        <button
          type="button"
          class="w-full border-none bg-transparent py-1.5 text-left text-[length:var(--wb-ui-text)] outline-none transition-colors"
          :class="activeId === s.id
            ? 'text-[color:var(--wb-text-primary)] font-semibold'
            : 'text-[color:var(--wb-text-muted)] font-normal hover:text-[color:var(--wb-text-secondary)]'"
          @click="emit('select', s.id)"
        >
          {{ s.title }}
        </button>
      </li>
    </ul>
  </nav>
</template>
