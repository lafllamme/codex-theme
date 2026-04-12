<script setup lang="ts">
import type { AssistantBlock, ChatMessage, ComponentMentionBlock } from '~/types/workbench-chat'
import { usePreferredReducedMotion, useTimeoutFn } from '@vueuse/core'
import DsMessageHeader from '~/components/DsMessageHeader.vue'
import DsShinyText from '~/components/DsShinyText.vue'
import NativeTypewriter from '~/components/NativeTypewriter.vue'
import ChatComponentMention from '~/components/workbench/chat/ChatComponentMention.vue'
import ChatFileChangeCard from '~/components/workbench/chat/ChatFileChangeCard.vue'

interface ParsedDiffStatusLine {
  verb: 'Created' | 'Edited'
  file: string
  added: number
  removed: number
}

const props = defineProps<{
  message: ChatMessage
  codeThemeId: string
}>()

const DIFF_STATUS_LINE_RE = /^(Created|Edited)\s+`([^`]+)`\s+\+(\d+)\s+-(\d+)$/

const demo = computed(() => props.message.workbenchDemo!)

const shouldReduceMotion = usePreferredReducedMotion()

const showWorking = ref(true)
const showStatus = ref(false)
const showTypewriter = ref(false)
const showThinking = ref(false)
const showTail = ref(false)
const visibleStatusCount = ref(0)
const activeActionShinyIndex = ref(-1)
const pendingActionShinyQueue = ref<number[]>([])
const actionShinyStartedAt = ref(0)
const actionShinySwitchDelayMs = ref(0)
const actionShinyHoldDelayMs = ref(0)
const isActionShinySwitchScheduled = ref(false)
const isActionShinyActive = ref(false)

const bodyPlain = computed(() => {
  const b = demo.value.body
  return Array.isArray(b) ? b.join('\n\n') : b
})

const workingDelayMs = ref(4000)
const statusLineMs = ref(1500)
const actionShinySpeedSec = 2.2
const actionShinyDelaySec = 0.05
const actionShinyCycleMs = computed(() => (actionShinySpeedSec + actionShinyDelaySec) * 1000)
const thinkingIterations = 3
const thinkingSpeedSec = 1.4
const thinkingDelaySec = 0.05
const thinkingDurationMs = computed(() => thinkingIterations * (thinkingSpeedSec + thinkingDelaySec) * 1000)

const isThinkingShiny = computed(() => showThinking.value)

const { start: startActionShinyHold, stop: stopActionShinyHold } = useTimeoutFn(() => {
  isActionShinyActive.value = false
  activeActionShinyIndex.value = -1
  scheduleNextActionShinyIfNeeded()
}, actionShinyHoldDelayMs)

const { start: startActionShinySwitch, stop: stopActionShinySwitch } = useTimeoutFn(() => {
  isActionShinySwitchScheduled.value = false
  const next = pendingActionShinyQueue.value.shift()
  if (typeof next !== 'number')
    return

  activeActionShinyIndex.value = next
  actionShinyStartedAt.value = Date.now()
  isActionShinyActive.value = true
  actionShinyHoldDelayMs.value = actionShinyCycleMs.value
  startActionShinyHold()
}, actionShinySwitchDelayMs)

function scheduleNextActionShinyIfNeeded() {
  if (!showStatus.value || pendingActionShinyQueue.value.length === 0)
    return
  if (isActionShinySwitchScheduled.value || isActionShinyActive.value)
    return

  const cycle = Math.max(1, actionShinyCycleMs.value)
  let waitMs = 0
  if (activeActionShinyIndex.value >= 0) {
    const elapsed = Math.max(0, Date.now() - actionShinyStartedAt.value)
    const remainder = elapsed % cycle
    waitMs = remainder === 0 ? cycle : cycle - remainder
  }

  actionShinySwitchDelayMs.value = waitMs
  isActionShinySwitchScheduled.value = true
  startActionShinySwitch()
}

function resetActionShinyState() {
  stopActionShinySwitch()
  stopActionShinyHold()
  pendingActionShinyQueue.value = []
  activeActionShinyIndex.value = -1
  isActionShinySwitchScheduled.value = false
  isActionShinyActive.value = false
  actionShinyStartedAt.value = 0
}

const { start: startAdvanceStatus, stop: stopAdvanceStatus } = useTimeoutFn(() => {
  const next = visibleStatusCount.value
  if (next < demo.value.statusLines.length) {
    visibleStatusCount.value += 1
    if (!parseDiffStatusLine(demo.value.statusLines[next] ?? '')) {
      pendingActionShinyQueue.value.push(next)
      scheduleNextActionShinyIfNeeded()
    }
    startAdvanceStatus()
    return
  }

  showTypewriter.value = true
}, statusLineMs)

const { start: startThinkingDone, stop: stopThinkingDone } = useTimeoutFn(() => {
  showThinking.value = false
  resetActionShinyState()
  showTail.value = true
  showWorking.value = false
}, thinkingDurationMs)

const { start: startWorkingPhase, stop: stopWorkingPhase } = useTimeoutFn(() => {
  showStatus.value = true
  showThinking.value = Boolean(demo.value.thinkingLabel)
  if (demo.value.statusLines.length > 0) {
    visibleStatusCount.value = 0
    startAdvanceStatus()
  }
  else {
    showTypewriter.value = true
  }
}, workingDelayMs)

function onTypewriterComplete() {
  if (!showTypewriter.value || showTail.value)
    return

  if (!showThinking.value || !demo.value.thinkingLabel) {
    showTail.value = true
    showWorking.value = false
    return
  }

  startThinkingDone()
}

function startPhasedDemo() {
  stopWorkingPhase()
  stopAdvanceStatus()
  stopThinkingDone()
  resetActionShinyState()

  if (shouldReduceMotion.value === 'reduce') {
    showStatus.value = demo.value.statusLines.length > 0
    visibleStatusCount.value = demo.value.statusLines.length
    activeActionShinyIndex.value = -1
    showTypewriter.value = true
    showThinking.value = Boolean(demo.value.thinkingLabel)
    showWorking.value = false
    showTail.value = true
    return
  }

  showWorking.value = true
  showStatus.value = false
  showTypewriter.value = false
  showThinking.value = false
  showTail.value = false
  visibleStatusCount.value = 0
  activeActionShinyIndex.value = -1

  workingDelayMs.value = demo.value.minWorkingSec * 1000
  statusLineMs.value = 1400
  startWorkingPhase()
}

watch(
  () => props.message.id,
  () => {
    startPhasedDemo()
  },
  { immediate: true },
)

watch(shouldReduceMotion, () => {
  startPhasedDemo()
})

const maxWorkingSec = computed(() => demo.value.maxDisplaySec ?? 120)
const { title: workingTitle } = useWorkingForTitle(showWorking, maxWorkingSec)

const copiedMessageId = ref<string | null>(null)

const { start: startCopiedReset, stop: stopCopiedReset } = useTimeoutFn(() => {
  copiedMessageId.value = null
}, 2200)

function blockKey(block: AssistantBlock, index: number) {
  if (block.type === 'text')
    return `text-${index}-${block.text.slice(0, 12)}`
  if (block.type === 'component_mention')
    return `mention-${index}-${block.component}`
  return `change-${index}-${block.summaryLabel}`
}

function firstFileChangeCardIndex() {
  const blocks = demo.value.blocks
  return blocks.findIndex(block => block.type === 'file_change_card')
}

function parseDiffStatusLine(line: string): ParsedDiffStatusLine | null {
  const match = DIFF_STATUS_LINE_RE.exec(line.trim())
  if (!match)
    return null
  return {
    verb: match[1] as ParsedDiffStatusLine['verb'],
    file: match[2]!,
    added: Number(match[3]),
    removed: Number(match[4]),
  }
}

const parsedStatusLines = computed(() => demo.value.statusLines.map(parseDiffStatusLine))

const STATUS_PATH_HINTS: Record<string, string> = {
  'CodexSidebarToggleIcon.vue': 'app/components/icons/CodexSidebarToggleIcon.vue',
  'WorkbenchSidebar.vue': 'app/components/workbench/WorkbenchSidebar.vue',
}

function resolveStatusPath(file: string) {
  if (file.includes('/'))
    return file
  return STATUS_PATH_HINTS[file] ?? file
}

function diffStatusToMentionBlock(line: ParsedDiffStatusLine): ComponentMentionBlock {
  return {
    type: 'component_mention',
    lead: line.verb,
    component: line.file,
    path: resolveStatusPath(line.file),
  }
}

async function copyMessage() {
  const payload = bodyPlain.value.trim()
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(payload)
      stopCopiedReset()
      copiedMessageId.value = props.message.id
      startCopiedReset()
    }
  }
  catch {
    copiedMessageId.value = null
  }
}
</script>

<template>
  <ClientOnly>
    <div class="flex w-full min-w-0 flex-col gap-1.5">
      <div
        class="w-full min-w-0 max-w-none shrink-0 self-stretch"
      >
        <DsMessageHeader variant="status" :title="workingTitle" />
      </div>

      <template v-if="showStatus">
        <div
          v-for="(line, i) in demo.statusLines"
          v-show="i < visibleStatusCount"
          :key="`st-${i}`"
          class="m-0 w-full min-w-0 max-w-full text-[length:var(--wb-ui-text-xs)] leading-[1.5]"
        >
          <template v-if="parsedStatusLines[i]">
            <ChatComponentMention
              :block="diffStatusToMentionBlock(parsedStatusLines[i]!)"
              compact
              hide-dot
              muted
              :added="parsedStatusLines[i]!.added"
              :removed="parsedStatusLines[i]!.removed"
            />
          </template>
          <DsShinyText
            v-else-if="i === activeActionShinyIndex"
            :text="line"
            :speed="actionShinySpeedSec"
            :delay="actionShinyDelaySec"
            direction="left"
            class="text-[length:var(--wb-ui-text-xs)]"
          />
          <span
            v-else
            class="text-[length:var(--wb-ui-text-xs)] text-[color:var(--wb-text-muted)]"
          >
            {{ line }}
          </span>
        </div>
      </template>

      <template v-if="showTypewriter">
        <div
          class="w-full min-w-0 max-w-full whitespace-pre-line text-[length:var(--wb-chat-message-size)] text-[color:var(--wb-text-primary)] leading-[1.5]"
        >
          <NativeTypewriter
            :content="bodyPlain"
            mode="chunk"
            :chunk-size-words="2"
            :chunk-interval="55"
            :chunk-fade-duration="300"
            chunk-fade-easing="cubic-bezier(0.4, 0, 0.2, 1)"
            :cursor="false"
            :morph="false"
            wrap
            @complete="onTypewriterComplete"
          />
        </div>
      </template>

      <p
        v-if="showThinking && demo.thinkingLabel"
        class="m-0 w-full min-w-0 max-w-full text-[length:var(--wb-ui-text-xs)] leading-[1.5]"
      >
        <DsShinyText
          v-if="isThinkingShiny"
          :text="demo.thinkingLabel"
          :speed="thinkingSpeedSec"
          :delay="thinkingDelaySec"
          direction="left"
          class="text-[length:var(--wb-ui-text-xs)]"
        />
        <span
          v-else
          class="text-[length:var(--wb-ui-text-xs)] text-[color:var(--wb-text-muted)]"
        >
          {{ demo.thinkingLabel }}
        </span>
      </p>

      <template v-if="showTail">
        <template v-for="(block, index) in demo.blocks" :key="blockKey(block, index)">
          <p v-if="block.type === 'text'" class="m-0 w-full min-w-0 max-w-full whitespace-pre-line leading-[1.5]">
            {{ block.text }}
          </p>
          <div v-else-if="block.type === 'component_mention'" class="w-full min-w-0 max-w-full">
            <ChatComponentMention :block="block" />
          </div>
          <div v-else-if="block.type === 'file_change_card'" class="mt-3">
            <button
              v-if="index === firstFileChangeCardIndex()"
              class="pointer-events-none w-fit inline-flex items-center rounded-[8px] border-none bg-transparent px-1.5 py-1 text-[length:var(--wb-ui-text-2xs)] text-[color:var(--wb-text-muted)] opacity-0 outline-none transition-[opacity,background-color,color] duration-150 group-hover:pointer-events-auto hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)] group-hover:opacity-100"
              @click="copyMessage"
            >
              <Icon :name="copiedMessageId === message.id ? 'ph:check-bold' : 'ph:copy'" class="h-[13px] w-[13px]" />
            </button>
            <ChatFileChangeCard class="my-1.5 w-full" :block="block" :code-theme-id="codeThemeId" />
          </div>
        </template>
      </template>
    </div>

    <template #fallback>
      <div class="w-full min-w-0">
        <div class="mb-1 w-full min-w-0 px-1">
          <div class="flex h-8 w-full min-w-0 items-center">
            <span class="min-w-0 flex-1 text-[length:var(--wb-ui-text-xs)] text-[color:var(--wb-text-muted)] font-normal leading-none">Working for 0s</span>
          </div>
          <div class="h-px w-full bg-[var(--wb-divider)]" />
        </div>
      </div>
    </template>
  </ClientOnly>
</template>
