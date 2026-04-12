export interface TextBlock {
  type: 'text'
  text: string
}

export interface ComponentMentionBlock {
  type: 'component_mention'
  lead: string
  component: string
  trail?: string
  path: string
}

export interface FileDiffCodeLine {
  left: number | string
  right: number | string
  text: string
  kind: 'context' | 'add' | 'remove' | 'added' | 'removed'
}

export interface FileDiffUnchangedChunkLine {
  kind: 'unchanged_chunk'
  id: string
  count: number
  lines: FileDiffCodeLine[]
}

export type FileDiffLine = FileDiffCodeLine | FileDiffUnchangedChunkLine

export interface FileChangeItem {
  id: string
  path: string
  fileName: string
  added: number
  removed: number
  showDot?: boolean
  lines: FileDiffLine[]
}

export interface FileChangeCardBlock {
  type: 'file_change_card'
  id: string
  summaryLabel: string
  added: number
  removed: number
  revertLabel: string
  files: FileChangeItem[]
}

export type AssistantBlock = TextBlock | ComponentMentionBlock | FileChangeCardBlock

/** Scripted “Working for…” demo inside the assistant bubble (themes workbench mock). */
export interface WorkbenchChatDemoScript {
  /** Seconds to stay in the working phase before revealing status + body (timer display caps at `maxDisplaySec`). */
  minWorkingSec: number
  /** Cap for the “Working for …” label (default 120). */
  maxDisplaySec?: number
  statusLines: string[]
  /** One paragraph or several (joined with blank lines for typewriter). */
  body: string | string[]
  thinkingLabel?: string
  blocks: AssistantBlock[]
}

export interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  text?: string
  blocks?: AssistantBlock[]
  workbenchDemo?: WorkbenchChatDemoScript
}
