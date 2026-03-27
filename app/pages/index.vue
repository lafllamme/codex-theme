<script setup lang="ts">
import DsHero from "@/components/DsHero.vue"

definePageMeta({
    layout: "default",
});

const route = useRoute();
const controls = useDitherControls();
const controlsOpen = ref(false);
const controlsEnabled = computed(() => route.query.controls === "1");
</script>

<template>
    <main class="p-0 sm:p-6 lg:p-8">
        <section
            class="relative mx-auto min-h-screen w-full max-w-[1600px] overflow-hidden border-0 rounded-none sm:min-h-[88vh] sm:overflow-visible sm:border sm:border-white/8 sm:rounded-[30px]"
        >
            <div class="relative z-10 min-h-screen sm:min-h-[88vh]">
                <DsHero
                    variant="typo"
                    headline="Codex Theme Studio"
                    body="Discover 500+ possible theme variations, refine your favorites, and export a final build-ready theme pack."
                    main-cta-text="Open Builder"
                    second-cta-text="Go to Docs"
                />
            </div>
        </section>

        <GithubStarsButton username="imskyleen" repo="animate-ui" />

        <button
            v-if="controlsEnabled"
            class="font-geist-500 fixed top-18 right-4 z-30 inline-flex items-center justify-center rounded-[999px] border border-white/90 !bg-white px-7 py-2.5 text-[13px] !text-black no-underline shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 hover:!bg-white/92 sm:top-20 sm:right-6 sm:px-9 sm:py-3 sm:text-[14px]"
            @click="controlsOpen = !controlsOpen"
        >
            {{ controlsOpen ? "Hide Controls" : "Show Controls" }}
        </button>

        <aside
            v-if="controlsEnabled"
            v-show="controlsOpen"
            class="fixed top-30 right-4 z-20 w-[286px] border border-white/11 rounded-2xl bg-black/68 p-3.5 backdrop-blur-xl shadow-[0_24px_50px_rgba(0,0,0,0.45)] sm:top-32 sm:right-6"
        >
            <p
                class="font-geist-500 text-[11px] text-pureWhite/75 tracking-[0.14em] uppercase"
            >
                Dither Control Center
            </p>

            <div class="mt-3 space-y-3">
                <label class="flex items-center justify-between gap-3">
                    <span class="font-geist-400 text-[12px] text-pureWhite/84"
                        >Mouse Interaction</span
                    >
                    <input
                        v-model="controls.enableMouseInteraction.value"
                        type="checkbox"
                        class="h-4.5 w-8 accent-[var(--un-preset-radix-mint10)]"
                    />
                </label>

                <label class="flex items-center justify-between gap-3">
                    <span class="font-geist-400 text-[12px] text-pureWhite/84"
                        >Disable Animation</span
                    >
                    <input
                        v-model="controls.disableAnimation.value"
                        type="checkbox"
                        class="h-4.5 w-8 accent-[var(--un-preset-radix-mint10)]"
                    />
                </label>

                <label class="block">
                    <div class="mb-1 flex items-center justify-between">
                        <span
                            class="font-geist-400 text-[12px] text-pureWhite/80"
                            >Wave Speed</span
                        >
                        <span
                            class="font-geist-mono-400 text-[12px] text-pureWhite/72"
                            >{{ controls.waveSpeed.value.toFixed(2) }}</span
                        >
                    </div>
                    <input
                        v-model.number="controls.waveSpeed.value"
                        type="range"
                        min="0.01"
                        max="0.2"
                        step="0.01"
                        class="w-full accent-[var(--un-preset-radix-mint10)]"
                    />
                </label>

                <label class="block">
                    <div class="mb-1 flex items-center justify-between">
                        <span
                            class="font-geist-400 text-[12px] text-pureWhite/80"
                            >Wave Frequency</span
                        >
                        <span
                            class="font-geist-mono-400 text-[12px] text-pureWhite/72"
                            >{{ controls.waveFrequency.value.toFixed(1) }}</span
                        >
                    </div>
                    <input
                        v-model.number="controls.waveFrequency.value"
                        type="range"
                        min="1"
                        max="8"
                        step="0.1"
                        class="w-full accent-[var(--un-preset-radix-mint10)]"
                    />
                </label>

                <label class="block">
                    <div class="mb-1 flex items-center justify-between">
                        <span
                            class="font-geist-400 text-[12px] text-pureWhite/80"
                            >Wave Amplitude</span
                        >
                        <span
                            class="font-geist-mono-400 text-[12px] text-pureWhite/72"
                            >{{ controls.waveAmplitude.value.toFixed(2) }}</span
                        >
                    </div>
                    <input
                        v-model.number="controls.waveAmplitude.value"
                        type="range"
                        min="0.1"
                        max="0.8"
                        step="0.01"
                        class="w-full accent-[var(--un-preset-radix-mint10)]"
                    />
                </label>

                <label class="block">
                    <div class="mb-1 flex items-center justify-between">
                        <span
                            class="font-geist-400 text-[12px] text-pureWhite/80"
                            >Color Count</span
                        >
                        <span
                            class="font-geist-mono-400 text-[12px] text-pureWhite/72"
                            >{{ controls.colorNum.value }}</span
                        >
                    </div>
                    <input
                        v-model.number="controls.colorNum.value"
                        type="range"
                        min="2"
                        max="16"
                        step="1"
                        class="w-full accent-[var(--un-preset-radix-mint10)]"
                    />
                </label>

                <label class="block">
                    <div class="mb-1 flex items-center justify-between">
                        <span
                            class="font-geist-400 text-[12px] text-pureWhite/80"
                            >Pixel Size</span
                        >
                        <span
                            class="font-geist-mono-400 text-[12px] text-pureWhite/72"
                            >{{ controls.pixelSize.value }}</span
                        >
                    </div>
                    <input
                        v-model.number="controls.pixelSize.value"
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        class="w-full accent-[var(--un-preset-radix-mint10)]"
                    />
                </label>

                <label class="block">
                    <div class="mb-1 flex items-center justify-between">
                        <span
                            class="font-geist-400 text-[12px] text-pureWhite/80"
                            >Mouse Radius</span
                        >
                        <span
                            class="font-geist-mono-400 text-[12px] text-pureWhite/72"
                            >{{ controls.mouseRadius.value.toFixed(1) }}</span
                        >
                    </div>
                    <input
                        v-model.number="controls.mouseRadius.value"
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        class="w-full accent-[var(--un-preset-radix-mint10)]"
                    />
                </label>

                <label class="block">
                    <div class="mb-1 flex items-center justify-between">
                        <span
                            class="font-geist-400 text-[12px] text-pureWhite/80"
                            >Wave Color R</span
                        >
                        <span
                            class="font-geist-mono-400 text-[12px] text-pureWhite/72"
                            >{{ controls.waveColorR.value.toFixed(2) }}</span
                        >
                    </div>
                    <input
                        v-model.number="controls.waveColorR.value"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        class="w-full accent-[var(--un-preset-radix-mint10)]"
                    />
                </label>

                <label class="block">
                    <div class="mb-1 flex items-center justify-between">
                        <span
                            class="font-geist-400 text-[12px] text-pureWhite/80"
                            >Wave Color G</span
                        >
                        <span
                            class="font-geist-mono-400 text-[12px] text-pureWhite/72"
                            >{{ controls.waveColorG.value.toFixed(2) }}</span
                        >
                    </div>
                    <input
                        v-model.number="controls.waveColorG.value"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        class="w-full accent-[var(--un-preset-radix-mint10)]"
                    />
                </label>

                <label class="block">
                    <div class="mb-1 flex items-center justify-between">
                        <span
                            class="font-geist-400 text-[12px] text-pureWhite/80"
                            >Wave Color B</span
                        >
                        <span
                            class="font-geist-mono-400 text-[12px] text-pureWhite/72"
                            >{{ controls.waveColorB.value.toFixed(2) }}</span
                        >
                    </div>
                    <input
                        v-model.number="controls.waveColorB.value"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        class="w-full accent-[var(--un-preset-radix-mint10)]"
                    />
                </label>
            </div>
        </aside>
    </main>
</template>
