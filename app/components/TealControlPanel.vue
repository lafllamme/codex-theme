<template>
  <section class="panel-shell rounded-2xl p-5">
    <div class="mb-4">
      <h2 class="m-0 text-lg font-bold text-[var(--un-preset-radix-slate12)] sm:text-xl">
        Teal Controls Demo
      </h2>
      <p class="mt-1 text-sm text-[var(--un-preset-radix-slate10)]">
        Utility-class heavy section to validate UnoCSS + Radix color tokens.
      </p>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        class="teal-btn border-[var(--un-preset-radix-teal10)] bg-[var(--un-preset-radix-teal9)] text-[#041312] hover:bg-[var(--un-preset-radix-teal10)] active:scale-[0.98]"
      >
        Apply Theme
      </button>
      <button
        class="teal-btn border-[var(--un-preset-radix-teal-a6)] bg-[var(--un-preset-radix-teal-a3)] text-[var(--un-preset-radix-teal11)] hover:bg-[var(--un-preset-radix-teal-a4)]"
      >
        Copy JSON
      </button>
      <button
        class="teal-btn border-[var(--un-preset-radix-slate6)] bg-[var(--un-preset-radix-slate4)] text-[var(--un-preset-radix-slate11)] hover:bg-[var(--un-preset-radix-slate5)]"
      >
        Reset
      </button>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <span class="teal-badge border-[var(--un-preset-radix-teal-a6)] bg-[var(--un-preset-radix-teal-a4)] text-[var(--un-preset-radix-teal11)]">
        Accent Soft
      </span>
      <span class="teal-badge border-[var(--un-preset-radix-slate6)] bg-[var(--un-preset-radix-slate4)] text-[var(--un-preset-radix-slate11)]">
        Neutral
      </span>
      <span class="teal-badge border-[var(--un-preset-radix-teal10)] bg-[var(--un-preset-radix-teal9)] text-[#041312]">
        Teal 9/10
      </span>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-[var(--un-preset-radix-slate6)] bg-[var(--un-preset-radix-slate3)] p-3">
        <p class="text-xs text-[var(--un-preset-radix-slate10)] uppercase tracking-wide">
          Surface
        </p>
        <p class="mt-1 text-sm font-semibold text-[var(--un-preset-radix-slate12)]">
          slate2 / slate3
        </p>
      </div>
      <div class="rounded-xl border border-[var(--un-preset-radix-teal-a6)] bg-[var(--un-preset-radix-teal-a3)] p-3">
        <p class="text-xs text-[var(--un-preset-radix-slate11)] uppercase tracking-wide">
          Accent A
        </p>
        <p class="mt-1 text-sm font-semibold text-[var(--un-preset-radix-teal11)]">
          tealA3 / tealA6
        </p>
      </div>
      <div class="rounded-xl border border-[var(--un-preset-radix-teal10)] bg-[var(--un-preset-radix-teal9)] p-3">
        <p class="text-xs text-[#0a211e] uppercase tracking-wide">
          Accent Solid
        </p>
        <p class="mt-1 text-sm font-semibold text-[#041312]">
          teal9 / teal10
        </p>
      </div>
      <div class="rounded-xl border border-[var(--un-preset-radix-slate7)] bg-[var(--un-preset-radix-slate4)] p-3">
        <p class="text-xs text-[var(--un-preset-radix-slate10)] uppercase tracking-wide">
          Border Test
        </p>
        <p class="mt-1 text-sm font-semibold text-[var(--un-preset-radix-slate12)]">
          slate6 / slate7
        </p>
      </div>
    </div>
  </section>
</template>
