<script setup lang="ts">
import NumberFlow, { continuous } from '@number-flow/vue'

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
</script>

<template>
  <NumberFlow
    class="ds-number-flow"
    :animated="props.animated"
    :format="props.format"
    :locales="props.locales"
    :plugins="[continuous]"
    :prefix="props.prefix"
    :respect-motion-preference="props.respectMotionPreference"
    :spin-timing="props.spinTiming"
    :suffix="props.suffix"
    :transform-timing="props.transformTiming"
    :trend="props.trend"
    :value="props.value"
    :will-change="props.willChange"
    :opacity-timing="props.opacityTiming"
  />
</template>

<style scoped>
.ds-number-flow {
  --number-flow-char-height: 0.85em;
  display: inline-block;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  vertical-align: baseline;
}
</style>
