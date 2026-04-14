<script setup lang="ts">
import type { AutomationCard, AutomationSection } from '~/data/workbench-automations-catalog'
import AutomationBentoCard from '~/components/workbench/automations/AutomationBentoCard.vue'

defineProps<{
  section: AutomationSection
  cards: AutomationCard[]
}>()
</script>

<template>
  <section
    :id="`automation-section-${section.id}`"
    class="automations-section-anchor mb-10 scroll-mt-4 last:mb-4"
  >
    <h2 class="m-0 mb-4 text-[length:var(--wb-ui-text)] text-[color:var(--wb-text-primary)] font-semibold">
      {{ section.title }}
    </h2>
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-6 md:gap-y-3">
      <AutomationBentoCard
        v-for="c in cards"
        :key="c.id"
        :icon="c.icon"
        :body="c.body"
      />
    </div>
  </section>
</template>
