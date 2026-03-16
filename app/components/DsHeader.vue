<template>
  <div
    class="box-border mx-auto my-0 flex h-full w-[90%] items-center justify-between rounded-[50px] border-[1px] border-solid border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] px-6 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px] md:w-[60%]"
  >
    <div class="flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        class="h-6 w-6 text-white"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
      </svg>
      <p class="font-geist-500 text-[16px] text-white leading-none">
        Theme Lab
      </p>
    </div>

    <div class="hidden items-center gap-6 md:flex">
      <NuxtLink to="/" class="font-geist-600 text-[14px] text-white no-underline">
        Home
      </NuxtLink>
      <NuxtLink to="/old.view" class="font-geist-600 text-[14px] text-white no-underline">
        Docs
      </NuxtLink>
    </div>

    <div class="flex items-center text-white md:hidden">
      <Icon name="ph:list-bold" class="h-[18px] w-[18px]" aria-hidden="true" />
    </div>
  </div>
</template>
