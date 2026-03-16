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
  <footer class="mt-2 rounded-[var(--wb-r-md)] border border-[var(--wb-border-1)] bg-[rgba(8,9,11,0.92)] p-2">
    <div class="grid grid-cols-[34px_170px_110px_1fr_34px_34px] items-center gap-2 max-[1180px]:grid-cols-[34px_1fr_1fr] max-[1180px]:auto-rows-[34px]">
      <button class="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-[var(--wb-border-2)] bg-white/[0.03] text-white/[0.92]">
        <Icon name="ph:plus-bold" class="h-[14px] w-[14px]" />
      </button>

      <select v-model="selectedModel" class="h-[34px] rounded-[9px] border border-[var(--wb-border-2)] bg-white/[0.03] px-[11px] text-[13px] text-white/[0.92]">
        <option v-for="model in modelOptions" :key="model" :value="model">
          {{ model }}
        </option>
      </select>

      <select v-model="selectedThinking" class="h-[34px] rounded-[9px] border border-[var(--wb-border-2)] bg-white/[0.03] px-[11px] text-[13px] text-white/[0.92]">
        <option v-for="thinking in thinkingOptions" :key="thinking" :value="thinking">
          {{ thinking }}
        </option>
      </select>

      <input
        v-model="composeValue"
        class="h-[34px] rounded-[9px] border border-[var(--wb-border-2)] bg-white/[0.03] px-[11px] text-[13px] text-white/[0.92] max-[1180px]:col-[1/-1]"
        type="text"
      >

      <button class="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-[var(--wb-border-2)] bg-white/[0.03] text-white/[0.92]">
        <Icon name="ph:microphone-bold" class="h-[14px] w-[14px]" />
      </button>
      <button class="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--theme-accent)_62%,rgba(255,255,255,0.18))] bg-[color-mix(in_srgb,var(--theme-accent)_82%,black_18%)] text-black">
        <Icon name="ph:arrow-up-bold" class="h-[14px] w-[14px]" />
      </button>
    </div>

    <div class="mt-2 flex items-center justify-between text-[12px] text-white/[0.66] max-[1180px]:items-start max-[1180px]:flex-col max-[1180px]:gap-1.5">
      <div class="inline-flex items-center gap-3.5">
        <span class="inline-flex items-center gap-1.5"><Icon name="ph:laptop-bold" class="h-[12px] w-[12px]" /> Local</span>
        <span class="inline-flex items-center gap-1.5"><Icon name="ph:lock-key-bold" class="h-[12px] w-[12px]" /> Full access</span>
      </div>
      <div class="inline-flex items-center gap-3.5">
        <span class="inline-flex items-center gap-1.5"><Icon name="ph:git-branch-bold" class="h-[12px] w-[12px]" /> main</span>
      </div>
    </div>
  </footer>
</template>
