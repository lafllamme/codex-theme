<script setup lang="ts">
import type { AssistantBlock, ChatMessage } from '~/types/workbench-chat'
import { usePreferredReducedMotion, useTimeoutFn } from '@vueuse/core'
import DsMessageHeader from '~/components/DsMessageHeader.vue'
import DsShinyText from '~/components/DsShinyText.vue'
import ChatComponentMention from '~/components/workbench/chat/ChatComponentMention.vue'
import ChatFileChangeCard from '~/components/workbench/chat/ChatFileChangeCard.vue'
import NativeTypewriter from '~/components/NativeTypewriter.vue'

const props = defineProps<{
  message: ChatMessage
  codeThemeId: string
}>()

const demo = computed(() => props.message.workbenchDemo!)

const shouldReduceMotion = usePreferredReducedMotion()

const showWorking = ref(true)
const showStatusAndTypewriter = ref(false)
const showTail = ref(false)

const bodyPlain = computed(() => {
  const b = demo.value.body
  return Array.isArray(b) ? b.join('\n\n') : b
})

const tailDelayMs = ref(600)
const workingDelayMs = ref(4000)

const { start: startTailPhase, stop: stopTailPhase } = useTimeoutFn(() => {
  showTail.value = true
}, tailDelayMs)

const { start: startWorkingPhase, stop: stopWorkingPhase } = useTimeoutFn(() => {
  showWorking.value = false
  showStatusAndTypewriter.value = true
  tailDelayMs.value = Math.max(400, bodyPlain.value.length * 50 + 600)
  startTailPhase()
}, workingDelayMs)

function startPhasedDemo() {
  stopWorkingPhase()
  stopTailPhase()

  if (shouldReduceMotion.value === 'reduce') {
    showWorking.value = false
    showStatusAndTypewriter.value = true
    showTail.value = true
    return
  }

  showWorking.value = true
  showStatusAndTypewriter.value = false
  showTail.value = false

  workingDelayMs.value = demo.value.minWorkingSec * 1000
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
      <!-- Bleed past message article padding (p-[12px_14px]) so “Working” aligns with “previous message” above -->
      <div
        v-if="showWorking"
        class="-mx-[14px] w-[calc(100%+28px)] min-w-0 max-w-none shrink-0 self-stretch"
      >
        <DsMessageHeader variant="status" :title="workingTitle" />
      </div>

      <template v-if="showStatusAndTypewriter">
        <p
          v-for="(line, i) in demo.statusLines"
          :key="`st-${i}`"
          class="m-0 w-full min-w-0 max-w-full text-[length:var(--wb-ui-text-xs)] leading-[1.5]"
        >
          <DsShinyText
            :text="line"
            :speed="2.2"
            :delay="0.05"
            direction="left"
            class="text-[length:var(--wb-ui-text-xs)]"
          />
        </p>

        <div
          class="w-full min-w-0 max-w-full whitespace-pre-line text-[length:var(--wb-chat-message-size)] text-[color:var(--wb-text-primary)] leading-[1.5]"
        >
          <NativeTypewriter
            :content="bodyPlain"
            speed="medium"
            :cursor="shouldReduceMotion !== 'reduce'"
            :morph="true"
            wrap
          />
        </div>

        <template v-if="showTail">
          <p
            v-if="demo.thinkingLabel"
            class="m-0 w-full min-w-0 max-w-full text-[length:var(--wb-ui-text-xs)] leading-[1.5]"
          >
            <DsShinyText
              :text="demo.thinkingLabel"
              :speed="2.2"
              :delay="0.05"
              direction="left"
              class="text-[length:var(--wb-ui-text-xs)]"
            />
          </p>

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
      </template>
    </div>

    <template #fallback>
      <div class="-mx-[14px] w-[calc(100%+28px)] min-w-0">
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
