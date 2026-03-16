<script setup lang="ts">
defineProps<{
  title: string
  repo: string
  runEnabled: boolean
  pipEnabled: boolean
  isTerminalOpen: boolean
  isDiffOpen: boolean
  mobileSidebarOpen: boolean
}>()

const emit = defineEmits<{
  toggleSidebar: []
  toggleSidebarMobile: []
  toggleRun: []
  toggleTerminal: []
  toggleDiff: []
  togglePip: []
}>()
</script>

<template>
  <header class="flex min-h-[var(--wb-topbar-height)] items-center justify-between gap-3 rounded-[var(--wb-r-md)] border border-[var(--wb-border-2)] bg-[rgba(15,17,22,0.45)] p-[8px_10px] backdrop-blur-[14px] max-[1180px]:items-start max-[1180px]:flex-col">
    <div class="inline-flex items-center gap-2">
      <span class="h-3 w-3 rounded-full bg-[#ff5f57]" />
      <span class="h-3 w-3 rounded-full bg-[#febc2e]" />
      <span class="h-3 w-3 rounded-full bg-[#28c840]" />

      <button class="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-white/[0.14] bg-white/[0.02] text-white/[0.52] transition-colors hover:bg-white/[0.07] hover:text-white/[0.82] min-[1181px]:hidden" @click="emit('toggleSidebarMobile')">
        <Icon :name="mobileSidebarOpen ? 'ph:x-bold' : 'ph:list-bold'" class="h-[14px] w-[14px]" />
      </button>
      <button class="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-white/[0.14] bg-white/[0.02] text-white/[0.52] transition-colors hover:bg-white/[0.07] hover:text-white/[0.82] max-[1180px]:hidden" @click="emit('toggleSidebar')">
        <Icon name="ph:sidebar-simple-light" class="h-[14px] w-[14px]" />
      </button>

      <TopbarConversationMeta :title="title" :repo="repo" />
    </div>

    <div class="inline-flex items-center gap-2 max-[1180px]:w-full max-[1180px]:justify-between">
      <TopbarWorktreeControls :run-enabled="runEnabled" @toggle-run="emit('toggleRun')" />

      <span class="h-[22px] w-px bg-[var(--wb-border-3)]" />

      <TopbarUtilityToggles
        :is-terminal-open="isTerminalOpen"
        :is-diff-open="isDiffOpen"
        :is-pip-enabled="pipEnabled"
        @toggle-terminal="emit('toggleTerminal')"
        @toggle-diff="emit('toggleDiff')"
        @toggle-pip="emit('togglePip')"
      />
    </div>
  </header>
</template>
