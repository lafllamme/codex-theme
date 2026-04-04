<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    animated?: boolean
    format?: Intl.NumberFormatOptions
    locales?: Intl.LocalesArgument
    prefix?: string
    respectMotionPreference?: boolean
    spinTiming?: EffectTiming
    suffix?: string
    transformTiming?: EffectTiming
    trend?: number
    willChange?: boolean
    opacityTiming?: EffectTiming
  }>(),
  {
    animated: true,
    format: () => ({
      maximumFractionDigits: 0,
      useGrouping: true,
    }),
    locales: undefined,
    prefix: '',
    respectMotionPreference: true,
    spinTiming: undefined,
    suffix: '',
    transformTiming: undefined,
    trend: undefined,
    willChange: false,
    opacityTiming: undefined,
  },
)

const emit = defineEmits<{
  animationsfinish: [event: CustomEvent]
  animationsstart: [event: CustomEvent]
}>()

const numberFlowComponent = shallowRef<unknown>(null)
const numberFlowPlugins = shallowRef<unknown[]>([])

if (import.meta.client) {
  const numberFlowModule = await import('@number-flow/vue')
  numberFlowComponent.value = numberFlowModule.default
  numberFlowPlugins.value = [numberFlowModule.continuous]
}

const fallbackText = computed(() => {
  const formattedValue = new Intl.NumberFormat(props.locales, props.format).format(props.value)
  return `${props.prefix}${formattedValue}${props.suffix}`
})
</script>

<template>
  <component
    :is="numberFlowComponent"
    v-if="numberFlowComponent"
    class="ds-number-flow"
    :animated="props.animated"
    :format="props.format"
    :locales="props.locales"
    :plugins="numberFlowPlugins"
    :prefix="props.prefix"
    :respect-motion-preference="props.respectMotionPreference"
    :spin-timing="props.spinTiming"
    :suffix="props.suffix"
    :transform-timing="props.transformTiming"
    :trend="props.trend"
    :value="props.value"
    :will-change="props.willChange"
    :opacity-timing="props.opacityTiming"
    @animationsstart="emit('animationsstart', $event)"
    @animationsfinish="emit('animationsfinish', $event)"
  />
  <span v-else class="ds-number-flow ds-number-flow--fallback">
    {{ fallbackText }}
  </span>
</template>

<style scoped>
.ds-number-flow {
  --number-flow-char-height: 0.85em;
  display: inline-block;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  vertical-align: baseline;
}

.ds-number-flow--fallback {
  font-variant-numeric: tabular-nums;
}
</style>
