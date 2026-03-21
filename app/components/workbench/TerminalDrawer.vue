<script setup lang="ts">
type LineType = 'cmd' | 'plain' | 'add' | 'success' | 'error'

interface BootLine {
  type: LineType
  text: string
  delay: number
}

interface LogLine {
  type: LineType
  text: string
}

const props = defineProps<{
  open: boolean
  contrast: number
  opaqueWindows: boolean
}>()

const BOOT_LINES: BootLine[] = [
  { type: 'cmd', text: 'git push origin main', delay: 0 },
  { type: 'plain', text: 'Enumerating objects: 12, done.', delay: 350 },
  { type: 'plain', text: 'Counting objects: 100% (12/12), done.', delay: 600 },
  { type: 'plain', text: 'Delta compression using up to 10 threads', delay: 800 },
  { type: 'plain', text: 'Compressing objects: 100% (8/8), done.', delay: 1000 },
  { type: 'add', text: 'Writing objects: 100% (8/8), 2.41 KiB | 2.41 MiB/s, done.', delay: 1300 },
  { type: 'add', text: 'remote: Resolving deltas: 100% (4/4), done.', delay: 1600 },
  { type: 'success', text: 'To github.com:user/repo.git', delay: 1900 },
  { type: 'success', text: 'a3f91b2..d84c3e7  main -> main', delay: 2050 },
]

const lines = ref<LogLine[]>([])
const done = ref(false)
const cursorVisible = ref(true)
const scrollRef = ref<HTMLDivElement | null>(null)
const bootTimers = ref<ReturnType<typeof setTimeout>[]>([])
let cursorTimer: ReturnType<typeof setInterval> | null = null

const path = '~/projects/my-app'
const branch = 'main'

const lineColor = (type: LineType) => {
  if (type === 'add' || type === 'success')
    return 'var(--theme-accent)'
  if (type === 'error')
    return 'var(--theme-removed)'
  if (type === 'plain')
    return 'var(--wb-text-muted)'
  return 'var(--wb-text-primary)'
}

function clearBootTimers() {
  for (const timer of bootTimers.value)
    clearTimeout(timer)
  bootTimers.value = []
}

function stopCursor() {
  if (!cursorTimer)
    return
  clearInterval(cursorTimer)
  cursorTimer = null
}

function startCursor() {
  stopCursor()
  cursorVisible.value = true
  cursorTimer = setInterval(() => {
    cursorVisible.value = !cursorVisible.value
  }, 530)
}

function startBootSequence() {
  clearBootTimers()
  lines.value = []
  done.value = false

  for (const [index, line] of BOOT_LINES.entries()) {
    const timer = setTimeout(() => {
      lines.value.push({ type: line.type, text: line.text })
      if (index === BOOT_LINES.length - 1)
        done.value = true
    }, line.delay)

    bootTimers.value.push(timer)
  }
}

watch(lines, () => {
  nextTick(() => {
    if (scrollRef.value)
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  })
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      startBootSequence()
      startCursor()
      return
    }

    clearBootTimers()
    stopCursor()
    lines.value = []
    done.value = false
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearBootTimers()
  stopCursor()
})
</script>

<template>
  <section
    class="terminal-drawer overflow-hidden"
    :class="open ? 'terminal-drawer--open terminal-drawer--spaced' : 'terminal-drawer--closed'"
  >
    <header class="h-[34px] flex items-center px-3 text-[12px]">
      <div class="inline-flex items-center gap-2">
        <span class="font-[var(--font-ui)] text-[color:var(--wb-text-primary)]">Terminal</span>
        <span class="font-[var(--font-ui)] text-[color:var(--wb-text-secondary)]">zsh</span>
      </div>
    </header>
    <div ref="scrollRef" class="terminal-body h-52 overflow-y-auto px-5 py-3">
      <p
        v-for="(line, index) in lines"
        :key="`${line.type}-${index}`"
        class="terminal-line font-[var(--font-code)]"
        :style="{ color: lineColor(line.type) }"
      >
        <template v-if="line.type === 'cmd'">
          <span class="text-[var(--theme-accent)]">{{ path }}</span>
          <span class="text-[#555]">&nbsp;git:(</span>
          <span class="text-[var(--theme-accent)]">{{ branch }}</span>
          <span class="text-[#555]">) </span>
          <span class="text-[#e8e8e8]">{{ line.text }}</span>
        </template>
        <template v-else>
          {{ line.text }}
        </template>
      </p>

      <p
        v-if="done"
        class="terminal-line mt-1 font-[var(--font-code)]"
      >
        <span class="text-[var(--theme-accent)]">{{ path }}</span>
        <span class="text-[#555]">&nbsp;git:(</span>
        <span class="text-[var(--theme-accent)]">{{ branch }}</span>
        <span class="text-[#555]">) </span>
        <span class="terminal-cursor" :style="{ opacity: cursorVisible ? 1 : 0 }" />
      </p>
    </div>
  </section>
</template>

<style scoped>
.terminal-drawer {
  margin-top: 0;
  max-height: 0;
  opacity: 0;
  transform: translateY(12px);
  width: 100%;
  border: 0;
  border-top: 1px solid var(--wb-divider);
  border-radius: 0;
  background: var(--wb-bg-panel);
  will-change: max-height, opacity, transform, margin-top;
  transition:
    margin-top 220ms ease,
    max-height 280ms ease,
    opacity 220ms ease,
    transform 220ms ease,
    border-color 220ms ease;
}

.terminal-drawer--spaced {
  margin-top: 8px;
}

.terminal-drawer--open {
  max-height: 300px;
  opacity: 1;
  transform: translateY(0);
}

.terminal-drawer--closed {
  margin-top: 0;
  pointer-events: none;
}

.terminal-body::-webkit-scrollbar {
  display: none;
}

.terminal-body {
  scrollbar-width: none;
  -ms-overflow-style: none;
  font-size: var(--code-font-size);
}

.terminal-line {
  margin: 0;
  line-height: 1.55;
}

.terminal-cursor {
  display: inline-block;
  width: clamp(6px, calc(var(--code-font-size) * 0.52), 10px);
  height: var(--code-font-size);
  vertical-align: middle;
  background: var(--theme-accent);
}

@media (max-width: 1180px) {
  .terminal-drawer {
    position: fixed;
    left: 8px;
    right: 8px;
    bottom: 8px;
    z-index: 41;
    box-shadow: 0 24px 40px rgba(0, 0, 0, 0.45);
  }

  .terminal-drawer--open {
    max-height: min(48vh, 320px);
  }
}
</style>
