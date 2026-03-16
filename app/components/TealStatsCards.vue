<script setup lang="ts">
interface CardItem {
  id: string
  title: string
  value: string
  note: string
  icon: string
}

const cards: CardItem[] = [
  {
    id: 'velocity',
    title: 'Build Velocity',
    value: '+24%',
    note: 'Steady delivery over 7 days',
    icon: 'ph:rocket-launch',
  },
  {
    id: 'quality',
    title: 'Theme Quality',
    value: 'AA/AAA',
    note: 'Contrast and semantic checks stable',
    icon: 'ph:check-circle',
  },
  {
    id: 'tokens',
    title: 'Active Tokens',
    value: '56',
    note: 'Radix scales mapped and available',
    icon: 'ph:coins',
  },
]
</script>

<template>
  <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <article
      v-for="item in cards"
      :key="item.id"
      class="border border-[var(--un-preset-radix-slate6)] rounded-2xl bg-[#090b0d] p-5 transition-all duration-200 hover:border-[var(--un-preset-radix-mint6A)]"
    >
      <div class="mb-4 flex items-center justify-between">
        <div class="grid h-10 w-10 place-items-center border border-[var(--un-preset-radix-slate6)] rounded-xl bg-[#0e1114]">
          <Icon :name="item.icon" class="text-[18px] text-[var(--un-preset-radix-slate11)]" />
        </div>
        <span class="h-1.5 w-1.5 rounded-full bg-[var(--un-preset-radix-mint9)]" />
      </div>

      <p class="font-geist-500 m-0 text-[10px] text-[var(--un-preset-radix-slate10)] tracking-[0.16em] uppercase sm:text-[11px]">
        {{ item.title }}
      </p>
      <p class="font-geist-mono-700 mt-2 text-[38px] text-[var(--un-preset-radix-slate12)] leading-none sm:text-[44px]">
        {{ item.value }}
      </p>
      <p class="font-geist-400 mt-3 text-[13px] text-[var(--un-preset-radix-slate10)] leading-relaxed">
        {{ item.note }}
      </p>

      <div class="mt-4 h-px w-full bg-[var(--un-preset-radix-slate6)]">
        <div class="h-px w-2/5 bg-[var(--un-preset-radix-mint9)]" />
      </div>
    </article>
  </section>
</template>
