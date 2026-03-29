<template>
    <div
        class="docs-install-bento grid w-full grid-cols-12 auto-rows-[clamp(146px,16vw,180px)] gap-4 md:gap-3"
    >
        <NuxtLink
            to="/themes"
            class="group relative col-span-12 row-span-2 flex cursor-pointer flex-col justify-between overflow-hidden rounded-[2rem] bg-pureWhite p-8 text-pureBlack transition-transform duration-300 ease-out md:col-span-8 lg:p-10"
        >
            <span
                class="absolute right-6 top-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border-2 border-solid border-pureBlack transition-colors duration-200 group-hover:bg-pureBlack group-hover:text-pureWhite md:right-8 md:top-8"
            >
                <Icon
                    name="ph:arrow-up-right"
                    class="size-5 transition-transform duration-200 ease-out group-hover:translate-x-0.25 group-hover:-translate-y-0.25"
                />
            </span>

            <div
                class="pointer-events-none absolute -bottom-14 -right-12 opacity-10 transition-transform duration-700 ease-out group-hover:scale-110"
            >
                <Icon
                    name="ph:globe-simple"
                    class="h-52 w-52 lg:h-64 lg:w-64"
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
            class="col-span-12 row-span-1 flex flex-col justify-between rounded-[2rem] border border-sand-10/40 bg-slate-2 p-6 transition-colors duration-200 hover:bg-slate-4 md:col-span-4"
        >
            <div class="flex items-start justify-between">
                <Icon name="ph:terminal-bold" class="h-6 w-6 color-sand-12" />
                <span class="font-geist-mono-500 text-[10px] color-sand-7"
                    >v2.4.0</span
                >
            </div>
            <h4 class="font-geist-600 text-xl leading-none text-pureWhite">
                CLI Tool
            </h4>
        </NuxtLink>

        <NuxtLink
            to="https://github.com/lafllamme/codex-themes/tree/main/output/theme-presets"
            external
            class="group col-span-6 row-span-1 flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-sand-5 bg-sand-1 p-6 transition-all duration-200 hover:border-solid md:col-span-2"
        >
            <Icon
                name="ph:pinwheel-bold"
                class="h-6 w-6 color-sand-7 transition-colors duration-200 group-hover:text-pureWhite"
            />
            <span class="text-xs font-medium color-pureWhite">Presets</span>
        </NuxtLink>

        <a
            href="https://github.com/mbadolato/iterm2-color-schemes"
            target="_blank"
            rel="noreferrer"
            class="group col-span-6 row-span-1 flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-sand-5 bg-sand-1 p-6 transition-all duration-200 hover:border-solid md:col-span-2"
        >
            <Icon
                name="ph:github-logo-bold"
                class="h-6 w-6 color-sand-7 transition-colors duration-200 group-hover:text-pureWhite"
            />
            <span class="text-xs font-medium color-pureWhite">Repo</span>
        </a>
    </div>
</template>

<style scoped>
@media (min-width: 768px) {
    .docs-install-bento {
        grid-template-rows: 180px 152px;
    }
}
</style>
