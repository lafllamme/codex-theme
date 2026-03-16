<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  label: string
  presets?: string[]
  resetValue?: string
}>(), {
  presets: () => [],
  resetValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const HEX_PATTERN = /^[\dA-F]{3}$|^[\dA-F]{6}$/i
const HASH_PREFIX_PATTERN = /^#/

const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const draftHex = ref(props.modelValue)

function normalizeHex(value: string) {
  const cleaned = value.trim().replace(HASH_PREFIX_PATTERN, '')
  if (!HEX_PATTERN.test(cleaned))
    return null

  const expanded = cleaned.length === 3
    ? cleaned.split('').map(char => `${char}${char}`).join('')
    : cleaned

  return `#${expanded.toUpperCase()}`
}

function applyHex(value: string) {
  const normalized = normalizeHex(value)
  if (!normalized)
    return false

  draftHex.value = normalized
  emit('update:modelValue', normalized)
  return true
}

watch(() => props.modelValue, (next) => {
  draftHex.value = next
})

function onDocumentClick(event: MouseEvent) {
  if (!rootRef.value)
    return
  if (rootRef.value.contains(event.target as Node))
    return
  isOpen.value = false
  draftHex.value = props.modelValue
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentClick)
})
</script>

<template>
  <label class="field-row">
    <span>{{ label }}</span>
    <div ref="rootRef" class="relative">
      <button class="swatch-trigger" type="button" @click="isOpen = !isOpen">
        <span class="swatch-dot" :style="{ background: modelValue }" />
        <span class="font-geist-mono-500 text-[12px]">{{ modelValue }}</span>
        <Icon name="ph:caret-down-bold" class="text-white/55 h-3.5 w-3.5" />
      </button>

      <transition name="popover-fade">
        <div v-if="isOpen" class="popover-shell">
          <div class="border-white/12 h-20 w-full border rounded-[10px]" :style="{ background: modelValue }" />

          <div class="mt-2.5 flex items-center gap-2">
            <input
              v-model="draftHex"
              class="color-input"
              type="text"
              spellcheck="false"
              placeholder="#000000"
              @keydown.enter.prevent="applyHex(draftHex)"
            >
            <button class="mini-btn" type="button" @click="applyHex(draftHex)">
              Apply
            </button>
          </div>

          <div class="grid grid-cols-6 mt-2.5 gap-1.5">
            <button
              v-for="color in presets"
              :key="color"
              class="preset-chip"
              type="button"
              :style="{ background: color }"
              :title="color"
              @click="applyHex(color)"
            />
          </div>

          <button v-if="resetValue" class="mini-btn mt-2.5 w-full justify-center" type="button" @click="applyHex(resetValue)">
            Reset
          </button>
        </div>
      </transition>
    </div>
  </label>
</template>

<style scoped>
.field-row {
  display: grid;
  gap: 6px;
}

.field-row > span {
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.58);
}

.swatch-trigger {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.swatch-dot {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.38);
  flex-shrink: 0;
}

.popover-shell {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  z-index: 40;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  background: rgba(5, 6, 7, 0.96);
  backdrop-filter: blur(18px);
  padding: 10px;
  box-shadow: 0 22px 34px rgba(0, 0, 0, 0.5);
}

.color-input {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 8px 9px;
  font-family: var(--font-code);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.92);
  outline: none;
}

.color-input:focus {
  border-color: rgba(130, 247, 231, 0.58);
}

.mini-btn {
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.88);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  font-family: var(--font-ui);
  font-size: 12px;
}

.preset-chip {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 7px;
  height: 22px;
}

.popover-fade-enter-active,
.popover-fade-leave-active {
  transition: all 180ms ease;
}

.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: translateY(-3px) scale(0.98);
}
</style>
