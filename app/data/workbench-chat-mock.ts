import type { ChatMessage } from '~/types/workbench-chat'

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
          summaryLabel: '2 files changed',
          added: 4,
          removed: 4,
          revertLabel: 'Revert',
          files: [
            {
              id: 'f1',
              path: 'app/components/workbench/WorkbenchMainStage.vue',
              fileName: 'WorkbenchMainStage.vue',
              added: 2,
              removed: 2,
              lines: [
                { left: 11, right: 11, text: 'interface ChatMessage {', kind: 'context' },
                { left: 12, right: 12, text: '  role: \'assistant\' | \'user\'', kind: 'context' },
                { left: 13, right: '', text: '  text: string', kind: 'remove' },
                { left: '', right: 13, text: '  text?: string', kind: 'add' },
                { left: '', right: 14, text: '  blocks?: AssistantBlock[]', kind: 'add' },
                { left: 14, right: 15, text: '}', kind: 'context' },
                { left: 15, right: '', text: 'const messages = ref<ChatMessage[]>([])', kind: 'remove' },
                { left: 16, right: 16, text: 'const openFile = ref(\'\')', kind: 'context' },
              ],
            },
            {
              id: 'f2',
              path: 'app/components/workbench/chat/ChatComponentMention.vue',
              fileName: 'ChatComponentMention.vue',
              added: 2,
              removed: 2,
              lines: [
                { left: 11, right: 11, text: '<div class="flex items-baseline gap-2.5">', kind: 'context' },
                { left: 12, right: '', text: '<span class="mt-[1px] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--wb-text-secondary)]" />', kind: 'remove' },
                { left: '', right: 12, text: '<span class="mt-0 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--wb-text-primary)]" />', kind: 'add' },
                { left: 13, right: '', text: '<p class="text-[13px] text-[color:var(--wb-text-primary)] leading-[1.5]">', kind: 'remove' },
                { left: '', right: 13, text: '<p class="m-0 text-[13px] text-[color:var(--wb-text-primary)] leading-[1.5]">', kind: 'add' },
                { left: 14, right: 14, text: '<span class="mx-1 font-semibold text-[color:var(--theme-accent)]">{{ block.component }}</span>', kind: 'context' },
              ],
            },
          ],
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
}
