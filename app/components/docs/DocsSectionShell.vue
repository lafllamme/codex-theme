<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string
    title: string
    contentClass?: string
  }>(),
  {
    contentClass:
      'flex flex-col gap-8 pb-20 text-base color-sand-11 font-light leading-normal max-lg:pb-14 lg:text-lg',
  },
)
</script>

<template>
  <section
    :id="props.id"
    class="[scroll-margin-top:calc(var(--hero-top-offset)+96px)] relative max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
  >
    <div
      class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pb-8 pt-16 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
    >
      <h2 class="font-geist-500 text-2xl color-pureWhite lg:text-4xl">
        {{ props.title }}
      </h2>
    </div>

    <div :class="props.contentClass">
      <slot />
    </div>
  </section>
</template>
