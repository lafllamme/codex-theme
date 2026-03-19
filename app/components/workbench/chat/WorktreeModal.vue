<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'

const isOpen = defineModel<boolean>('open', { required: true })
const branchName = defineModel<string>('branch', { required: true })

const panelRef = ref<HTMLElement | null>(null)

function closeModal() {
  isOpen.value = false
}

onClickOutside(panelRef, () => {
  if (isOpen.value)
    closeModal()
})

useEventListener(document, 'keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value)
    closeModal()
})
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-50">
    <Transition
      enter-active-class="transition-opacity duration-220 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-180 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        aria-label="Close Worktree Modal"
        class="pointer-events-auto absolute inset-0 bg-[rgba(5,7,10,0.30)] backdrop-blur-[1px]"
        @click="closeModal"
      />
    </Transition>

    <div class="absolute inset-0 flex items-center justify-center p-6">
      <Transition
        enter-active-class="transition-[opacity,transform] duration-280 ease-[cubic-bezier(0.22,1,0.36,1)]"
        enter-from-class="opacity-0 translate-y-2 scale-[0.985]"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-[opacity,transform] duration-180 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-1 scale-[0.99]"
      >
        <section
          v-if="isOpen"
          ref="panelRef"
          class="pointer-events-auto relative max-w-[560px] w-full border border-[color:var(--wb-border-2)] rounded-[28px] bg-[color-mix(in_srgb,var(--wb-bubble-bg)_74%,var(--wb-bg-panel)_26%)] p-7 text-[color:var(--wb-text-primary)] shadow-[0_24px_54px_rgba(0,0,0,0.34)]"
        >
          <div class="mb-5 flex items-start justify-between">
            <span class="h-12 w-12 inline-flex items-center justify-center border border-[color:var(--wb-border-2)] rounded-[13px] bg-[color-mix(in_srgb,var(--wb-chip-bg)_76%,black_24%)]">
              <Icon name="ph:arrows-left-right" class="h-7 w-7 text-[color:var(--wb-text-primary)]" />
            </span>

            <button
              class="h-8 w-8 inline-flex items-center justify-center rounded-[9px] border-none bg-transparent text-[color:var(--wb-text-secondary)] transition-colors hover:bg-[var(--wb-hover-bg)]"
              @click="closeModal"
            >
              <Icon name="ph:x" class="h-5 w-5" />
            </button>
          </div>

          <h2 class="mb-3 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em]">
            In Worktree verschieben
          </h2>
          <p class="mb-6 max-w-[500px] text-[13px] text-[color:var(--wb-text-muted)] leading-[1.45]">
            Wähle einen Worktree-Branch-Namen aus. Codex verwendet ihn anstelle des Standard-Branch.
          </p>

          <label class="mb-2 block text-[16px] text-[color:var(--wb-text-primary)] font-semibold leading-none">
            Worktree-Branch
          </label>

          <input
            v-model="branchName"
            type="text"
            class="mb-5 h-[48px] w-full border border-[color:var(--wb-border-2)] rounded-[16px] bg-[color-mix(in_srgb,var(--wb-bg-panel)_74%,black_26%)] px-5 text-[14px] text-[color:var(--wb-text-primary)] font-semibold outline-none transition-colors focus:border-[color:var(--wb-hover-border)] placeholder:text-[color:var(--wb-text-faint)]"
          >

          <button class="h-[48px] w-full rounded-[14px] border-none bg-[color-mix(in_srgb,var(--wb-text-primary)_90%,white_10%)] text-[16px] text-[var(--wb-bg-panel)] font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--wb-text-primary)_95%,white_5%)]">
            Weiter
          </button>
        </section>
      </Transition>
    </div>
  </div>
</template>
