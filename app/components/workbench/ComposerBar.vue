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
  <footer class="rounded-[var(--wb-r-md)] border border-[var(--wb-border-1)] bg-[rgba(8,9,11,0.92)] p-2">
    <div class="rounded-[11px] border border-[var(--wb-border-2)] bg-pureWhite/3 px-2.5 py-2">
      <div class="flex items-center gap-2">
        <input
          v-model="composeValue"
          class="h-[28px] min-w-0 flex-1 bg-transparent px-1 text-[20px] text-pureWhite/34 outline-none placeholder:text-pureWhite/24"
          type="text"
          placeholder="Ask a follow-up"
        >

        <button class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-transparent text-pureWhite/45 transition-colors hover:bg-pureWhite/7 hover:text-pureWhite/80">
          <Icon name="ph:microphone-bold" class="h-[12px] w-[12px]" />
        </button>
        <button class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--theme-accent)_62%,rgba(255,255,255,0.18))] bg-[color-mix(in_srgb,var(--theme-accent)_82%,black_18%)] text-black">
          <Icon name="ph:arrow-up-bold" class="h-[12px] w-[12px]" />
        </button>
      </div>

      <div class="mt-2 flex items-center justify-between gap-2 text-[12px]">
        <div class="inline-flex min-w-0 items-center gap-1.5">
          <button class="inline-flex h-[24px] w-[24px] items-center justify-center rounded-[7px] bg-transparent text-pureWhite/56 transition-colors hover:bg-pureWhite/8 hover:text-pureWhite/82">
            <Icon name="ph:plus-bold" class="h-[11px] w-[11px]" />
          </button>

          <select v-model="selectedModel" class="h-[24px] min-w-[118px] rounded-[7px] border border-pureWhite/10 bg-pureWhite/4 px-2 text-[12px] text-pureWhite/78">
            <option v-for="model in modelOptions" :key="model" :value="model">
              {{ model }}
            </option>
          </select>

          <select v-model="selectedThinking" class="h-[24px] min-w-[80px] rounded-[7px] border border-pureWhite/10 bg-pureWhite/4 px-2 text-[12px] text-pureWhite/78">
            <option v-for="thinking in thinkingOptions" :key="thinking" :value="thinking">
              {{ thinking }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="mt-2 flex items-center justify-between px-1 text-[12px] text-pureWhite/66">
      <div class="inline-flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5"><Icon name="ph:laptop-bold" class="h-[12px] w-[12px]" /> Local</span>
        <span class="inline-flex items-center gap-1.5 text-[#f59f44]"><Icon name="ph:shield-warning-bold" class="h-[12px] w-[12px]" /> Full access</span>
      </div>
      <span class="inline-flex items-center gap-1.5"><Icon name="ph:git-branch-bold" class="h-[12px] w-[12px]" /> main</span>
    </div>
  </footer>
</template>
