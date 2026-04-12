import type { ChatMessage, FileChangeItem } from '~/types/workbench-chat'
import { createSharedDiffFiles } from '~/data/workbench-diff-shared'

/** Single-file diff for the scripted “working” demo thread. */
export const workingDemoSidebarIconFile: FileChangeItem = {
  id: 'f-codex-sidebar-toggle-icon',
  path: 'app/components/icons/CodexSidebarToggleIcon.vue',
  fileName: 'CodexSidebarToggleIcon.vue',
  added: 10,
  removed: 0,
  showDot: true,
  lines: [
    { left: '', right: 1, text: '<script setup lang="ts">', kind: 'add' },
    { left: '', right: 2, text: 'defineProps<{ open: boolean }>()', kind: 'add' },
    { left: '', right: 3, text: '</script>', kind: 'add' },
    { left: '', right: 4, text: '', kind: 'add' },
    { left: '', right: 5, text: '<template>', kind: 'add' },
    { left: '', right: 6, text: '  <svg class="codex-sidebar-toggle" viewBox="0 0 24 24" aria-hidden="true">', kind: 'add' },
    { left: '', right: 7, text: '    <path v-if="open" d="M6 6l12 12M18 6L6 18" />', kind: 'add' },
    { left: '', right: 8, text: '    <path v-else d="M4 6h16M4 12h16M4 18h16" />', kind: 'add' },
    { left: '', right: 9, text: '  </svg>', kind: 'add' },
    { left: '', right: 10, text: '</template>', kind: 'add' },
  ],
}

export const workbenchMessagesByThread: Record<string, ChatMessage[]> = {
  'thread-1': [
    {
      id: 'a1',
      role: 'assistant',
      blocks: [
        { type: 'text', text: 'I reviewed the styling mismatch and prepared a clean update pass.' },
        {
          type: 'component_mention',
          lead: 'Updated',
          component: 'DsCodexWorkbench.vue',
          trail: 'for chat container spacing and responsive shell behavior.',
          path: 'app/components/DsCodexWorkbench.vue',
        },
        {
          type: 'component_mention',
          lead: 'Aligned',
          component: 'WorkbenchMainStage.vue',
          trail: 'with stronger message lane consistency.',
          path: 'app/components/workbench/WorkbenchMainStage.vue',
        },
        {
          type: 'file_change_card',
          id: 'card-diff-primary',
          summaryLabel: '3 files changed',
          added: 86,
          removed: 33,
          revertLabel: 'Revert',
          files: createSharedDiffFiles(),
        },
      ],
    },
    {
      id: 'u1',
      role: 'user',
      text: 'Can you make a clean mismatch list and rebuild the header 1:1?',
    },
    {
      id: 'a2',
      role: 'assistant',
      blocks: [
        {
          type: 'text',
          text: 'Yes. I split the work into componentized blocks so theme debugging is easier and more realistic in the chat lane.',
        },
        {
          type: 'component_mention',
          lead: 'Added',
          component: 'ChatFileChangeCard',
          trail: 'for compact file summaries + expandable diffs.',
          path: 'app/components/workbench/chat/ChatFileChangeCard.vue',
        },
        {
          type: 'component_mention',
          lead: 'Added',
          component: 'ChatComponentMention',
          trail: 'for hover path badges with accent-aware text.',
          path: 'app/components/workbench/chat/ChatComponentMention.vue',
        },
        {
          type: 'file_change_card',
          id: 'card-chat-secondary',
          summaryLabel: '3 files changed',
          added: 9,
          removed: 5,
          revertLabel: 'Revert',
          files: [
            {
              id: 'f3',
              path: 'app/components/workbench/chat/ChatFileChangeCard.vue',
              fileName: 'ChatFileChangeCard.vue',
              added: 4,
              removed: 2,
              lines: [
                { left: 14, right: 14, text: 'const openFileId = ref(props.block.files[0]?.id ?? \'\')', kind: 'context' },
                { left: 15, right: 15, text: '', kind: 'context' },
                { left: 16, right: '', text: 'function selectFile(file: FileChangeItem) {', kind: 'remove' },
                { left: 17, right: '', text: '  openFileId.value = file.id', kind: 'remove' },
                { left: '', right: 16, text: 'function selectFile(file: FileChangeItem) {', kind: 'add' },
                { left: '', right: 17, text: '  openFileId.value = openFileId.value === file.id ? \'\' : file.id', kind: 'add' },
                { left: 18, right: 18, text: '}', kind: 'context' },
                { left: '', right: 19, text: '/* single-open accordion with click-to-close */', kind: 'add' },
              ],
            },
            {
              id: 'f4',
              path: 'app/components/workbench/WorkbenchMainStage.vue',
              fileName: 'WorkbenchMainStage.vue',
              added: 3,
              removed: 1,
              lines: [
                { left: 42, right: 42, text: '<template v-for="(block, index) in message.blocks" :key="blockKey(block, index)">', kind: 'context' },
                { left: 43, right: '', text: '<ChatFileChangeCard v-else-if="block.type === \'file_change_card\'" :block="block" />', kind: 'remove' },
                { left: '', right: 43, text: '<div v-else-if="block.type === \'file_change_card\'" class="my-2">', kind: 'add' },
                { left: '', right: 44, text: '  <ChatFileChangeCard :block="block" />', kind: 'add' },
                { left: '', right: 45, text: '</div>', kind: 'add' },
              ],
            },
            {
              id: 'f5',
              path: 'app/data/workbench-chat-mock.ts',
              fileName: 'workbench-chat-mock.ts',
              added: 2,
              removed: 2,
              showDot: true,
              lines: [
                { left: 25, right: '', text: 'summaryLabel: \'1 file changed\',', kind: 'remove' },
                { left: 26, right: '', text: 'added: 2, removed: 2,', kind: 'remove' },
                { left: '', right: 25, text: 'summaryLabel: \'2 files changed\',', kind: 'add' },
                { left: '', right: 26, text: 'added: 4, removed: 4,', kind: 'add' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'a3',
      role: 'assistant',
      blocks: [
        {
          type: 'text',
          text: 'I also seeded longer demo content so the stage stays scrollable while validating bubble spacing, card states, and diff accents.',
        },
        {
          type: 'component_mention',
          lead: 'Refined',
          component: 'ChatFileChangeCard',
          trail: 'to support better visual QA with realistic diff rows and interactions.',
          path: 'app/components/workbench/chat/ChatFileChangeCard.vue',
        },
      ],
    },
  ],
  'thread-2': [
    { id: 'a3', role: 'assistant', text: 'Build is successful. Header spacing and hierarchy are now closer to Codex.' },
    { id: 'u2', role: 'user', text: 'Please keep theme controls outside the replica layer.' },
    { id: 'a4', role: 'assistant', text: 'Done. Theme controls are now detached and remain above the replica.' },
  ],
  'thread-3': [
    { id: 'a5', role: 'assistant', text: 'Sidebar lane and row geometry updated for Codex-like density.' },
    { id: 'u3', role: 'user', text: 'Keep the section title subtle and keep active rows restrained.' },
    { id: 'a6', role: 'assistant', text: 'Applied: lower-contrast section label and softer active state.' },
  ],
  'thread-4': [
    { id: 'a7', role: 'assistant', text: 'Terminal and diff controls now use subtle ghost hover.' },
    { id: 'u4', role: 'user', text: 'Great, keep the hover understated.' },
    { id: 'a8', role: 'assistant', text: 'Confirmed. Hover remains low-intensity with no layout shift.' },
  ],
  'thread-7': [
    { id: 'a9', role: 'assistant', text: 'Codex-theme sidebar checks are in good shape for this pass.' },
    { id: 'u9', role: 'user', text: 'Looks good, keep this one without diff counters.' },
  ],
  'thread-8': [
    { id: 'a10', role: 'assistant', text: 'Personal-page card states updated with balanced hover contrast.' },
    { id: 'u10', role: 'user', text: 'Nice, keep plus/minus visible for this task.' },
  ],
  'thread-working-demo': [
    {
      id: 'wd-u1',
      role: 'user',
      text: 'Replace the Nuxt icon usages in the sidebar toggle and new-thread affordances with the Codex SVG components from my screenshot, keeping layout pixel-stable.',
    },
    {
      id: 'wd-a1',
      role: 'assistant',
      workbenchDemo: {
        minWorkingSec: 6,
        maxDisplaySec: 120,
        statusLines: [
          'Explored 3 files, ran 2 searches',
          'Read `WorkbenchMainStage.vue`',
          'Read `ChatWorkbenchDemoMessage.vue`',
          'Searched for Nuxt icon usages in workbench controls',
          'Ran 1 command',
          'Created `CodexSidebarToggleIcon.vue` +10 -0',
          'Edited `WorkbenchSidebar.vue` +4 -2',
        ],
        body: [
          'I\'m replacing the three Nuxt-icon touchpoints—the new-thread affordance and both sidebar-toggle states—with Codex SVG components while keeping geometry pixel-stable.',
          'I validated the clickable areas and spacing against the existing layout so there is no hitbox drift and no alignment jump between collapsed and expanded sidebar states.',
          'Next I\'ll verify hover/pressed contrast in the panel context and keep the icon stroke weight consistent with the surrounding workbench chrome.',
        ],
        thinkingLabel: 'Thinking',
        blocks: [
          {
            type: 'file_change_card',
            id: 'card-working-demo',
            summaryLabel: '1 file changed',
            added: 10,
            removed: 0,
            revertLabel: 'Revert',
            files: [workingDemoSidebarIconFile],
          },
        ],
      },
    },
  ],
}
