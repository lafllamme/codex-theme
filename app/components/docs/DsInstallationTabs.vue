<script setup lang="ts">
import SyntaxBlock from "~/components/workbench/code/SyntaxBlock.vue";

interface InstallTabItem {
    command: string;
    id: string;
    icon?: string;
    label: string;
}

const props = withDefaults(
    defineProps<{
        codeThemeId?: string;
        modelValue: string;
        tabs: InstallTabItem[];
    }>(),
    {
        codeThemeId: "vscode-plus",
    },
);

const emit = defineEmits<{
    (event: "copy", value: string): void;
    (event: "update:modelValue", value: string): void;
}>();

const copyState = ref<"idle" | "ok">("idle");
let copyTimer: ReturnType<typeof setTimeout> | null = null;

const activeTab = computed(
    () =>
        props.tabs.find((tab) => tab.id === props.modelValue) ?? props.tabs[0],
);
const activeCommand = computed(() => activeTab.value?.command ?? "");

function selectTab(id: string) {
    emit("update:modelValue", id);
}

async function copyCommand() {
    if (!activeCommand.value) return;

    try {
        await navigator.clipboard.writeText(activeCommand.value);
        copyState.value = "ok";
        emit("copy", activeCommand.value);
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
    <div class="group overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <div
            class="relative flex items-center gap-1.5 rounded-xl border-solid border-sand-5 border border-b-0 rounded-bl-0 rounded-br-0 bg-pureBlack px-2.5 py-2"
        >
            <button
                v-for="tab in tabs"
                :key="tab.id"
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-geist-mono-500 transition-all duration-180 ease-out"
                :class="
                    tab.id === modelValue
                        ? 'bg-sand-2 color-pureWhite shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)]'
                        : 'color-sand-9 hover:bg-sand-11/10 hover:color-sand-4 active:bg-sand-11/16'
                "
                @click="selectTab(tab.id)"
            >
                <Icon v-if="tab.icon" :name="tab.icon" class="h-3.5 w-3.5" />
                {{ tab.label }}
            </button>

            <button
                type="button"
                class="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-geist-mono-500 color-sand-9 opacity-0 transition-all duration-180 ease-out hover:bg-sand-11/12 hover:color-sand-4 group-hover:opacity-100"
                @click="copyCommand"
            >
                <Icon
                    :name="copyState === 'ok' ? 'ph:check' : 'ph:copy'"
                    class="h-3.5 w-3.5"
                />
                <span>{{ copyState === "ok" ? "Copied" : "Copy" }}</span>
            </button>
        </div>

        <div
            class="bg-slate-1 px-4 py-3 text-xs leading-relaxed border-solid border-sand-5 border rounded-xl rounded-tl-0 rounded-tr-0"
        >
            <SyntaxBlock
                class="font-geist-mono-400"
                :text="activeCommand"
                language="shellscript"
                :code-theme-id="codeThemeId"
                fallback-color="rgba(228, 230, 236, 0.94)"
            />
        </div>
    </div>
</template>
