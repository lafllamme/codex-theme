<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const hasAnimatedHeader = useState<boolean>('has-animated-header', () => false)
const shouldAnimate = computed(() => !hasAnimatedHeader.value)

let finishTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (hasAnimatedHeader.value)
    return

  finishTimer = setTimeout(() => {
    hasAnimatedHeader.value = true
    finishTimer = null
  }, 2600)
})

onBeforeUnmount(() => {
  if (!finishTimer)
    return

  clearTimeout(finishTimer)
  finishTimer = null
})
</script>

<template>
  <DsGlassSurface
    class="mx-auto my-0 box-border h-[52px] max-w-[95vw] w-full flex items-center justify-between border rounded-full bg-[rgba(255,255,255,0.04)] px-3 shadow-[0_10px_26px_-12px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[24px] border-pureWhite/12 md:max-w-[640px]"
    :class="shouldAnimate ? 'header-shell-enter' : ''"
  >
    <div class="flex items-center">
      <NuxtLink
        to="/"
        class="group flex items-center gap-3.5 pl-3 no-underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="logo-puff size-[28px]"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z"
          />
        </svg>
        <p
          class="font-geist-700 text-[15.5px] leading-none tracking-tight text-pureWhite"
          :class="shouldAnimate ? 'header-item header-item-delay-1' : ''"
        >
          Theme Lab
        </p>
      </NuxtLink>
    </div>

    <div class="hidden items-center gap-1.5 pr-1.5 md:flex">
      <NuxtLink
        to="/"
        class="font-geist-600 rounded-full px-[22px] py-2 text-[14.5px] no-underline transition-colors text-pureWhite hover:bg-pureWhite/5"
        :class="shouldAnimate ? 'header-item header-item-delay-2' : ''"
      >
        Home
      </NuxtLink>
      <NuxtLink
        to="/docs"
        class="font-geist-500 rounded-full px-[22px] py-2 text-[14.5px] no-underline transition-colors text-pureWhite/65 hover:text-pureWhite hover:bg-pureWhite/5"
        :class="shouldAnimate ? 'header-item header-item-delay-3' : ''"
      >
        Docs
      </NuxtLink>
    </div>

    <div
      class="flex items-center text-pureWhite md:hidden"
      :class="shouldAnimate ? 'header-item header-item-delay-2' : ''"
    >
      <Icon
        name="ph:list-bold"
        class="h-[16px] w-[16px]"
        aria-hidden="true"
      />
    </div>
  </DsGlassSurface>
</template>

<style scoped>
.header-shell-enter {
  transform-origin: left center;
  will-change: clip-path, opacity;
  contain: paint;
  animation: header-shell-reveal 1080ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.header-item {
  opacity: 0;
  filter: blur(8px);
  transform: translate3d(10px, 0, 0);
  will-change: transform, opacity, filter;
  animation: header-item-reveal 640ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.header-item-delay-1 {
  animation-delay: 680ms;
}

.header-item-delay-2 {
  animation-delay: 820ms;
}

.header-item-delay-3 {
  animation-delay: 960ms;
}

.logo-puff {
  transform-origin: 50% 50%;
  animation: logo-puff-spin 1550ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes header-shell-reveal {
  0% {
    clip-path: inset(0 74% 0 0 round 999px);
    opacity: 0.7;
  }
  100% {
    clip-path: inset(0 0 0 0 round 999px);
    opacity: 1;
  }
}

@keyframes header-item-reveal {
  0% {
    opacity: 0;
    filter: blur(8px);
    transform: translate3d(10px, 0, 0);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes logo-puff-spin {
  0% {
    transform: rotate(0deg) scale(0.96);
    opacity: 0.9;
  }
  78% {
    transform: rotate(384deg) scale(1.02);
    opacity: 1;
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .header-shell-enter,
  .header-item {
    animation: none;
  }

  .logo-puff {
    animation: none;
  }
}

@media (max-width: 768px) {
  .header-shell-enter {
    will-change: transform, opacity;
    animation-name: header-shell-reveal-mobile;
    animation-duration: 980ms;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  }

  .header-item {
    filter: none;
    animation-name: header-item-reveal-mobile;
    animation-duration: 620ms;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  }

  .header-item-delay-1 {
    animation-delay: 560ms;
  }

  .header-item-delay-2 {
    animation-delay: 700ms;
  }

  .header-item-delay-3 {
    animation-delay: 820ms;
  }
}

@keyframes header-shell-reveal-mobile {
  0% {
    opacity: 0;
    transform: translate3d(-14px, 0, 0);
  }
  45% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes header-item-reveal-mobile {
  0% {
    opacity: 0;
    transform: translate3d(8px, 0, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
