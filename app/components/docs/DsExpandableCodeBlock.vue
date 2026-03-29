<script setup lang="ts">
import type { BundledLanguage } from "shiki";
import SyntaxBlock from "~/components/workbench/code/SyntaxBlock.vue";

const props = withDefaults(
    defineProps<{
        codeThemeId?: string;
        collapsedLines?: number;
        language?: BundledLanguage;
        text: string;
        title?: string;
    }>(),
    {
        codeThemeId: "everforest",
        collapsedLines: 6,
        language: "shellscript",
        title: "Code",
    },
);

const expanded = ref(false);
const totalLines = computed(() => props.text.split("\n").length);
const isExpandable = computed(() => totalLines.value > props.collapsedLines);
const collapsedHeight = computed(() => `calc(${props.collapsedLines} * 1.6em)`);

function toggleExpanded() {
    if (!isExpandable.value) return;
    expanded.value = !expanded.value;
}
</script>

<template>
    <div
        class="group overflow-hidden rounded-xl border border-solid border-sand-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
    >
        <div
            class="relative flex items-center gap-2 border-b border-solid border-sand-5 bg-pureBlack px-4 py-2.5 color-pureWhite"
        >
            <Icon name="ph:file-code" class="size-4" />
            <span class="text-sm font-geist-500">{{ title }}</span>
        </div>

        <div class="relative bg-slate-1 px-4 py-3 text-xs leading-relaxed">
            <div
                class="overflow-hidden"
                :style="{
                    maxHeight:
                        expanded || !isExpandable ? 'none' : collapsedHeight,
                }"
            >
                <SyntaxBlock
                    class="font-geist-mono-400"
                    :text="text"
                    :language="language"
                    :code-theme-id="codeThemeId"
                    fallback-color="rgba(228,230,236,0.94)"
                />
            </div>

            <div
                v-if="isExpandable && !expanded"
                class="pointer-events-none absolute inset-x-0 bottom-0 h-18 bg-gradient-to-t from-slate-1 via-slate-1/92 to-transparent"
            />

            <div v-if="isExpandable" class="absolute bottom-3 right-3">
                <button
                    type="button"
                    class="rounded-full border border-sand-6 bg-pureBlack/80 px-3 py-1.5 text-[11px] font-geist-500 color-sand-11 transition-colors duration-180 hover:border-sand-5 hover:color-pureWhite"
                    @click="toggleExpanded"
                >
                    {{ expanded ? "Show Less" : "See Full Code" }}
                </button>
            </div>
        </div>
    </div>
</template>
