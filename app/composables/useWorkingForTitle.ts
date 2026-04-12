import { useIntervalFn } from '@vueuse/core'
import { toValue } from 'vue'

/**
 * Live “Working for Ns / Xm Ys” label while `active` (display caps at `maxDisplaySec`).
 */
export function useWorkingForTitle(
  active: Ref<boolean>,
  maxDisplaySec: MaybeRefOrGetter<number> = 120,
) {
  const displaySec = ref(0)
  const maxCap = computed(() => toValue(maxDisplaySec))

  const { pause, resume } = useIntervalFn(
    () => {
      displaySec.value = Math.min(displaySec.value + 1, maxCap.value)
    },
    1000,
    { immediate: false },
  )

  watch(
    active,
    (isActive) => {
      pause()
      if (isActive)
        displaySec.value = 0
      if (isActive)
        resume()
    },
    { immediate: true },
  )

  const title = computed(() => {
    const cap = maxCap.value
    const s = Math.min(displaySec.value, cap)
    if (s < 60)
      return `Working for ${s}s`
    const m = Math.floor(s / 60)
    const r = s % 60
    return `Working for ${m}m ${r}s`
  })

  return { title }
}
