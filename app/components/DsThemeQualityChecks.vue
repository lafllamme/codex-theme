<script setup lang="ts">
interface QualityCheck {
  id: string
  label: string
  status: 'ok' | 'warn'
  detail: string
}

defineProps<{
  checks: QualityCheck[]
}>()
</script>

<template>
  <section class="preview-shell">
    <header class="preview-header">
      <p>Quality Checks</p>
      <p class="font-geist-mono-400 text-white/54 text-[11px]">
        live token diagnostics
      </p>
    </header>

    <div class="p-3 space-y-2">
      <article
        v-for="check in checks"
        :key="check.id"
        class="flex items-start gap-2 border rounded-xl p-2.5"
        :class="check.status === 'ok' ? 'border-emerald-500/35 bg-emerald-500/10' : 'border-amber-500/35 bg-amber-500/12'"
      >
        <span class="mt-[3px] h-2 w-2 rounded-full" :class="check.status === 'ok' ? 'bg-emerald-400' : 'bg-amber-400'" />
        <div class="min-w-0">
          <p class="font-geist-600 text-white/92 text-[12px]">
            {{ check.label }}
          </p>
          <p class="font-geist-400 text-white/66 text-[12px]">
            {{ check.detail }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.preview-shell {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 12px;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
}
</style>
