<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'

type GitAction = 'commit' | 'push'
type CommitNextStep = 'commit' | 'commit-push' | 'commit-pr'

const isOpen = defineModel<boolean>('open', { required: true })
const action = defineModel<GitAction>('action', { required: true })

const panelRef = ref<HTMLElement | null>(null)
const includeUnstaged = ref(true)
const isDraft = ref(false)
const commitMessage = ref('')
const nextStep = ref<CommitNextStep>('commit')

const title = computed(() => action.value === 'push' ? 'Push changes' : 'Commit changes')
const ctaLabel = computed(() => action.value === 'push' ? 'Push' : 'Continue')
const actionIcon = computed(() => action.value === 'push' ? 'ph:cloud-arrow-up-bold' : 'ph:git-commit')

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
          class="pointer-events-auto relative box-border max-w-[760px] w-full overflow-hidden border border-[color:var(--wb-border-2)] rounded-[28px] bg-[color-mix(in_srgb,var(--wb-bubble-bg)_74%,var(--wb-bg-panel)_26%)] p-7 text-[color:var(--wb-text-primary)]"
        >
          <div class="mb-4 flex items-start justify-between">
            <span class="h-12 w-12 inline-flex items-center justify-center border border-[color:var(--wb-border-2)] rounded-[13px] bg-[color-mix(in_srgb,var(--wb-chip-bg)_76%,black_24%)]">
              <Icon :name="actionIcon" class="h-7 w-7 text-[color:var(--wb-text-primary)]" />
            </span>
            <button
              class="h-8 w-8 inline-flex items-center justify-center rounded-[9px] border-none bg-transparent text-[color:var(--wb-text-secondary)] transition-colors hover:bg-[var(--wb-hover-bg)]"
              @click="closeModal"
            >
              <Icon name="ph:x" class="h-5 w-5" />
            </button>
          </div>

          <h2 class="mb-4 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em]">
            {{ title }}
          </h2>

          <div class="mb-3 flex items-center justify-between">
            <div class="inline-flex items-center gap-2 text-[color:var(--wb-text-muted)]">
              <Icon name="ph:git-branch-bold" class="h-5 w-5" />
              <span class="text-[16px] font-medium">Branch</span>
            </div>
            <span class="text-[18px] text-[color:var(--wb-text-primary)] font-medium">main</span>
          </div>

          <template v-if="action === 'push'">
            <p class="mb-7 max-w-[520px] text-[16px] text-[color:var(--wb-text-muted)] leading-[1.4]">
              Push your latest commits to the remote repository.
            </p>
          </template>

          <template v-else>
            <div class="mb-3 flex items-center justify-between">
              <span class="text-[16px] text-[color:var(--wb-text-primary)] font-semibold">Changes</span>
              <span class="text-[16px] text-[color:var(--wb-text-muted)]">
                1 file
                <span class="ml-2 text-[color:var(--wb-diff-delta-added)] font-semibold">+85</span>
                <span class="ml-1 text-[color:var(--wb-diff-delta-removed)] font-semibold">-0</span>
              </span>
            </div>

            <button
              class="mb-6 inline-flex items-center gap-3 rounded-[12px] border-none bg-transparent px-1 py-1 text-[16px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
              @click="includeUnstaged = !includeUnstaged"
            >
              <span class="h-7 w-12 inline-flex items-center rounded-full p-[3px] transition-colors" :class="includeUnstaged ? 'justify-end bg-[var(--wb-accent)]' : 'justify-start bg-[color:var(--wb-border-2)]'">
                <span class="h-[22px] w-[22px] rounded-full bg-white" />
              </span>
              Include unstaged changes
            </button>

            <label class="mb-2 block text-[16px] text-[color:var(--wb-text-primary)] font-semibold">Commit Message</label>
            <input
              v-model="commitMessage"
              type="text"
              placeholder="Leave empty to auto-generate a commit message"
              class="mb-6 box-border h-[52px] max-w-full w-full border border-[color:var(--wb-border-2)] rounded-[16px] bg-[color-mix(in_srgb,var(--wb-bubble-bg)_74%,var(--wb-bg-panel)_26%)] px-5 text-[15px] text-[color:var(--wb-text-primary)] outline-none transition-colors focus:border-[color:var(--wb-hover-border)] placeholder:text-[color:var(--wb-text-faint)]"
            >

            <h3 class="mb-2 text-[16px] text-[color:var(--wb-text-primary)] font-semibold">
              Next Steps
            </h3>
            <div class="mb-6 overflow-hidden border border-[color:var(--wb-border-2)] rounded-[16px]">
              <button
                class="h-12 w-full flex items-center justify-between border-none bg-transparent px-4 text-left text-[15px] text-[color:var(--wb-text-primary)] transition-colors hover:bg-[var(--wb-hover-bg)]"
                @click="nextStep = 'commit'"
              >
                <span class="inline-flex items-center gap-2">
                  <Icon name="ph:git-commit-bold" class="h-5 w-5" />
                  Commit
                </span>
                <Icon v-if="nextStep === 'commit'" name="ph:check-bold" class="h-5 w-5" />
              </button>
              <div class="h-px bg-[var(--wb-border-2)]" />
              <button
                class="h-12 w-full flex items-center gap-2 border-none bg-transparent px-4 text-left text-[15px] text-[color:var(--wb-text-primary)] transition-colors hover:bg-[var(--wb-hover-bg)]"
                @click="nextStep = 'commit-push'"
              >
                <Icon name="ph:arrow-up-bold" class="h-5 w-5" />
                Commit and push
              </button>
              <div class="h-px bg-[var(--wb-border-2)]" />
              <button
                class="h-14 w-full flex items-center gap-2 border-none bg-transparent px-4 text-left text-[15px] text-[color:var(--wb-text-faint)]"
                disabled
              >
                <Icon name="ph:github-logo-fill" class="h-5 w-5" />
                <span>
                  Commit and create PR
                  <span class="block text-[12px] text-[color:var(--wb-text-faint)]">Requires GitHub CLI</span>
                </span>
              </button>
            </div>

            <div class="mb-0 flex items-center justify-between">
              <button
                class="inline-flex items-center gap-2 rounded-[12px] border-none bg-transparent px-1 py-1 text-[16px] text-[color:var(--wb-text-primary)] transition-colors hover:bg-[var(--wb-hover-bg)]"
                @click="isDraft = !isDraft"
              >
                <span class="h-7 w-12 inline-flex items-center rounded-full p-[3px] transition-colors" :class="isDraft ? 'justify-end bg-[var(--wb-accent)]' : 'justify-start bg-[color:var(--wb-border-2)]'">
                  <span class="h-[22px] w-[22px] rounded-full bg-white" />
                </span>
                Draft
              </button>
              <button class="h-[48px] min-w-[210px] rounded-[14px] border-none bg-[color-mix(in_srgb,var(--wb-text-primary)_90%,white_10%)] px-7 text-[16px] text-[var(--wb-bg-panel)] font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--wb-text-primary)_95%,white_5%)]">
                {{ ctaLabel }}
              </button>
            </div>
          </template>

          <template v-if="action === 'push'">
            <button class="box-border h-[48px] max-w-full w-full rounded-[14px] border-none bg-[color-mix(in_srgb,var(--wb-text-primary)_90%,white_10%)] text-[16px] text-[var(--wb-bg-panel)] font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--wb-text-primary)_95%,white_5%)]">
              {{ ctaLabel }}
            </button>
          </template>
        </section>
      </Transition>
    </div>
  </div>
</template>
