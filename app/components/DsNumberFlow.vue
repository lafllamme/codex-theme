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
    suffix?: string
    trend?: number
    willChange?: boolean
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
    suffix: '',
    trend: undefined,
    willChange: false,
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
    :suffix="props.suffix"
    :trend="props.trend"
    :value="props.value"
    :will-change="props.willChange"
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
