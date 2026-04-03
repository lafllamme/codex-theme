<template>
  <section class="panel-shell p-5 sm:p-6">
    <div class="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 class="font-geist-600 m-0 text-[28px] text-[var(--un-preset-radix-slate12)] leading-[1.05] sm:text-[32px]">
          Control Surface
        </h2>
        <p class="font-geist-400 mt-1 text-[14px] text-[var(--un-preset-radix-slate10)] sm:text-[15px]">
          Core actions and token previews for rapid visual iteration.
        </p>
      </div>

      <div class="border border-[var(--un-preset-radix-slate6)] rounded-xl bg-[#090c0f] px-3 py-2">
        <p class="font-geist-mono-500 text-[12px] text-[var(--un-preset-radix-slate10)] tracking-[0.14em] uppercase">
          Contrast 60
        </p>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        class="font-geist-600 teal-btn border-[var(--un-preset-radix-slate6)] bg-[#0e1114] text-[15px] text-[var(--un-preset-radix-slate12)] hover:border-[var(--un-preset-radix-mint7)] hover:text-[var(--un-preset-radix-mint11)]"
      >
        Apply Theme
      </button>
      <button
        class="font-geist-600 teal-btn border-[var(--un-preset-radix-mint6A)] bg-[var(--un-preset-radix-mint3A)] text-[15px] text-[var(--un-preset-radix-mint11)] hover:bg-[var(--un-preset-radix-mint4A)]"
      >
        Copy JSON
      </button>
      <button
        class="font-geist-600 teal-btn border-[var(--un-preset-radix-slate6)] bg-transparent text-[15px] text-[var(--un-preset-radix-slate11)] hover:bg-[var(--un-preset-radix-slate4)]"
      >
        Reset
      </button>
    </div>

    <div class="grid mt-5 gap-3 lg:grid-cols-4 sm:grid-cols-2">
      <div class="border border-[var(--un-preset-radix-slate6)] rounded-xl bg-[#0a0d10] p-3">
        <p class="font-geist-500 text-[10px] text-[var(--un-preset-radix-slate10)] tracking-[0.16em] uppercase">
          Base
        </p>
        <p class="font-geist-600 mt-1 text-[14px] text-[var(--un-preset-radix-slate12)]">
          #030405 / slate12 text
        </p>
      </div>
      <div class="border border-[var(--un-preset-radix-slate6)] rounded-xl bg-[#0a0d10] p-3">
        <p class="font-geist-500 text-[10px] text-[var(--un-preset-radix-slate10)] tracking-[0.16em] uppercase">
          Accent Soft
        </p>
        <p class="font-geist-600 mt-1 text-[14px] text-[var(--un-preset-radix-mint11)]">
          mint3A / mint6A
        </p>
      </div>
      <div class="border border-[var(--un-preset-radix-slate6)] rounded-xl bg-[#0a0d10] p-3">
        <p class="font-geist-500 text-[10px] text-[var(--un-preset-radix-slate10)] tracking-[0.16em] uppercase">
          Accent Solid
        </p>
        <p class="font-geist-600 mt-1 text-[14px] text-[var(--un-preset-radix-mint11)]">
          mint9 for interaction
        </p>
      </div>
      <div class="border border-[var(--un-preset-radix-slate6)] rounded-xl bg-[#0a0d10] p-3">
        <p class="font-geist-500 text-[10px] text-[var(--un-preset-radix-slate10)] tracking-[0.16em] uppercase">
          Borders
        </p>
        <p class="font-geist-600 mt-1 text-[14px] text-[var(--un-preset-radix-slate12)]">
          slate6 + mint focus edge
        </p>
      </div>
    </div>
  </section>
</template>
