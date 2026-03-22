<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'

type GitAction = 'commit' | 'push' | 'branch'
type CommitNextStep = 'commit' | 'commit-push' | 'commit-pr'

const isOpen = defineModel<boolean>('open', { required: true })
const action = defineModel<GitAction>('action', { required: true })

const panelRef = ref<HTMLElement | null>(null)
const includeUnstaged = ref(true)
const isDraft = ref(false)
const commitMessage = ref('')
const nextStep = ref<CommitNextStep>('commit')
const branchName = ref('codex/add-appearance-settings-view')

const title = computed(() => action.value === 'push' ? 'Push changes' : 'Commit changes')
const ctaLabel = computed(() => action.value === 'push' ? 'Push' : 'Continue')
const actionIcon = computed(() => {
  if (action.value === 'push')
    return 'ph:cloud-arrow-up-bold'
  if (action.value === 'branch')
    return 'ph:git-branch-bold'
  return 'ph:git-commit'
})
const branchTitle = computed(() => action.value === 'branch' ? 'Work Here' : title.value)
const branchCtaLabel = computed(() => action.value === 'branch' ? 'Create' : ctaLabel.value)

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
          class="pointer-events-auto relative box-border w-full overflow-hidden border border-[color:var(--wb-border-2)] rounded-[22px] bg-[color-mix(in_srgb,var(--wb-bubble-bg)_74%,var(--wb-bg-panel)_26%)] p-5 text-[color:var(--wb-text-primary)]"
          :class="action === 'push' ? 'max-w-[560px]' : 'max-w-[560px]'"
        >
          <div class="mb-3 flex items-start justify-between">
            <span class="h-10 w-10 inline-flex items-center justify-center border border-[color:var(--wb-border-2)] rounded-[11px] bg-[color-mix(in_srgb,var(--wb-chip-bg)_76%,black_24%)]">
              <Icon :name="actionIcon" class="h-6 w-6 text-[color:var(--wb-text-primary)]" />
            </span>
            <button
              class="h-7 w-7 inline-flex items-center justify-center rounded-[8px] border-none bg-transparent text-[color:var(--wb-text-secondary)] transition-colors hover:bg-[var(--wb-hover-bg)]"
              @click="closeModal"
            >
              <Icon name="ph:x" class="h-4 w-4" />
            </button>
          </div>

          <h2 class="mb-3 text-[21px] font-semibold leading-[1.15] tracking-[-0.02em]">
            {{ branchTitle }}
          </h2>

          <template v-if="action === 'branch'">
            <p class="mb-5 text-[14px] text-[color:var(--wb-text-muted)] leading-[1.42]">
              Create a branch to commit and push changes from this worktree.
              <a href="#" class="underline decoration-[color:var(--wb-text-muted)] underline-offset-2">Learn more</a>
            </p>

            <div class="mb-2 flex items-center justify-between">
              <span class="text-[14px] text-[color:var(--wb-text-primary)] font-semibold">Branch Name</span>
              <button class="border-none bg-transparent p-0 text-[14px] text-[color:var(--wb-text-muted)] hover:text-[color:var(--wb-text-primary)]">
                Set Prefix
              </button>
            </div>

            <input
              v-model="branchName"
              type="text"
              class="mb-5 box-border h-[44px] max-w-full w-full border border-[color:var(--wb-border-2)] rounded-[12px] bg-[color-mix(in_srgb,var(--wb-bubble-bg)_74%,var(--wb-bg-panel)_26%)] px-4 text-[14px] text-[color:var(--wb-text-primary)] font-semibold outline-none transition-colors focus:border-[color:var(--wb-hover-border)]"
            >

            <button class="box-border h-[42px] max-w-full w-full rounded-[12px] border-none bg-[color-mix(in_srgb,var(--wb-text-primary)_90%,white_10%)] text-[15px] text-[var(--wb-bg-panel)] font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--wb-text-primary)_95%,white_5%)]">
              {{ branchCtaLabel }}
            </button>
          </template>

          <div v-else class="mb-3 flex items-center justify-between">
            <span class="text-[14px] text-[color:var(--wb-text-muted)] font-medium">Branch</span>
            <span class="inline-flex items-center gap-2 text-[15px] text-[color:var(--wb-text-primary)] font-medium">
              <Icon name="ph:git-branch-bold" class="h-4 w-4 text-[color:var(--wb-text-muted)]" />
              main
            </span>
          </div>

          <template v-if="action === 'push'">
            <p class="mb-6 max-w-[520px] text-[14px] text-[color:var(--wb-text-muted)] leading-[1.4]">
              Push your latest commits to the remote repository.
            </p>
          </template>

          <template v-else-if="action === 'commit'">
            <div class="mb-3 flex items-center justify-between">
              <span class="text-[14px] text-[color:var(--wb-text-primary)] font-semibold">Changes</span>
              <span class="text-[14px] text-[color:var(--wb-text-muted)]">
                1 file
                <span class="ml-2 text-[color:var(--wb-diff-delta-added)] font-semibold">+85</span>
                <span class="ml-1 text-[color:var(--wb-diff-delta-removed)] font-semibold">-0</span>
              </span>
            </div>

            <button
              class="mb-5 inline-flex items-center gap-2 rounded-[10px] border-none bg-transparent px-1 py-1 text-[14px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
              @click="includeUnstaged = !includeUnstaged"
            >
              <span class="h-6 w-10 inline-flex items-center rounded-full p-[3px] transition-colors" :class="includeUnstaged ? 'justify-end bg-[var(--wb-accent)]' : 'justify-start bg-[color:var(--wb-border-2)]'">
                <span class="bg-white h-[18px] w-[18px] rounded-full" />
              </span>
              Include unstaged changes
            </button>

            <label class="mb-2 block text-[14px] text-[color:var(--wb-text-primary)] font-semibold">Commit Message</label>
            <input
              v-model="commitMessage"
              type="text"
              placeholder="Leave empty to auto-generate a commit message"
              class="mb-5 box-border h-[52px] max-w-full w-full border border-[color:var(--wb-border-2)] rounded-[12px] bg-[color-mix(in_srgb,var(--wb-bubble-bg)_74%,var(--wb-bg-panel)_26%)] px-4 text-[14px] text-[color:var(--wb-text-primary)] outline-none transition-colors focus:border-[color:var(--wb-hover-border)] placeholder:text-[color:var(--wb-text-faint)]"
            >

            <h3 class="mb-2 text-[14px] text-[color:var(--wb-text-primary)] font-semibold">
              Next Steps
            </h3>
            <div class="mb-5 overflow-hidden border border-[color:var(--wb-border-2)] rounded-[12px]">
              <button
                class="h-10 w-full flex items-center justify-between border-none bg-transparent px-3 text-left text-[14px] text-[color:var(--wb-text-primary)] transition-colors hover:bg-[var(--wb-hover-bg)]"
                @click="nextStep = 'commit'"
              >
                <span class="inline-flex items-center gap-2">
                  <Icon name="ph:git-commit-bold" class="h-4 w-4" />
                  Commit
                </span>
                <Icon v-if="nextStep === 'commit'" name="ph:check-bold" class="h-4 w-4" />
              </button>
              <div class="h-px bg-[var(--wb-border-2)]" />
              <button
                class="h-10 w-full flex items-center gap-2 border-none bg-transparent px-3 text-left text-[14px] text-[color:var(--wb-text-primary)] transition-colors hover:bg-[var(--wb-hover-bg)]"
                @click="nextStep = 'commit-push'"
              >
                <Icon name="ph:arrow-up-bold" class="h-4 w-4" />
                Commit and push
              </button>
              <div class="h-px bg-[var(--wb-border-2)]" />
              <button
                class="h-11 w-full flex items-center gap-2 border-none bg-transparent px-3 text-left text-[14px] text-[color:var(--wb-text-faint)]"
                disabled
              >
                <Icon name="ph:github-logo-fill" class="h-4 w-4" />
                <span>
                  Commit and create PR
                  <span class="block text-[11px] text-[color:var(--wb-text-faint)]">Requires GitHub CLI</span>
                </span>
              </button>
            </div>

            <div class="mb-0 flex items-center justify-between">
              <button
                class="inline-flex items-center gap-2 rounded-[10px] border-none bg-transparent px-1 py-1 text-[14px] text-[color:var(--wb-text-primary)] transition-colors hover:bg-[var(--wb-hover-bg)]"
                @click="isDraft = !isDraft"
              >
                <span class="h-6 w-10 inline-flex items-center rounded-full p-[3px] transition-colors" :class="isDraft ? 'justify-end bg-[var(--wb-accent)]' : 'justify-start bg-[color:var(--wb-border-2)]'">
                  <span class="bg-white h-[18px] w-[18px] rounded-full" />
                </span>
                Draft
              </button>
              <button class="h-[42px] min-w-[180px] rounded-[12px] border-none bg-[color-mix(in_srgb,var(--wb-text-primary)_90%,white_10%)] px-6 text-[15px] text-[var(--wb-bg-panel)] font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--wb-text-primary)_95%,white_5%)]">
                {{ ctaLabel }}
              </button>
            </div>
          </template>

          <template v-if="action === 'push'">
            <button class="box-border h-[42px] max-w-full w-full rounded-[12px] border-none bg-[color-mix(in_srgb,var(--wb-text-primary)_90%,white_10%)] text-[15px] text-[var(--wb-bg-panel)] font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--wb-text-primary)_95%,white_5%)]">
              {{ ctaLabel }}
            </button>
          </template>
        </section>
      </Transition>
    </div>
  </div>
</template>
