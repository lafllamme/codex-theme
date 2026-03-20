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
          summaryLabel: '1 file changed',
          added: 2,
          removed: 2,
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
      ],
    },
    {
      id: 'a3',
      role: 'assistant',
      text: 'I also seeded longer demo content so the stage stays scrollable while validating bubble spacing, card states, and diff accents.',
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
