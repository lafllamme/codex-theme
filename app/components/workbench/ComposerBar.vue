<script setup lang="ts">
defineProps<{
  modelOptions: string[]
  thinkingOptions: string[]
}>()

const selectedModel = defineModel<string>('selectedModel', { required: true })
const selectedThinking = defineModel<string>('selectedThinking', { required: true })
const composeValue = defineModel<string>('composeValue', { required: true })
</script>

<template>
  <footer class="composer-wrap">
    <div class="composer-row">
      <button class="composer-icon">
        <Icon name="ph:plus-bold" class="icon-14" />
      </button>

      <select v-model="selectedModel" class="composer-select">
        <option v-for="model in modelOptions" :key="model" :value="model">
          {{ model }}
        </option>
      </select>

      <select v-model="selectedThinking" class="composer-select composer-select--small">
        <option v-for="thinking in thinkingOptions" :key="thinking" :value="thinking">
          {{ thinking }}
        </option>
      </select>

      <input v-model="composeValue" class="composer-input" type="text">

      <button class="composer-icon">
        <Icon name="ph:microphone-bold" class="icon-14" />
      </button>
      <button class="send-btn">
        <Icon name="ph:arrow-up-bold" class="icon-14" />
      </button>
    </div>

    <div class="status-row">
      <div class="status-left">
        <span><Icon name="ph:laptop-bold" class="icon-12" /> Local</span>
        <span><Icon name="ph:lock-key-bold" class="icon-12" /> Full access</span>
      </div>
      <div class="status-right">
        <span><Icon name="ph:git-branch-bold" class="icon-12" /> main</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.composer-wrap {
  margin-top: 8px;
  border: 1px solid var(--wb-border-1);
  border-radius: var(--wb-r-md);
  background: rgba(8, 9, 11, 0.92);
  padding: 8px;
}

.composer-row {
  display: grid;
  grid-template-columns: 34px 170px 110px 1fr 34px 34px;
  gap: 8px;
  align-items: center;
}

.composer-icon,
.composer-select,
.composer-input {
  height: 34px;
  border-radius: 9px;
  border: 1px solid var(--wb-border-2);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.92);
}

.composer-icon {
  width: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.composer-select,
.composer-input {
  padding: 0 11px;
  font-size: 13px;
}

.send-btn {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--theme-accent) 62%, rgba(255, 255, 255, 0.18));
  background: color-mix(in srgb, var(--theme-accent) 82%, black 18%);
  color: black;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.status-row {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.66);
  font-size: 12px;
}

.status-left,
.status-right {
  display: inline-flex;
  align-items: center;
  gap: 14px;
}

.status-row span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.icon-14 { width: 14px; height: 14px; }
.icon-12 { width: 12px; height: 12px; }

@media (max-width: 1180px) {
  .composer-row {
    grid-template-columns: 34px 1fr 1fr;
    grid-auto-rows: 34px;
  }

  .composer-input {
    grid-column: 1 / -1;
  }

  .status-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
