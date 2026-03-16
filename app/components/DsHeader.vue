<template>
  <div
    class="box-border mx-auto my-0 flex h-full w-[90%] items-center justify-between rounded-[50px] border-[1px] border-solid border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] px-6 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px] md:w-[60%]"
  >
    <div class="flex items-center gap-3.5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        class="logo-puff h-7 w-7 text-white"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
      </svg>
      <p class="font-geist-600 text-[18px] text-white leading-none">
        Theme Lab
      </p>
    </div>

    <div class="hidden items-center gap-6 md:flex">
      <NuxtLink to="/" class="font-geist-600 text-[15px] text-white no-underline">
        Home
      </NuxtLink>
      <NuxtLink to="/old.view" class="font-geist-600 text-[15px] text-white no-underline">
        Docs
      </NuxtLink>
    </div>

    <div class="flex items-center text-white md:hidden">
      <Icon name="ph:list-bold" class="h-[18px] w-[18px]" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.logo-puff {
  transform-origin: 50% 50%;
  animation: logo-puff-spin 1550ms cubic-bezier(0.22, 1, 0.36, 1) both;
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
  .logo-puff {
    animation: none;
  }
}
</style>
