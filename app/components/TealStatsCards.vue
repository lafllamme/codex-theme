<script setup lang="ts">
type CardItem = {
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
    note: 'Compared to last week',
    icon: 'ph:rocket-launch',
  },
  {
    id: 'quality',
    title: 'Theme Quality',
    value: 'AA/AAA',
    note: 'Contrast checks passing',
    icon: 'ph:check-circle',
  },
  {
    id: 'tokens',
    title: 'Active Tokens',
    value: '56',
    note: 'Teal colorway configured',
    icon: 'ph:coins',
  },
]
</script>

<template>
  <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <article
      v-for="item in cards"
      :key="item.id"
      class="panel-shell rounded-2xl p-4 shadow-sm transition-transform duration-200 ease-out hover:-translate-y-0.5"
    >
      <div class="mb-3 h-10 w-10 grid place-items-center rounded-xl border border-[var(--un-preset-radix-teal-a6)] bg-[var(--un-preset-radix-teal-a4)]">
        <Icon :name="item.icon" class="text-[18px] text-[var(--un-preset-radix-teal11)]" />
      </div>

      <p class="m-0 text-xs font-medium tracking-wide text-[var(--un-preset-radix-slate11)] uppercase">
        {{ item.title }}
      </p>
      <p class="mt-2 text-3xl leading-none font-bold text-[var(--un-preset-radix-teal11)] sm:text-4xl">
        {{ item.value }}
      </p>
      <p class="mt-2 text-xs leading-relaxed text-[var(--un-preset-radix-slate10)]">
        {{ item.note }}
      </p>

      <div class="mt-4 h-1 w-full rounded-full bg-[var(--un-preset-radix-slate5)]">
        <div class="h-full w-3/5 rounded-full bg-[var(--un-preset-radix-teal9)]" />
      </div>
    </article>
  </section>
</template>
