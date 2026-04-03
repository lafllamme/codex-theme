<template>
  <header class="mac-shell border-white/11 bg-black/82 border rounded-[22px] px-4 py-2.5 backdrop-blur-xl sm:px-5">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5">
          <span class="h-3 w-3 rounded-full bg-[#ff5f57] shadow-[0_0_0_1px_rgba(0,0,0,0.45)]" />
          <span class="h-3 w-3 rounded-full bg-[#febc2e] shadow-[0_0_0_1px_rgba(0,0,0,0.45)]" />
          <span class="h-3 w-3 rounded-full bg-[#28c840] shadow-[0_0_0_1px_rgba(0,0,0,0.45)]" />
        </div>
        <div class="border-white/10 bg-white/[0.04] text-white/60 hidden items-center gap-2 border rounded-full px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase sm:flex">
          <Icon name="ph:command-bold" class="h-3.5 w-3.5" />
          <span>Codex Theme Workbench</span>
        </div>
      </div>

      <div class="hidden items-center gap-2 lg:flex">
        <button class="chrome-chip">
          File
        </button>
        <button class="chrome-chip">
          Edit
        </button>
        <button class="chrome-chip">
          View
        </button>
        <button class="chrome-chip">
          Window
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button class="chrome-icon">
          <Icon name="ph:sidebar-bold" class="h-4 w-4" />
        </button>
        <button class="chrome-icon">
          <Icon name="ph:gear-six-bold" class="h-4 w-4" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.mac-shell {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 20px 40px rgba(0, 0, 0, 0.28);
}

.chrome-chip {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  padding: 6px 12px;
  font-family: var(--font-ui);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.74);
  transition: all 180ms ease;
}

.chrome-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.92);
}

.chrome-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  width: 32px;
  height: 32px;
  color: rgba(255, 255, 255, 0.68);
  background: rgba(255, 255, 255, 0.03);
  transition: all 180ms ease;
}

.chrome-icon:hover {
  border-color: rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.9);
}
</style>
