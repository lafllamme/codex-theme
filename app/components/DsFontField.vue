<script setup lang="ts">
const props = defineProps<{
  modelValue: string | null
  label: string
  presetOptions: Array<{ label: string, value: string | null }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const selectedPreset = computed(() => {
  const current = props.modelValue?.trim() || null
  const hit = props.presetOptions.find(item => item.value === current)
  return hit?.value ?? '__custom__'
})

const customValue = ref(props.modelValue || '')

watch(() => props.modelValue, (next) => {
  customValue.value = next || ''
})

function onPresetInput(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target)
    return

  if (target.value === '__custom__')
    return

  emit('update:modelValue', target.value || null)
}

function applyCustom() {
  emit('update:modelValue', customValue.value.trim() || null)
}
</script>

<template>
  <label class="field-row">
    <span>{{ label }}</span>
    <div class="grid gap-2">
      <select class="field-input" :value="selectedPreset" @input="onPresetInput">
        <option v-for="option in presetOptions" :key="option.label" :value="option.value || ''">
          {{ option.label }}
        </option>
        <option value="__custom__">
          Custom
        </option>
      </select>

      <div class="flex items-center gap-2">
        <input
          v-model="customValue"
          class="field-input"
          type="text"
          spellcheck="false"
          placeholder="Optional custom stack"
          @keydown.enter.prevent="applyCustom"
        >
        <button class="mini-btn" type="button" @click="applyCustom">
          Set
        </button>
      </div>
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

.field-input {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  padding: 8px 10px;
  font-size: 13px;
  font-family: var(--font-code);
  color: rgba(255, 255, 255, 0.9);
  outline: none;
}

.field-input:focus {
  border-color: rgba(130, 247, 231, 0.62);
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
</style>
