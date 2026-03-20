<script setup lang="ts">
import ComposerDropdownMenu from "~/components/workbench/chat/ComposerDropdownMenu.vue";
import DsSwitch from "~/components/ui/DsSwitch.vue";

interface MenuOption {
    key: string;
    label: string;
    icon?: string;
    disabled?: boolean;
}

const props = defineProps<{
    modelOptions: string[];
    thinkingOptions: string[];
}>();

const selectedModel = defineModel<string>("selectedModel", { required: true });
const selectedThinking = defineModel<string>("selectedThinking", {
    required: true,
});
const composeValue = defineModel<string>("composeValue", { required: true });

const openMenuKey = ref<
    null | "plus" | "model" | "thinking" | "local" | "access" | "branch"
>(null);

const executionOptions: MenuOption[] = [
    { key: "local", label: "Local Project", icon: "ph:laptop" },
    { key: "cloud", label: "Cloud", icon: "ph:cloud-bold" },
];

const accessOptions: MenuOption[] = [
    {
        key: "standard",
        label: "Standard permissions",
        icon: "ph:shield-check",
    },
    { key: "full", label: "Full access", icon: "ph:shield-warning" },
];

const thinkingOptionIcons: Record<string, string> = {
    Niedrig: "ph:brain-bold",
    Mittel: "ph:brain-bold",
    Hoch: "ph:brain-bold",
    "Extra hoch": "ph:brain-bold",
    Low: "ph:brain-bold",
    Medium: "ph:brain-bold",
    High: "ph:brain-bold",
    "Very high": "ph:brain-bold",
};

const selectedExecution = ref("local");
const selectedAccess = ref("full");
const selectedBranch = ref("main");
const planningModeEnabled = ref(false);
const selectedSpeed = ref<"standard" | "fast">("standard");
const isSpeedMenuOpen = ref(false);
const branchSearch = ref("");

const normalizedThinkingOptions = computed(() => {
    const defaults = ["Low", "Medium", "High", "Very high"];
    const source = props.thinkingOptions.length ? props.thinkingOptions : defaults;
    const merged = [...source];
    for (const option of defaults) {
        if (!merged.includes(option)) merged.push(option);
    }
    return merged;
});

const branchItems = [
    {
        key: "main",
        label: "main",
        status: "Not committed: 2 files",
        added: "+5",
        removed: "-3",
    },
];

const selectedExecutionLabel = computed(
    () => {
        const selected = executionOptions.find(
            (option) => option.key === selectedExecution.value,
        );
        if (!selected || selected.key === "local") return "Local";
        return selected.label;
    },
);

const selectedAccessLabel = computed(
    () =>
        accessOptions.find((option) => option.key === selectedAccess.value)
            ?.label ?? "Full access",
);

const filteredBranches = computed(() => {
    const query = branchSearch.value.trim().toLowerCase();
    if (!query) return branchItems;
    return branchItems.filter((item) =>
        item.label.toLowerCase().includes(query),
    );
});

function toggleMenu(
    menu: "plus" | "model" | "thinking" | "local" | "access" | "branch",
) {
    openMenuKey.value = openMenuKey.value === menu ? null : menu
    if (menu !== "plus" || openMenuKey.value !== "plus")
        isSpeedMenuOpen.value = false
}

function closeMenus() {
    openMenuKey.value = null
    isSpeedMenuOpen.value = false
}

function selectModel(option: string) {
    selectedModel.value = option;
    closeMenus();
}

function selectThinking(option: string) {
    selectedThinking.value = option;
    closeMenus();
}

function selectExecution(option: string) {
    selectedExecution.value = option;
    closeMenus();
}

function selectAccess(option: string) {
    selectedAccess.value = option;
    closeMenus();
}

function selectBranch(option: string) {
    selectedBranch.value = option;
    closeMenus();
}

function toggleSpeedMenu() {
    isSpeedMenuOpen.value = !isSpeedMenuOpen.value;
}

function selectSpeed(mode: "standard" | "fast") {
    selectedSpeed.value = mode;
    isSpeedMenuOpen.value = false;
}
</script>

<template>
    <div class="flex flex-col">
        <footer
            class="border border-[color:var(--wb-border-2)] rounded-[28px] bg-[var(--wb-input-bg)] p-[6px]"
        >
            <div class="rounded-[10px] bg-transparent px-2.5 py-2.5">
                <div class="flex items-center">
                    <input
                        v-model="composeValue"
                        class="h-[40px] min-w-0 flex-1 appearance-none border-none bg-transparent px-1 text-[20px] text-[color:var(--wb-text-muted)] font-[var(--font-ui)] font-light outline-none placeholder:text-[color:var(--wb-text-faint)]"
                        type="text"
                        placeholder="Ask for follow-up changes"
                    />
                </div>

                <div
                    class="mt-4 flex items-center justify-between gap-2 text-[12px]"
                >
                    <div class="min-w-0 inline-flex items-center gap-1.5">
                        <ComposerDropdownMenu
                            :open="openMenuKey === 'plus'"
                            menu-class="w-[268px]"
                            align="left"
                            @toggle="toggleMenu('plus')"
                            @close="closeMenus"
                        >
                            <template #trigger="{ toggle }">
                                <button
                                    class="h-[24px] w-[24px] inline-flex appearance-none items-center justify-center rounded-full border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
                                    @click.stop="toggle"
                                >
                                    <Icon
                                        name="ph:plus-bold"
                                        class="h-[14px] w-[14px]"
                                    />
                                </button>
                            </template>

                            <div class="grid gap-0.5">
                                <button
                                    class="h-9 w-full flex items-center gap-2 rounded-[9px] border-none bg-transparent px-2 text-left text-[13px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                                >
                                    <Icon
                                        name="ph:paperclip-bold"
                                        class="h-[13px] w-[13px]"
                                    />
                                    Add photos and files
                                </button>

                                <div
                                    class="h-px bg-[color:var(--wb-divider)] mx-0.5 my-0.5"
                                />

                                <button
                                    class="h-9 w-full flex items-center justify-between rounded-[9px] border-none bg-transparent px-2 text-left text-[13px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                                    @click="togglePlanningMode"
                                >
                                    <span class="inline-flex items-center gap-2">
                                        <Icon
                                            name="ph:list-checks-bold"
                                            class="h-[13px] w-[13px]"
                                        />
                                        Planning mode
                                    </span>
                                    <DsSwitch
                                        :model-value="planningModeEnabled"
                                        :track-width="30"
                                        :track-height="18"
                                        :thumb-size="14"
                                        on-class="bg-[color-mix(in_srgb,var(--wb-text-primary)_74%,transparent)]"
                                        off-class="bg-[color-mix(in_srgb,var(--wb-text-secondary)_24%,transparent)]"
                                        thumb-on-class="bg-[var(--wb-bg-panel)]"
                                        thumb-off-class="bg-[var(--wb-bg-panel)]"
                                        @update:model-value="planningModeEnabled = $event"
                                    />
                                </button>

                                <div class="relative">
                                    <button
                                        class="h-9 w-full flex items-center justify-between rounded-[9px] border-none px-2 text-left text-[13px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                                        :class="isSpeedMenuOpen ? 'bg-[var(--wb-hover-bg)]' : 'bg-transparent'"
                                        @click="toggleSpeedMenu"
                                    >
                                        <span class="inline-flex items-center gap-2">
                                            <Icon
                                                name="ph:lightning-fill"
                                                class="h-[13px] w-[13px]"
                                            />
                                            Speed
                                        </span>
                                        <Icon
                                            name="ph:caret-right-bold"
                                            class="h-[10px] w-[10px]"
                                        />
                                    </button>

                                    <div
                                        v-if="isSpeedMenuOpen"
                                        class="absolute left-full top-0 z-50 ml-2 w-[330px] border border-[color:var(--wb-border-2)] rounded-[20px] bg-[var(--wb-bubble-bg)] p-2.5 shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-[16px]"
                                    >
                                        <ul class="grid m-0 list-none gap-1 p-0">
                                            <li>
                                                <button
                                                    class="w-full rounded-[10px] border-none bg-transparent px-2.5 py-2 text-left outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                                                    @click="selectSpeed('standard')"
                                                >
                                                    <div class="flex items-start justify-between gap-2">
                                                        <div class="min-w-0">
                                                            <p class="m-0 text-[17px] leading-[1.2] text-[color:var(--wb-text-primary)] font-medium">
                                                                Standard
                                                            </p>
                                                            <p class="mt-1 m-0 text-[14px] leading-[1.25] text-[color:var(--wb-text-muted)]">
                                                                Default speed with normal credit usage
                                                            </p>
                                                        </div>
                                                        <Icon
                                                            v-if="selectedSpeed === 'standard'"
                                                            name="ph:check-bold"
                                                            class="mt-[2px] h-[14px] w-[14px] shrink-0 text-[color:var(--wb-text-primary)]"
                                                        />
                                                    </div>
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    class="w-full rounded-[10px] border-none bg-transparent px-2.5 py-2 text-left outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                                                    @click="selectSpeed('fast')"
                                                >
                                                    <div class="flex items-start justify-between gap-2">
                                                        <div class="min-w-0">
                                                            <p class="m-0 text-[17px] leading-[1.2] text-[color:var(--wb-text-primary)] font-medium">
                                                                Fast
                                                            </p>
                                                            <p class="mt-1 m-0 text-[14px] leading-[1.25] text-[color:var(--wb-text-muted)]">
                                                                About 1.5x faster, with credits used at 2x
                                                            </p>
                                                        </div>
                                                        <Icon
                                                            v-if="selectedSpeed === 'fast'"
                                                            name="ph:check-bold"
                                                            class="mt-[2px] h-[14px] w-[14px] shrink-0 text-[color:var(--wb-text-primary)]"
                                                        />
                                                    </div>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </ComposerDropdownMenu>

                        <ComposerDropdownMenu
                            :open="openMenuKey === 'model'"
                            menu-class="w-max min-w-[196px] max-w-[248px]"
                            align="left"
                            @toggle="toggleMenu('model')"
                            @close="closeMenus"
                        >
                            <template #trigger="{ toggle }">
                                <button
                                    class="h-[24px] inline-flex max-w-[220px] items-center gap-1 rounded-[7px] border border-solid border-transparent bg-transparent px-2 text-[12px] text-[color:var(--wb-text-secondary)] font-[var(--font-ui)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)] focus-visible:border-[color:var(--wb-hover-border)]"
                                    @click.stop="toggle"
                                >
                                    <span class="truncate">{{
                                        selectedModel
                                    }}</span>
                                    <Icon
                                        name="ph:caret-down-bold"
                                        class="h-[10px] w-[10px] shrink-0 text-current"
                                    />
                                </button>
                            </template>

                            <p
                                class="mb-2 px-2 text-[17px] leading-[1.2] text-[color:var(--wb-text-muted)] font-normal"
                            >
                                Select model
                            </p>
                            <ul class="grid m-0 list-none gap-1 p-0">
                                <li
                                    v-for="option in modelOptions"
                                    :key="option"
                                >
                                    <button
                                        class="h-10 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 text-left text-[15px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                                        @click="selectModel(option)"
                                    >
                                        <span class="truncate">{{
                                            option
                                        }}</span>
                                        <Icon
                                            v-if="option === selectedModel"
                                            name="ph:check-bold"
                                            class="h-[13px] w-[13px] shrink-0"
                                        />
                                    </button>
                                </li>
                            </ul>
                        </ComposerDropdownMenu>

                        <ComposerDropdownMenu
                            :open="openMenuKey === 'thinking'"
                            menu-class="w-max min-w-[180px] max-w-[240px]"
                            align="left"
                            @toggle="toggleMenu('thinking')"
                            @close="closeMenus"
                        >
                            <template #trigger="{ toggle }">
                                <button
                                    class="h-[24px] inline-flex max-w-[160px] items-center gap-1 rounded-[7px] border border-transparent bg-transparent px-2 text-[12px] text-[color:var(--wb-text-secondary)] font-[var(--font-ui)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)] focus-visible:border-[color:var(--wb-hover-border)]"
                                    @click.stop="toggle"
                                >
                                    <span class="truncate">{{
                                        selectedThinking
                                    }}</span>
                                    <Icon
                                        name="ph:caret-down-bold"
                                        class="h-[10px] w-[10px] shrink-0 text-current"
                                    />
                                </button>
                            </template>

                            <p
                                class="mb-2 px-2 text-[17px] leading-[1.2] text-[color:var(--wb-text-muted)] font-normal"
                            >
                                Select reasoning
                            </p>
                            <ul class="grid m-0 list-none gap-1 p-0">
                                <li
                                    v-for="option in normalizedThinkingOptions"
                                    :key="option"
                                >
                                    <button
                                        class="h-10 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 text-left text-[15px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                                        @click="selectThinking(option)"
                                    >
                                        <span
                                            class="inline-flex items-center gap-2 truncate"
                                        >
                                            <Icon
                                                :name="
                                                    thinkingOptionIcons[
                                                        option
                                                    ] || 'ph:brain-bold'
                                                "
                                                class="h-[14px] w-[14px] shrink-0"
                                            />
                                            {{ option }}
                                        </span>
                                        <Icon
                                            v-if="option === selectedThinking"
                                            name="ph:check-bold"
                                            class="h-[14px] w-[14px] shrink-0"
                                        />
                                    </button>
                                </li>
                            </ul>
                        </ComposerDropdownMenu>
                    </div>

                    <div class="inline-flex items-center gap-2">
                        <button
                            class="h-7 w-7 inline-flex appearance-none items-center justify-center rounded-full border-none bg-transparent text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                        >
                            <Icon
                                name="ph:microphone-bold"
                                class="h-[12px] w-[12px]"
                            />
                        </button>
                        <button
                            class="h-7 w-7 inline-flex appearance-none items-center justify-center rounded-full border border-[color:var(--wb-border-2)] bg-[color-mix(in_srgb,var(--wb-text-primary)_82%,transparent)] text-[color:var(--wb-bg-panel)] transition-colors hover:bg-[color-mix(in_srgb,var(--wb-text-primary)_88%,transparent)]"
                        >
                            <Icon
                                name="ph:arrow-up"
                                class="h-[16px] w-[16px]"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </footer>

        <div
            class="mt-1 flex items-center justify-between px-1 text-[12px] text-[color:var(--wb-text-secondary)] font-[var(--font-ui)]"
        >
            <div class="inline-flex items-center gap-3">
                <ComposerDropdownMenu
                    :open="openMenuKey === 'local'"
                    menu-class="w-[203px]"
                    align="left"
                    @toggle="toggleMenu('local')"
                    @close="closeMenus"
                >
                    <template #trigger="{ toggle }">
                        <button
                            class="h-8 inline-flex items-center gap-1.5 rounded-[999px] border-none bg-transparent px-2.5 text-[color:var(--wb-text-secondary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
                            @click.stop="toggle"
                        >
                            <Icon
                                name="ph:laptop"
                                class="h-[16px] w-[16px]"
                            />
                            <span class="text-[12px]">{{
                                selectedExecutionLabel
                            }}</span>
                            <Icon
                                name="ph:caret-down-bold"
                                class="h-[10px] w-[10px]"
                            />
                        </button>
                    </template>

                    <p
                        class="mb-2 px-2 text-[17px] leading-[1.2] text-[color:var(--wb-text-muted)] font-normal"
                    >
                        Continue in
                    </p>
                    <ul class="grid m-0 list-none gap-1 p-0">
                        <li
                            v-for="option in executionOptions"
                            :key="option.key"
                        >
                            <button
                                class="h-10 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 text-left text-[15px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                                @click="selectExecution(option.key)"
                            >
                                <span class="inline-flex items-center gap-2.5">
                                    <Icon
                                        :name="option.icon || 'ph:laptop'"
                                        class="h-[16px] w-[16px]"
                                    />
                                    {{ option.label }}
                                </span>
                                <Icon
                                    v-if="option.key === selectedExecution"
                                    name="ph:check-bold"
                                    class="h-[14px] w-[14px]"
                                />
                            </button>
                        </li>
                    </ul>
                    <div
                        class="mt-1 border-t border-[color:var(--wb-divider)] pt-1"
                    >
                        <button
                            class="h-10 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 text-left text-[15px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                        >
                            <span class="inline-flex items-center gap-2.5">
                                <Icon
                                    name="ph:gauge-bold"
                                    class="h-[14px] w-[14px]"
                                />
                                Remaining rate limits
                            </span>
                            <Icon
                                name="ph:caret-right-bold"
                                class="h-[12px] w-[12px]"
                            />
                        </button>
                    </div>
                </ComposerDropdownMenu>

                <ComposerDropdownMenu
                    :open="openMenuKey === 'access'"
                    menu-class="w-[210px]"
                    align="left"
                    @toggle="toggleMenu('access')"
                    @close="closeMenus"
                >
                    <template #trigger="{ toggle }">
                        <button
                            class="h-8 inline-flex items-center gap-1.5 rounded-[999px] border-none bg-transparent px-2.5 text-[color:var(--wb-access-warn)] font-normal outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                            @click.stop="toggle"
                        >
                            <Icon
                                name="ph:shield-warning"
                                class="h-[16px] w-[16px]"
                            />
                            <span class="text-[12px] font-normal">{{
                                selectedAccessLabel
                            }}</span>
                            <Icon
                                name="ph:caret-down-bold"
                                class="h-[10px] w-[10px]"
                            />
                        </button>
                    </template>

                    <ul class="grid m-0 list-none gap-1 p-0">
                        <li v-for="option in accessOptions" :key="option.key">
                            <button
                                class="h-10 w-full flex items-center justify-between rounded-[10px] border-none bg-transparent px-2.5 text-left text-[15px] text-[color:var(--wb-text-primary)] font-normal outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                                @click="selectAccess(option.key)"
                            >
                                <span class="inline-flex items-center gap-2.5">
                                    <Icon
                                        :name="
                                            option.icon ||
                                            'ph:shield-warning'
                                        "
                                        class="h-[16px] w-[16px]"
                                    />
                                    {{ option.label }}
                                </span>
                                <Icon
                                    v-if="option.key === selectedAccess"
                                    name="ph:check-bold"
                                    class="h-[14px] w-[14px]"
                                />
                            </button>
                        </li>
                    </ul>
                </ComposerDropdownMenu>
            </div>

            <span class="inline-flex items-center gap-3">
                <ComposerDropdownMenu
                    :open="openMenuKey === 'branch'"
                    menu-class="w-[360px]"
                    align="right"
                    @toggle="toggleMenu('branch')"
                    @close="closeMenus"
                >
                    <template #trigger="{ toggle }">
                        <button
                            class="h-8 inline-flex items-center gap-1.5 rounded-[999px] border-none bg-transparent px-2.5 text-[color:var(--wb-text-secondary)] font-normal outline-none transition-colors hover:bg-[var(--wb-hover-bg)] hover:text-[color:var(--wb-text-primary)]"
                            @click.stop="toggle"
                        >
                            <Icon
                                name="ph:git-branch-bold"
                                class="h-[16px] w-[16px]"
                            />
                            <span class="text-[12px] font-normal">{{
                                selectedBranch
                            }}</span>
                            <Icon
                                name="ph:caret-down-bold"
                                class="h-[10px] w-[10px]"
                            />
                        </button>
                    </template>

                    <div
                        class="mb-2 h-10 flex items-center gap-2 rounded-[12px] border border-[color:var(--wb-border-2)] bg-[color-mix(in_srgb,var(--wb-bubble-bg)_74%,var(--wb-bg-panel)_26%)] px-3"
                    >
                        <Icon
                            name="ph:magnifying-glass-bold"
                            class="h-[12px] w-[12px] text-[color:var(--wb-text-muted)]"
                        />
                        <input
                            v-model="branchSearch"
                            class="h-full min-w-0 flex-1 border-none bg-transparent p-0 text-[14px] text-[color:var(--wb-text-primary)] outline-none placeholder:text-[color:var(--wb-text-faint)]"
                            type="text"
                            placeholder="Search branches"
                        />
                    </div>

                    <div class="flex min-h-[330px] flex-col">
                        <p
                            class="mb-2 px-2 text-[11px] text-[color:var(--wb-text-muted)] font-semibold"
                        >
                            Branches
                        </p>
                        <ul class="grid m-0 list-none gap-1 p-0">
                            <li
                                v-for="branch in filteredBranches"
                                :key="branch.key"
                            >
                                <button
                                    class="min-h-[52px] w-full flex items-start justify-between rounded-[10px] border-none bg-transparent px-2.5 py-2 text-left text-[15px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                                    @click="selectBranch(branch.key)"
                                >
                                    <span class="inline-flex min-w-0 flex-col">
                                        <span
                                            class="inline-flex items-center gap-2"
                                        >
                                            <Icon
                                                name="ph:git-branch-bold"
                                                class="h-[14px] w-[14px] shrink-0 text-[color:var(--wb-text-secondary)]"
                                            />
                                            <span class="font-medium">{{
                                                branch.label
                                            }}</span>
                                        </span>
                                        <span
                                            class="mt-1 pl-[22px] text-[12px] text-[color:var(--wb-text-muted)]"
                                        >
                                            {{ branch.status }}
                                            <span
                                                class="ml-1 text-[color:var(--wb-diff-delta-added)]"
                                                >{{ branch.added }}</span
                                            >
                                            <span
                                                class="ml-0.5 text-[color:var(--wb-diff-delta-removed)]"
                                                >{{ branch.removed }}</span
                                            >
                                        </span>
                                    </span>
                                    <Icon
                                        v-if="branch.key === selectedBranch"
                                        name="ph:check-bold"
                                        class="mt-1 h-[14px] w-[14px] shrink-0"
                                    />
                                </button>
                            </li>
                        </ul>
                        <div class="mt-auto mb-1 px-1">
                            <div class="mt-auto h-px bg-$wb-divider" />
                        </div>

                        <button
                            class="h-10 w-full flex items-center gap-2 rounded-[10px] border-none bg-transparent px-2.5 text-left text-[15px] text-[color:var(--wb-text-primary)] outline-none transition-colors hover:bg-[var(--wb-hover-bg)]"
                        >
                            <Icon
                                name="ph:plus-bold"
                                class="h-[14px] w-[14px]"
                            />
                            Create and checkout new branch...
                        </button>
                    </div>
                </ComposerDropdownMenu>

                <span
                    aria-hidden="true"
                    class="relative inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[conic-gradient(from_24deg,color-mix(in_srgb,var(--wb-text-secondary)_42%,transparent)_0deg_302deg,color-mix(in_srgb,var(--wb-text-primary)_56%,var(--wb-text-secondary)_44%)_302deg_360deg)]"
                >
                    <span
                        class="h-[11px] w-[11px] rounded-full bg-[var(--wb-bg-panel)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--wb-text-secondary)_20%,transparent)]"
                    />
                </span>
            </span>
        </div>
    </div>
</template>
