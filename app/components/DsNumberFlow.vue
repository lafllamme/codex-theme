<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    /** Reserve horizontal space for this formatted value so width does not jump while `value` animates. */
    stableWidthValue?: number
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
    stableWidthValue: undefined,
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

const useStableLayout = computed(() => props.stableWidthValue !== undefined)

const reserveFullText = computed(() => {
  if (props.stableWidthValue === undefined)
    return ''
  const formatted = new Intl.NumberFormat(props.locales, props.format).format(props.stableWidthValue)
  return `${props.prefix}${formatted}${props.suffix}`
})

const numberFlowBindings = computed(() => ({
  animated: props.animated,
  format: props.format,
  locales: props.locales,
  plugins: numberFlowPlugins.value,
  prefix: props.prefix,
  respectMotionPreference: props.respectMotionPreference,
  spinTiming: props.spinTiming,
  suffix: props.suffix,
  transformTiming: props.transformTiming,
  trend: props.trend,
  value: props.value,
  willChange: props.willChange,
  opacityTiming: props.opacityTiming,
}))
</script>

<template>
  <span v-if="useStableLayout" class="ds-number-flow-stable">
    <span class="ds-number-flow-stable__strut" aria-hidden="true">{{ reserveFullText }}</span>
    <span class="ds-number-flow-stable__layer">
      <component
        :is="numberFlowComponent"
        v-if="numberFlowComponent"
        class="ds-number-flow"
        v-bind="numberFlowBindings"
        @animationsstart="emit('animationsstart', $event)"
        @animationsfinish="emit('animationsfinish', $event)"
      />
      <span v-else class="ds-number-flow ds-number-flow--fallback">{{ fallbackText }}</span>
    </span>
  </span>
  <component
    :is="numberFlowComponent"
    v-else-if="numberFlowComponent"
    class="ds-number-flow"
    v-bind="numberFlowBindings"
    @animationsstart="emit('animationsstart', $event)"
    @animationsfinish="emit('animationsfinish', $event)"
  />
  <span v-else class="ds-number-flow ds-number-flow--fallback">{{ fallbackText }}</span>
</template>

<style scoped>
.ds-number-flow-stable {
  display: inline-grid;
  vertical-align: baseline;
  justify-items: start;
}

.ds-number-flow-stable__strut {
  grid-area: 1 / 1;
  visibility: hidden;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.ds-number-flow-stable__layer {
  grid-area: 1 / 1;
}

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
