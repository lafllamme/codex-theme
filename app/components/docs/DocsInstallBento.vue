<template>
    <div
        class="docs-install-bento grid w-full grid-cols-12 auto-rows-[clamp(146px,16vw,180px)] gap-4 md:gap-3"
    >
        <NuxtLink
            to="/themes"
            class="group relative col-span-12 row-span-2 flex cursor-pointer flex-col justify-between overflow-hidden rounded-[2rem] bg-pureWhite p-8 text-pureBlack transition-transform duration-300 ease-out md:col-span-8 lg:p-10"
        >
            <span
                class="absolute right-8 top-8 z-20 h-12 w-12 overflow-hidden rounded-full border-2 border-solid border-pureBlack text-pureBlack transition-colors duration-200 group-hover:bg-pureBlack group-hover:text-pureWhite"
            >
                <span class="absolute inset-0 grid place-content-center">
                    <Icon
                        name="ph:arrow-up-right"
                        class="size-5 transform-gpu transition-all duration-200 linear group-hover:translate-x-[8px] group-hover:-translate-y-[8px] group-hover:opacity-0"
                    />
                </span>
                <span class="absolute inset-0 grid place-content-center">
                    <Icon
                        name="ph:arrow-up-right"
                        class="size-5 translate-x-[-14px] translate-y-[14px] transform-gpu opacity-0 transition-all duration-200 linear group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                    />
                </span>
            </span>

            <div
                class="pointer-events-none absolute -bottom-14 -right-12 opacity-10 transition-transform duration-700 ease-out group-hover:scale-110"
            >
                <Icon
                    name="ph:globe-simple"
                    class="h-52 w-52 animate-spin transform-gpu lg:h-64 lg:w-64"
                    style="animation-duration: 22s; animation-timing-function: linear;"
                />
            </div>

            <div class="relative z-10 space-y-2">
                <div class="flex items-center gap-2">
                    <span
                        class="h-2 w-2 animate-pulse rounded-full bg-pureBlack"
                    />
                    <span
                        class="font-geist-600 text-[11px] tracking-wider uppercase"
                        >Live Now</span
                    >
                </div>

                <h3
                    class="font-geist-800 text-5xl leading-none tracking-tighter"
                >
                    THEME
                    <br />
                    STUDIO
                </h3>
            </div>

            <div class="relative flex items-end justify-between gap-4">
                <p
                    class="max-w-[240px] text-sm font-geist-mono-400 leading-snug lg:text-[1.02rem]"
                >
                    The visual engine for codex theme generation.
                </p>
            </div>
        </NuxtLink>

        <NuxtLink
            to="https://github.com/lafllamme/codex-themes"
            external
            target="_blank"
            rel="noreferrer noopener"
            class="group relative col-span-12 row-span-1 flex flex-col justify-between rounded-[2rem] border border-sand-10/40 bg-slate-2 p-6 transition-colors duration-200 hover:bg-slate-4 md:col-span-4"
        >
            <Icon
                name="ph:arrow-up-right"
                class="absolute right-5 top-5 h-4 w-4 color-sand-11 opacity-0 transition-all duration-180 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
            />
            <div class="flex items-start">
                <Icon name="ph:terminal-bold" class="h-6 w-6 color-sand-12 transition-all duration-220 ease-out group-hover:scale-110 group-hover:color-pureWhite" />
            </div>
            <div class="flex flex-col gap-1">
                <div class="relative flex items-end pr-12">
                    <h4 class="font-geist-600 text-xl leading-none text-pureWhite">
                        CLI Tool
                    </h4>
                    <span
                        class="absolute right-0 top-1/2 -translate-y-1/2 font-geist-mono-500 text-[10px] leading-none color-sand-7 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
                    >
                        v2.4.0
                    </span>
                </div>
                <p
                    class="font-geist-mono-300 whitespace-nowrap max-w-[28ch] text-[11px] leading-snug color-sand-11 opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0.5 group-hover:opacity-100"
                >
                    For generating theme presets.
                </p>
            </div>
        </NuxtLink>

        <NuxtLink
            to="https://github.com/lafllamme/codex-themes/tree/main/output/theme-presets"
            external
            target="_blank"
            rel="noreferrer noopener"
            class="group relative col-span-6 row-span-1 flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-sand-5 bg-sand-1 p-6 transition-all duration-200 hover:border-solid md:col-span-2"
        >
            <Icon
                name="ph:arrow-up-right"
                class="absolute right-4 top-4 size-3.5 color-sand-11 opacity-0 transition-all duration-180 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
            />
            <Icon
                name="ph:pinwheel-bold"
                class="h-6 w-6 color-sand-7 transition-all duration-220 ease-out group-hover:scale-110 group-hover:text-pureWhite"
            />
            <span class="text-xs font-medium color-pureWhite">Presets</span>
        </NuxtLink>

        <NuxtLink
            to="https://github.com/mbadolato/iterm2-color-schemes"
            external
            target="_blank"
            rel="noreferrer noopener"
            class="group relative col-span-6 row-span-1 flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-sand-5 bg-sand-1 p-6 transition-all duration-200 hover:border-solid md:col-span-2"
        >
            <Icon
                name="ph:arrow-up-right"
                class="absolute right-4 top-4 size-3.5 color-sand-11 opacity-0 transition-all duration-180 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
            />
            <Icon
                name="ph:github-logo-bold"
                class="h-6 w-6 color-sand-7 transition-all duration-220 ease-out group-hover:scale-110 group-hover:text-pureWhite"
            />
            <span class="text-xs font-medium color-pureWhite">Repo</span>
        </NuxtLink>
    </div>
</template>

<style scoped>
@media (min-width: 768px) {
    .docs-install-bento {
        grid-template-rows: 180px 152px;
    }
}
</style>
