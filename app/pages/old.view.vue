<template>
  <main class="relative min-h-screen overflow-hidden bg-[#030405] text-[var(--un-preset-radix-slate12)]">
    <div class="[background-image:radial-gradient(circle_at_20%_0%,rgba(13,148,136,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(18,18,20,0.7),transparent_42%)] pointer-events-none absolute inset-0" />
    <div class="[background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none absolute inset-0 opacity-30" />

    <div class="relative mx-auto max-w-7xl px-4 py-10 lg:px-10 sm:px-6">
      <header class="panel-shell p-6 sm:p-8">
        <div class="flex flex-wrap items-start justify-between gap-6">
          <div class="max-w-3xl">
            <p class="font-geist-500 text-[10px] text-[var(--un-preset-radix-slate10)] tracking-[0.24em] uppercase sm:text-[11px]">
              Codex Theme Lab
            </p>
            <h1 class="font-geist-mono-700 mt-4 text-[clamp(2.1rem,5.4vw,4.25rem)] text-[var(--un-preset-radix-slate12)] leading-[0.92]">
              Black Console,
              <span class="text-[var(--un-preset-radix-mint10)]">Mint Signals</span>
            </h1>
            <p class="font-geist-400 mt-4 max-w-2xl text-[14px] text-[var(--un-preset-radix-slate10)] leading-relaxed sm:text-[16px]">
              Dark-first visual system for theme prototyping: near-black surfaces, quiet borders, strong typography,
              and mint used only where interaction needs hierarchy.
            </p>
          </div>

          <div class="min-w-[240px] border border-[var(--un-preset-radix-slate6)] rounded-2xl bg-[#0a0d10] p-4">
            <p class="font-geist-500 text-[10px] text-[var(--un-preset-radix-slate10)] tracking-[0.16em] uppercase">
              Active Profile
            </p>
            <div class="mt-3 flex items-center gap-3">
              <span class="h-2.5 w-2.5 rounded-full bg-[var(--un-preset-radix-mint9)] shadow-[0_0_0_5px_var(--un-preset-radix-mint3A)]" />
              <p class="font-geist-600 text-[15px] text-[var(--un-preset-radix-slate12)]">
                Oscurange Black
              </p>
            </div>
            <p class="font-geist-400 mt-3 text-[12px] text-[var(--un-preset-radix-slate10)]">
              Accent #f9b98c available, mint reserved for UI guidance.
            </p>
          </div>
        </div>
      </header>

      <section class="mt-6">
        <TealStatsCards />
      </section>

      <section class="mt-6">
        <TealControlPanel />
      </section>
    </div>
  </main>
</template>
