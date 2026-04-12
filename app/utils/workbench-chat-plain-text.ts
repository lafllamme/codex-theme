import type { AssistantBlock, ChatMessage, WorkbenchChatDemoScript } from '~/types/workbench-chat'

export function blockToPlainText(block: AssistantBlock): string {
  if (block.type === 'text')
    return block.text
  if (block.type === 'component_mention')
    return `${block.lead} ${block.component}${block.trail ? ` ${block.trail}` : ''}\n${block.path}`
  return [
    `${block.summaryLabel} +${block.added} -${block.removed}`,
    ...block.files.map(file => `${file.path} +${file.added} -${file.removed}`),
  ].join('\n')
}

export function workbenchDemoToPlainText(script: WorkbenchChatDemoScript): string {
  const body = Array.isArray(script.body) ? script.body.join('\n\n') : script.body
  const narrative = [body, ...script.statusLines, script.thinkingLabel].filter(Boolean).join('\n\n')
  const blocks = script.blocks.map(blockToPlainText).join('\n\n')
  return [narrative, blocks].filter(Boolean).join('\n\n')
}

export function chatMessageToPlainText(message: ChatMessage): string {
  if (message.workbenchDemo)
    return workbenchDemoToPlainText(message.workbenchDemo)
  if (message.blocks?.length)
    return message.blocks.map(blockToPlainText).join('\n\n')
  return message.text ?? ''
}
