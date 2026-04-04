<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import DocsSectionShell from '~/components/docs/DocsSectionShell.vue'
import DsNumberFlow from '~/components/DsNumberFlow.vue'
import { themePresetEntries } from '~/data/theme-preset-catalog'
import { OFFICIAL_CODE_THEME_IDS } from '~/utils/code-theme-registry'

const presetSourceStats = computed(() => {
  const officialIdSet = new Set<string>(OFFICIAL_CODE_THEME_IDS)
  const official = themePresetEntries.filter(entry =>
    officialIdSet.has(entry.id),
  ).length
  const total = themePresetEntries.length
  const importedIterm = Math.max(0, total - official)

  return {
    official,
    importedIterm,
    total,
  }
})

const presetStatsNumberWidthCh = computed(() => {
  const lengths = [
    presetSourceStats.value.total.toLocaleString().length,
    presetSourceStats.value.official.toLocaleString().length,
    presetSourceStats.value.importedIterm.toLocaleString().length,
  ]

  return Math.max(...lengths, 1)
})

const presetStatsStripRef = ref<HTMLElement | null>(null)
const isPresetStatsStripVisible = useElementVisibility(presetStatsStripRef)
const displayedPresetSourceStats = ref({
  official: 0,
  importedIterm: 0,
  total: 0,
})

let presetStatsReplayTimer: ReturnType<typeof setTimeout> | null = null
const relaxedTransformTiming: EffectTiming = {
  duration: 950,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
}
const relaxedSpinTiming: EffectTiming = {
  duration: 1100,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
}
const relaxedOpacityTiming: EffectTiming = {
  duration: 450,
  easing: 'ease-out',
}

function resetPresetStatsDisplay() {
  displayedPresetSourceStats.value = {
    official: 0,
    importedIterm: 0,
    total: 0,
  }
}

function replayPresetStatsAnimation() {
  if (!isPresetStatsStripVisible.value)
    return

  if (presetStatsReplayTimer) {
    clearTimeout(presetStatsReplayTimer)
    presetStatsReplayTimer = null
  }

  resetPresetStatsDisplay()

  // Keep `0` visible for a short beat so NumberFlow always replays.
  presetStatsReplayTimer = setTimeout(() => {
    displayedPresetSourceStats.value = {
      ...presetSourceStats.value,
    }
    presetStatsReplayTimer = null
  }, 120)
}

watch(
  isPresetStatsStripVisible,
  (visible) => {
    if (visible) {
      replayPresetStatsAnimation()
      return
    }
    resetPresetStatsDisplay()
  },
  { immediate: true },
)

watch(presetSourceStats, (nextStats) => {
  if (!isPresetStatsStripVisible.value)
    return

  displayedPresetSourceStats.value = {
    ...nextStats,
  }
})

onBeforeUnmount(() => {
  if (presetStatsReplayTimer) {
    clearTimeout(presetStatsReplayTimer)
    presetStatsReplayTimer = null
  }
})
</script>

<template>
  <DocsSectionShell id="preset-sources" title="Preset Sources">
    <p class="max-w-3xl">
      The current catalog combines official Codex presets
      with a large imported iTerm set. We use iTerm as a
      source because its palette ecosystem is widely known
      across developer workflows, including familiar
      classics like Monokai, Ayu, and many other proven
      themes. Every entry is normalized into the same
      <code>codex-theme-v1</code> payload contract so
      browsing, previewing, and exporting stay consistent.
    </p>

    <div class="py-2 space-y-6">
      <p
        class="font-geist-mono-500 text-[12px] color-[#10b981] tracking-[0.16em] uppercase"
      >
        Theme Catalog
      </p>

      <div
        ref="presetStatsStripRef"
        class="flex flex-col gap-8 md:flex-row md:items-end md:gap-0"
      >
        <article class="flex flex-col items-center md:w-1/3 md:px-12">
          <p
            class="font-geist-300 w-full inline-flex justify-center whitespace-nowrap text-[clamp(2.7rem,6vw,5.2rem)] leading-none tracking-tight color-pureWhite"
          >
            <span
              class="relative inline-flex items-baseline"
            >
              <span
                class="inline-flex justify-end"
                :style="{
                  minWidth: `${presetStatsNumberWidthCh}ch`,
                  fontVariantNumeric:
                    'tabular-nums',
                }"
              >
                <DsNumberFlow
                  :value="
                    displayedPresetSourceStats.total
                  "
                  :transform-timing="relaxedTransformTiming"
                  :spin-timing="relaxedSpinTiming"
                  :opacity-timing="relaxedOpacityTiming"
                  :will-change="true"
                />
              </span>
              <Icon
                name="ph:plus-bold"
                class="pointer-events-none absolute left-full top-1/2 ml-2 size-12 color-[#10b981] -translate-y-1/2"
              />
            </span>
          </p>
          <p
            class="font-geist-mono-600 mt-3 text-center text-[13px] color-sand-8 tracking-[0.12em] uppercase"
          >
            Total Themes
          </p>
        </article>

        <article
          class="flex flex-col items-center md:w-1/3 md:border-l md:border-sand-9/40 md:px-12"
        >
          <p
            class="font-geist-300 w-full inline-flex justify-center whitespace-nowrap text-[clamp(2.7rem,6vw,5.2rem)] leading-none tracking-tight color-pureWhite"
          >
            <span
              class="relative inline-flex items-baseline"
            >
              <span
                class="inline-flex justify-end"
                :style="{
                  minWidth: `${presetStatsNumberWidthCh}ch`,
                  fontVariantNumeric:
                    'tabular-nums',
                }"
              >
                <DsNumberFlow
                  :value="
                    displayedPresetSourceStats.official
                  "
                  :transform-timing="relaxedTransformTiming"
                  :spin-timing="relaxedSpinTiming"
                  :opacity-timing="relaxedOpacityTiming"
                  :will-change="true"
                />
              </span>
              <Icon
                name="ph:plus-bold"
                class="pointer-events-none absolute left-full top-1/2 ml-2 size-[0.58em] color-slate-9 -translate-y-1/2"
              />
            </span>
          </p>
          <p
            class="font-geist-mono-600 mt-3 text-center text-[13px] color-sand-8 tracking-[0.12em] uppercase"
          >
            Codex Native
          </p>
        </article>

        <article
          class="flex flex-col items-center md:w-1/3 md:border-l md:border-sand-9/40 md:px-12"
        >
          <p
            class="font-geist-300 w-full inline-flex justify-center whitespace-nowrap text-[clamp(2.7rem,6vw,5.2rem)] leading-none tracking-tight color-pureWhite"
          >
            <span
              class="relative inline-flex items-baseline"
            >
              <span
                class="inline-flex justify-end"
                :style="{
                  minWidth: `${presetStatsNumberWidthCh}ch`,
                  fontVariantNumeric:
                    'tabular-nums',
                }"
              >
                <DsNumberFlow
                  :value="
                    displayedPresetSourceStats.importedIterm
                  "
                  :transform-timing="relaxedTransformTiming"
                  :spin-timing="relaxedSpinTiming"
                  :opacity-timing="relaxedOpacityTiming"
                  :will-change="true"
                />
              </span>
              <Icon
                name="ph:plus-bold"
                class="pointer-events-none absolute left-full top-1/2 ml-2 size-[0.58em] color-slate-9 -translate-y-1/2"
              />
            </span>
          </p>
          <p
            class="font-geist-mono-600 mt-3 text-center text-[13px] color-sand-8 tracking-[0.12em] uppercase"
          >
            iTerm Sources
          </p>
        </article>
      </div>
    </div>

    <p class="max-w-3xl">
      This split is deliberate: Theme Studio stays the
      fastest creation path, while the
      <code>codex-themes</code> repository pipeline
      provides reproducible local generation for
      automation and versioned workflows.
    </p>
  </DocsSectionShell>
</template>
