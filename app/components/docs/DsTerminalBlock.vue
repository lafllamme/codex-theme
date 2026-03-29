<script setup lang="ts">
import type { BundledLanguage } from "shiki";
import SyntaxBlock from "~/components/workbench/code/SyntaxBlock.vue";

const props = withDefaults(
    defineProps<{
        codeThemeId?: string;
        language?: BundledLanguage;
        text: string;
        title?: string;
    }>(),
    {
        codeThemeId: "matrix",
        language: "bash",
        title: "Terminal",
    },
);

const copyState = ref<"idle" | "ok">("idle");
let copyTimer: ReturnType<typeof setTimeout> | null = null;

async function copyCommand() {
    if (!props.text) return;

    try {
        await navigator.clipboard.writeText(props.text);
        copyState.value = "ok";
        if (copyTimer) clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
            copyState.value = "idle";
            copyTimer = null;
        }, 1200);
    } catch {
        // Ignore clipboard failures silently in docs context.
    }
}

onBeforeUnmount(() => {
    if (copyTimer) clearTimeout(copyTimer);
});
</script>

<template>
    <div
        class="group overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
    >
        <div class="relative flex items-center gap-2 bg-pureBlack border-sand-5 border-solid border border-b-0 px-4 py-2.5 rounded-xl rounded-bl-0 rounded-br-0">
            <Icon name="ph:terminal" class="size-4 color-pureWhite" />
            <span class="font-geist-500 text-sm color-pureWhite">{{ title }}</span>

            <button
                type="button"
                class="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-geist-mono-500 color-sand-9 opacity-0 transition-all duration-180 ease-out hover:bg-sand-11/12 hover:color-sand-4 group-hover:opacity-100"
                @click="copyCommand"
            >
                <Icon
                    :name="copyState === 'ok' ? 'ph:check' : 'ph:copy'"
                    class="h-3.5 w-3.5"
                />
                <span>{{ copyState === "ok" ? "Copied" : "Copy" }}</span>
            </button>
        </div>

        <div class="bg-slate-1 px-4 py-3 border-sand-5 border-solid border rounded-xl rounded-tl-0 rounded-tr-0  text-xs leading-relaxed">
            <SyntaxBlock
                class="font-geist-mono-400"
                :text="text"
                :language="language"
                :code-theme-id="codeThemeId"
                fallback-color="rgba(214, 241, 230, 0.92)"
            />
        </div>
    </div>
</template>
