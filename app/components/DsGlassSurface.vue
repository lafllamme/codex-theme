<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DsGlassSurfaceProps>(), {
  as: 'div',
  tone: 'default',
})

interface DsGlassSurfaceProps {
  as?: string
  tone?: 'default' | 'soft'
}

const baseClass = 'border-[1px] border-solid border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px]'

const toneClass = computed(() => {
  return props.tone === 'soft'
    ? 'border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)]'
    : ''
})
</script>

<template>
  <component :is="props.as" v-bind="$attrs" :class="[baseClass, toneClass]">
    <slot />
  </component>
</template>
