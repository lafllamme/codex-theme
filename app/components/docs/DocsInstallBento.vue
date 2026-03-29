<template>
  <div class="grid max-w-5xl grid-cols-12 auto-rows-[168px] gap-4 lg:auto-rows-[180px]">
    <NuxtLink
      to="/themes"
      class="group relative col-span-12 row-span-2 flex cursor-pointer flex-col justify-between overflow-hidden rounded-[2rem] bg-pureWhite p-8 text-pureBlack transition-transform duration-300 ease-out hover:-translate-y-0.5 md:col-span-8 lg:p-10"
    >
      <div class="pointer-events-none absolute -bottom-14 -right-12 opacity-10 transition-transform duration-700 ease-out group-hover:scale-110">
        <Icon name="ph:globe-simple" class="h-52 w-52 lg:h-64 lg:w-64" />
      </div>

      <div class="relative z-10 space-y-4">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 animate-pulse rounded-full bg-pureBlack" />
          <span class="font-geist-mono-500 text-[11px] tracking-[0.22em] uppercase">Live Now</span>
        </div>

        <h3 class="font-geist-700 text-5xl leading-none tracking-[-0.04em] lg:text-7xl">
          WEB
          <br>
          BUILDER
        </h3>
      </div>

      <div class="relative z-10 flex items-end justify-between gap-4">
        <p class="max-w-[240px] text-sm font-medium leading-snug lg:text-[1.02rem]">
          The visual engine for modern theme generation.
        </p>
        <span class="flex h-12 w-12 items-center justify-center rounded-full border-2 border-pureBlack transition-colors duration-200 group-hover:bg-pureBlack group-hover:text-pureWhite">
          <Icon name="ph:lightning-bold" class="h-5 w-5" />
        </span>
      </div>
    </NuxtLink>

    <NuxtLink
      to="/"
      class="col-span-12 row-span-1 flex flex-col justify-between rounded-[2rem] border border-sand-9/30 bg-slate-2 p-6 transition-colors duration-200 hover:bg-mauve-4 md:col-span-4"
    >
      <div class="flex items-start justify-between">
        <Icon name="ph:terminal-bold" class="h-6 w-6 color-sand-11" />
        <span class="font-geist-mono-500 text-[10px] color-sand-7">v2.4.0</span>
      </div>
      <h4 class="font-geist-500 text-[1.7rem] leading-none text-pureWhite">
        CLI Tool
      </h4>
    </NuxtLink>

    <NuxtLink
      to="/docs"
      class="group col-span-6 row-span-1 flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-sand-9/30 bg-sand-1 p-6 transition-all duration-200 hover:border-sand-7/45 md:col-span-2"
    >
      <Icon name="ph:book-open-bold" class="h-6 w-6 color-sand-7 transition-colors duration-200 group-hover:text-pureWhite" />
      <span class="text-xs font-medium color-pureWhite">Docs</span>
    </NuxtLink>

    <a
      href="https://github.com/mbadolato/iterm2-color-schemes"
      target="_blank"
      rel="noreferrer"
      class="group col-span-6 row-span-1 flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-sand-9/30 bg-sand-1 p-6 transition-all duration-200 hover:border-sand-7/45 md:col-span-2"
    >
      <Icon name="ph:github-logo-bold" class="h-6 w-6 color-sand-7 transition-colors duration-200 group-hover:text-pureWhite" />
      <span class="text-xs font-medium color-pureWhite">Repo</span>
    </a>
  </div>
</template>
