<script setup lang="ts">
import DocsSectionShell from "~/components/docs/DocsSectionShell.vue";

const surfaceLayers = [
    {
        name: "Lowest",
        hex: "#0E0E0E",
        cardClass: "border-slate-1 bg-pureBlack",
    },
    { name: "Base", hex: "#131313", cardClass: "border-sand-3 bg-[#131313]" },
    { name: "High", hex: "#2A2A2A", cardClass: "border-sand-5 bg-sand-1" },
] as const;

const elevationMetrics = [
    { label: "Signal", value: "contrast thresholds" },
    { label: "Signal", value: "semantic color distance" },
    { label: "Output", value: "recommended codeThemeId" },
] as const;

const stepScripts = {
    step01: "convert-iterm-themes.ts",
    step02: "convert-iterm-themes.ts",
    step03: "assign-fonts.ts",
    step04: "resolve-code-theme-id.ts",
    step05: "normalize-code-theme-ids.ts",
    step06: "verify-resolver.ts",
} as const;
</script>

<template>
    <DocsSectionShell
        id="theme-generation-algorithm"
        title="Theme Generation Algorithm"
    >
        <div class="relative overflow-hidden">
            <div
                class="bg-white/[0.06] pointer-events-none absolute right-[-130px] top-[-120px] h-[300px] w-[300px] rounded-full blur-3xl"
            />
            <div
                class="bg-white/[0.04] pointer-events-none absolute bottom-[-150px] left-[-140px] h-[320px] w-[320px] rounded-full blur-3xl"
            />

            <header class="relative z-10 mb-8">
                <p
                    class="max-w-3xl text-[clamp(0.98rem,1.5vw,1.34rem)] color-sand-11 leading-relaxed"
                >
                    The generator is deterministic and script-driven:
                    identical source input produces identical output JSON.
                    The flow below mirrors the real
                    <code>codex-themes</code> pipeline and not a simplified
                    mock.
                </p>
            </header>

            <div class="relative z-10 flex items-center gap-4 overflow-hidden">
                <span
                    class="font-geist-mono-500 text-[11px] color-sand-8 tracking-[0.2em] uppercase"
                >
                    Algorithm Engine // Architecture
                </span>
                <div
                    class="h-px flex-1 from-sand-7/55 to-transparent bg-gradient-to-r"
                />
            </div>

            <div
                class="relative z-10 mt-9 grid grid-cols-1 gap-4 lg:grid-cols-3"
            >
                <article
                    class="border-white/7 relative overflow-hidden border rounded-[1.7rem] bg-sand-1 p-6 transition-colors duration-200 lg:col-span-2 hover:bg-slate-3"
                >
                    <div class="relative z-10">
                        <div class="flex items-start justify-between gap-3">
                            <span
                                class="font-geist-mono-500 text-[10px] color-sand-8 tracking-[0.18em] uppercase"
                                >Step 01</span
                            >
                            <code
                                class="bg-black/70 font-geist-mono-500 max-w-[42%] inline-flex truncate rounded-xl px-3 py-1 text-[10px] color-sand-8 leading-none"
                            >
                                {{ stepScripts.step01 }}
                            </code>
                        </div>
                        <h4
                            class="font-geist-600 mt-5 text-[clamp(1.2rem,1.75vw,1.92rem)] leading-[1.12] tracking-[-0.01em] color-pureWhite"
                        >
                            Source Ingest
                        </h4>
                        <p
                            class="mt-3 max-w-[62ch] text-sm color-sand-11 leading-relaxed"
                        >
                            Read <code>.itermcolors</code> files from
                            <code>input/themes-raw</code> and convert plist
                            payloads into structured JSON.
                        </p>
                        <div class="grid mt-8 gap-3 sm:grid-cols-3">
                            <div
                                v-for="layer in surfaceLayers"
                                :key="layer.name"
                                class="border border-solid rounded-2xl p-4"
                                :class="[layer.cardClass]"
                            >
                                <p
                                    class="font-geist-mono-500 text-[9px] color-sand-8 tracking-[0.16em] uppercase"
                                >
                                    {{ layer.name }}
                                </p>
                                <p
                                    class="font-geist-mono-600 mt-2 text-sm color-pureWhite"
                                >
                                    {{ layer.hex }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Icon
                        name="ph:circle-half-fill"
                        class="pointer-events-none absolute size-50 color-pureWhite/10 -bottom-7 -right-7"
                    />
                </article>

                <article
                    class="border-white/6 flex flex-col justify-between border rounded-[1.7rem] bg-slate-2 p-6 transition-colors duration-200 hover:bg-slate-3"
                >
                    <div>
                        <div class="flex items-start justify-between gap-3">
                            <span
                                class="font-geist-mono-500 text-[10px] color-sand-8 tracking-[0.18em] uppercase"
                                >Step 02</span
                            >
                            <code
                                class="bg-black/70 font-geist-mono-500 max-w-[72%] inline-flex truncate rounded-xl px-3 py-1 text-[10px] color-sand-8 leading-none"
                            >
                                {{ stepScripts.step02 }}
                            </code>
                        </div>
                        <h4
                            class="font-geist-600 mt-5 text-[clamp(1.12rem,1.55vw,1.72rem)] leading-[1.12] tracking-[-0.01em] color-pureWhite"
                        >
                            Token Mapping
                        </h4>
                        <p
                            class="mt-6 max-w-[32ch] text-sm color-sand-11 leading-relaxed"
                        >
                            Map source channels to Codex tokens: surface, ink,
                            accent, plus semantic colors for diff and skill
                            states.
                        </p>
                    </div>
                    <div class="grid grid-cols-4 mt-7 gap-2.5">
                        <div
                            class="border-black/15 h-11 border rounded-xl bg-[#FAFAFA]"
                        />
                        <div
                            class="border-black/15 h-11 border rounded-xl bg-[#C8C8C8]"
                        />
                        <div
                            class="border-black/15 h-11 border rounded-xl bg-[#3A3A3A]"
                        />
                        <div
                            class="border-black/15 h-11 border rounded-xl bg-[#0E0E0E]"
                        />
                    </div>
                </article>
            </div>

            <div
                class="relative z-10 mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3"
            >
                <article
                    class="border-black/5 flex h-full flex-col justify-between border rounded-[1.7rem] bg-[#F2F2F2] p-5 text-[#171717]"
                >
                    <div>
                        <div class="flex items-start justify-between gap-3">
                            <span
                                class="font-geist-mono-500 text-[10px] text-[#666666] tracking-[0.18em] uppercase"
                                >Step 03</span
                            >
                            <code
                                class="bg-black/10 font-geist-mono-500 max-w-[72%] inline-flex truncate rounded-xl px-3 py-1 text-[10px] text-[#5C5C5C] leading-none"
                            >
                                {{ stepScripts.step03 }}
                            </code>
                        </div>
            <h4
              class="font-geist-600 mt-4 text-[clamp(1.2rem,1.75vw,1.92rem)] leading-[1.12] tracking-[-0.01em]"
            >
              WCAG Validation
            </h4>
                        <span
                            class="bg-pureBlack/10 font-geist-mono-700 mt-4 inline-flex rounded-full px-3 py-2 leading-none text-[10px] text-[#202020] tracking-tight uppercase"
                        >
                            PASS AAA
                        </span>
                    </div>
                    <div class="mt-6 flex items-end gap-2">
                        <span
                            class="font-geist-700 text-[3.1rem] leading-none tracking-[-0.03em]"
                            >21:1</span
                        >
                        <span
                            class="font-geist-mono-500 pb-2 text-[11px] text-[#707070] tracking-[0.16em] uppercase"
                            >Ratio</span
                        >
                    </div>
                </article>

                <article
                    class="border-white/7 flex h-full flex-col border rounded-[1.7rem] bg-sand-1 p-5 transition-colors duration-200 hover:bg-slate-3"
                >
                    <div class="flex items-start justify-between gap-3">
                        <span
                            class="font-geist-mono-500 text-[10px] color-sand-8 tracking-[0.18em] uppercase"
                            >Step 04</span
                        >
                        <code
                            class="bg-black/70 font-geist-mono-500 max-w-[72%] inline-flex truncate rounded-xl px-3 py-1 text-[10px] color-sand-8 leading-none"
                        >
                            {{ stepScripts.step04 }}
                        </code>
                    </div>
          <h4
            class="font-geist-600 mt-4 text-[clamp(1.2rem,1.75vw,1.92rem)] leading-[1.12] tracking-[-0.01em] color-pureWhite"
          >
            Theme Resolver Scoring
          </h4>
                    <div class="mt-6 space-y-4">
                        <div
                            v-for="item in elevationMetrics"
                            :key="item.label"
                            class="border-white/8 flex items-center justify-between border-b pb-2.5"
                        >
                            <span
                                class="font-geist-mono-500 text-[10px] color-sand-8 tracking-[0.14em] uppercase"
                            >
                                {{ item.label }}
                            </span>
                            <span
                                class="font-geist-mono-500 text-sm color-pureWhite"
                            >
                                {{ item.value }}
                            </span>
                        </div>
                    </div>
                </article>

                <article
                    class="border-white/7 flex h-full flex-col border rounded-[1.7rem] bg-sand-1 p-5 transition-colors duration-200 hover:bg-slate-3"
                >
                    <div class="flex items-start justify-between gap-3">
                        <span
                            class="font-geist-mono-500 text-[10px] color-sand-8 tracking-[0.18em] uppercase"
                            >Step 05</span
                        >
                        <code
                            class="bg-black/70 font-geist-mono-500 max-w-[72%] inline-flex truncate rounded-xl px-3 py-1 text-[10px] color-sand-8 leading-none"
                        >
                            {{ stepScripts.step05 }}
                        </code>
                    </div>
          <h4
            class="font-geist-600 mt-4 text-[clamp(1.2rem,1.75vw,1.92rem)] leading-[1.12] tracking-[-0.01em] color-pureWhite"
          >
            Normalization Pass
          </h4>
                    <div
                        class="border-white/10 bg-black/70 mt-5 max-h-48 overflow-auto border rounded-3xl px-4 py-4"
                    >
                        <pre
                            class="font-geist-mono-500 whitespace-pre text-[11px] color-sand-10 leading-relaxed"
                        >
{
  "target": "rescore",
  "status": "normalized",
  "field": "codeThemeId"
}</pre
                        >
                    </div>
                </article>
            </div>

            <article
                class="border-white/8 relative z-10 mt-4 flex flex-col gap-8 border rounded-[1.8rem] bg-slate-2 p-7 lg:mt-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-10 sm:p-8"
            >
                <code
                    class="bg-black/70 font-geist-mono-500 absolute right-7 top-7 inline-flex max-w-[58%] truncate rounded-xl px-3 py-1 text-[10px] color-sand-8 leading-none lg:right-10 lg:top-10"
                >
                    {{ stepScripts.step06 }}
                </code>
                <div>
                    <div class="flex items-start gap-3">
                        <span
                            class="font-geist-mono-500 text-[10px] color-sand-8 tracking-[0.18em] uppercase"
                            >Step 06</span
                        >
                    </div>
          <h4
            class="font-geist-600 mt-5 text-[clamp(1.78rem,3.5vw,2.95rem)] leading-[1.02] tracking-[-0.015em] color-pureWhite"
          >
            Smoke Validation
          </h4>
                    <p
                        class="mt-3 max-w-[44ch] text-[15px] color-sand-11 leading-relaxed"
                    >
                        Run resolver smoke tests on representative dark/light
                        payloads to verify non-empty stable recommendations.
                    </p>
                </div>
                <NuxtLink
                    to="/themes"
                    class="bg-pureWhite font-geist-600 group inline-flex items-center justify-center gap-2 border rounded-full px-4 py-4 text-[14px] text-[#1B1B1B] tracking-tight uppercase transition-transform duration-200 active:scale-[0.99] hover:scale-[1.02] lg:min-w-[16rem]"
                >
                    Explore Themes
                    <Icon
                        name="ph:arrow-right-bold"
                        class="size-5 transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                </NuxtLink>
            </article>

            <div class="border-white/10 relative z-10 mt-4 border-t pt-4">
                <p class="max-w-4xl text-[14px] color-sand-11 leading-relaxed">
                    The important behavior is intentional convergence:
                    visually different source palettes can still map to similar
                    runtime themes after readability normalization and resolver
                    scoring.
                </p>
                <p class="mt-2 max-w-4xl text-[14px] color-sand-11 leading-relaxed">
                    This keeps generated themes predictable for production usage
                    while still preserving each preset's identity.
                </p>
            </div>

        </div>
    </DocsSectionShell>
</template>
