<script setup lang="ts">
defineProps<{
  modelOptions: string[]
  thinkingOptions: string[]
}>()

const selectedModel = defineModel<string>('selectedModel', { required: true })
const selectedThinking = defineModel<string>('selectedThinking', { required: true })
const composeValue = defineModel<string>('composeValue', { required: true })
</script>

<template>
  <div class="flex flex-col gap-2">
    <footer class="border border-[color:var(--wb-border-2)] rounded-[28px] bg-[var(--wb-input-bg)] p-[6px]">
      <div class="rounded-[10px] bg-transparent px-2.5 py-2">
        <div class="flex items-center">
          <input
            v-model="composeValue"
            class="h-[28px] min-w-0 flex-1 appearance-none border-none bg-transparent px-1 text-[20px] text-[color:var(--wb-text-muted)] font-[var(--font-ui)] outline-none placeholder:text-[color:var(--wb-text-faint)]"
            type="text"
            placeholder="Ask a follow-up"
          >
        </div>

        <div class="mt-2 flex items-center justify-between gap-2 text-[12px]">
          <div class="min-w-0 inline-flex items-center gap-1.5">
            <button class="h-[24px] w-[24px] inline-flex appearance-none items-center justify-center rounded-[7px] border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]">
              <Icon name="ph:plus-bold" class="h-[11px] w-[11px]" />
            </button>

            <div class="relative inline-flex items-center">
              <select
                v-model="selectedModel"
                class="h-[24px] min-w-[118px] cursor-pointer appearance-none border border-transparent rounded-[7px] bg-transparent py-0 pl-2 pr-7 text-[12px] text-[color:var(--wb-text-primary)] font-[var(--font-ui)] outline-none transition-colors focus-visible:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]"
              >
                <option v-for="model in modelOptions" :key="model" :value="model">
                  {{ model }}
                </option>
              </select>
              <Icon name="ph:caret-down-bold" class="pointer-events-none absolute right-1.5 h-[10px] w-[10px] text-[color:var(--wb-text-muted)]" />
            </div>

            <div class="relative inline-flex items-center">
              <select
                v-model="selectedThinking"
                class="h-[24px] min-w-[80px] cursor-pointer appearance-none border border-transparent rounded-[7px] bg-transparent py-0 pl-2 pr-7 text-[12px] text-[color:var(--wb-text-primary)] font-[var(--font-ui)] outline-none transition-colors focus-visible:border-[color:var(--wb-hover-border)] hover:bg-[var(--wb-hover-bg)]"
              >
                <option v-for="thinking in thinkingOptions" :key="thinking" :value="thinking">
                  {{ thinking }}
                </option>
              </select>
              <Icon name="ph:caret-down-bold" class="pointer-events-none absolute right-1.5 h-[10px] w-[10px] text-[color:var(--wb-text-muted)]" />
            </div>
          </div>

          <div class="inline-flex items-center gap-2">
            <button class="h-7 w-7 inline-flex appearance-none items-center justify-center rounded-full border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]">
              <Icon name="ph:microphone-bold" class="h-[12px] w-[12px]" />
            </button>
            <button class="h-7 w-7 inline-flex appearance-none items-center justify-center rounded-full border-none bg-[color-mix(in_srgb,var(--theme-accent)_82%,black_18%)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--theme-accent)_62%,rgba(255,255,255,0.18))_inset] text-pureBlack">
              <Icon name="ph:arrow-up" class="h-[16px] w-[16px]" />
            </button>
          </div>
        </div>
      </div>
    </footer>

    <div class="mt-2 flex items-center justify-between px-1 text-[12px] text-[color:var(--wb-text-secondary)] font-[var(--font-ui)]">
      <div class="inline-flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5"><Icon name="ph:laptop-bold" class="h-[12px] w-[12px]" /> Local</span>
        <span class="inline-flex items-center gap-1.5 text-[color:var(--wb-access-warn)]"><Icon name="ph:shield-warning-bold" class="h-[12px] w-[12px]" /> Full access</span>
      </div>
      <span class="inline-flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5"><Icon name="ph:git-branch-bold" class="h-[12px] w-[12px]" /> main <Icon name="ph:caret-down-bold" class="h-[10px] w-[10px]" /></span>
        <span
          aria-hidden="true"
          class="h-[12px] w-[12px] rounded-full border border-[color:var(--wb-border-2)] opacity-80"
          :style="{ boxShadow: 'inset 0 0 0 2px color-mix(in srgb, var(--wb-text-muted) 38%, transparent)' }"
        />
      </span>
    </div>
  </div>
</template>
