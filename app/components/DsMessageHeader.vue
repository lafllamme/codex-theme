<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Collapsible “previous message” vs static row (e.g. “Working for…”) — same chrome, no chevron. */
    variant?: 'collapsible' | 'status'
    title: string
    content?: string
  }>(),
  {
    variant: 'collapsible',
    content: '',
  },
)

const expanded = defineModel<boolean>('expanded', { required: false, default: false })

const isCollapsible = computed(() => props.variant === 'collapsible')
</script>

<template>
  <div class="mb-1 w-full min-w-0 px-1">
    <template v-if="isCollapsible">
      <button
        type="button"
        class="group h-8 w-full inline-flex min-w-0 items-center gap-2 border-none bg-transparent p-0 text-left text-[length:var(--wb-ui-text-xs)] text-[color:var(--wb-text-muted)] font-normal leading-none outline-none"
        @click="expanded = !expanded"
      >
        <span class="min-w-0 flex-1 truncate">
          <slot name="title">{{ title }}</slot>
        </span>
        <Icon
          name="ph:caret-down-bold"
          class="h-[12px] w-[12px] shrink-0 text-[color:var(--wb-text-muted)] transition-transform duration-160"
          :class="expanded ? 'rotate-180' : 'rotate-0'"
        />
      </button>
      <p
        v-if="expanded && content"
        class="pb-2 pt-1 text-[length:var(--wb-ui-text-xs)] text-[color:var(--wb-text-muted)] leading-[1.45]"
      >
        {{ content }}
      </p>
    </template>
    <div
      v-else
      class="flex h-8 w-full min-w-0 items-center"
    >
      <span class="min-w-0 flex-1 text-[length:var(--wb-ui-text-xs)] font-normal leading-none">
        <slot name="title">{{ title }}</slot>
      </span>
    </div>
    <div class="h-px w-full bg-[var(--wb-divider)]" />
  </div>
</template>
