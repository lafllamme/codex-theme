<script setup lang="ts">
import { AnimatePresence, Motion } from "motion-v";
import { useIntervalFn } from "@vueuse/core";

type AnimationDirection = "loop" | "vloop";

interface LogoItem {
    icon: string;
    label: string;
}

const props = withDefaults(
    defineProps<{
        animationDelay?: number;
        animationDuration?: number;
        direction?: AnimationDirection;
        logos?: LogoItem[];
        visibleCount?: number;
    }>(),
    {
        animationDelay: 1.2,
        animationDuration: 0.6,
        direction: "loop",
        visibleCount: 5,
    },
);

const fallbackLogos: LogoItem[] = [
    { icon: "ph:git-branch-light", label: "Clone" },
    { icon: "ph:file-arrow-down-light", label: "Preset" },
    { icon: "ph:terminal-window-light", label: "Install" },
    { icon: "ph:sliders-horizontal-light", label: "Tune" },
    { icon: "ph:gear-light", label: "Convert" },
    { icon: "ph:brackets-curly-light", label: "JSON" },
    { icon: "ph:rocket-launch-light", label: "Import" },
];

const logos = computed(() => (props.logos?.length ? props.logos : fallbackLogos));
const currentIndex = ref(0);
const intervalMs = computed(() => Math.max(250, props.animationDelay * 1000));

const { pause, resume } = useIntervalFn(
    () => {
        if (!logos.value.length) return;
        currentIndex.value = (currentIndex.value + 1) % logos.value.length;
    },
    intervalMs,
    {
        immediate: false,
        immediateCallback: false,
    },
);

onMounted(() => {
    if (logos.value.length) resume();
});

watch([() => logos.value.length, () => props.animationDelay], () => {
    currentIndex.value = 0;
    pause();
    if (logos.value.length) resume();
});

onBeforeUnmount(() => pause());

const visibleLogos = computed(() => {
    const source = logos.value;
    if (!source.length) return [] as Array<{ logo: LogoItem; originalIndex: number; position: number }>;

    const visible: Array<{ logo: LogoItem; originalIndex: number; position: number }> = [];
    const offset = Math.floor(props.visibleCount / 2);

    for (let i = -offset; i <= offset; i++) {
        const index = (currentIndex.value + i + source.length) % source.length;
        visible.push({
            logo: source[index],
            originalIndex: index,
            position: i,
        });
    }

    return visible;
});

function lineOpacity(position: number) {
    if (position === 0) return 1;
    if (position === -1 || position === 1) return 0.3;
    return 0;
}

function initialX() {
    return props.direction === "loop" ? 72 : -72;
}

function exitX() {
    return props.direction === "loop" ? -72 : 72;
}
</script>

<template>
    <div class="relative flex w-full items-start justify-center overflow-hidden py-4 [transform:translateZ(0)]">
        <div class="flex items-start justify-center gap-6" style="width: fit-content">
            <AnimatePresence :initial="false" mode="popLayout">
                <Motion
                    v-for="{ logo, originalIndex, position } in visibleLogos"
                    :key="originalIndex"
                    as="div"
                    layout="position"
                    class="flex min-h-[200px] w-20 shrink-0 flex-col items-center will-change-transform"
                    :initial="{
                        x: initialX(),
                        opacity: 0,
                        scale: 0.75,
                    }"
                    :animate="{
                        x: 0,
                        opacity: position === 0 ? 1 : 0.3,
                        scale: position === 0 ? 1 : 0.75,
                    }"
                    :exit="{
                        x: exitX(),
                        opacity: 0,
                        scale: 0.75,
                    }"
                    :transition="{
                        duration: animationDuration,
                        ease: [0.22, 1, 0.36, 1],
                    }"
                >
                    <Motion
                        as="div"
                        class="rounded-xl border border-sand-6 bg-sand-12/35 p-4 transition-colors hover:border-brand-500/60"
                    >
                        <div class="flex h-12 w-12 items-center justify-center">
                            <Icon :name="logo.icon" class="h-6 w-6 color-sand-2" />
                        </div>
                    </Motion>

                    <Motion
                        as="div"
                        class="mt-4 flex h-28 flex-col items-center"
                        :initial="{ opacity: 0 }"
                        :animate="{ opacity: lineOpacity(position) }"
                        :exit="{ opacity: 0 }"
                        :transition="{
                            duration: animationDuration,
                            ease: [0.22, 1, 0.36, 1],
                        }"
                    >
                        <div class="mb-4 h-16 w-[2px] bg-sand-7/75" />
                        <span
                            class="font-geist-500 text-xs tracking-wider uppercase whitespace-nowrap color-sand-8"
                        >
                            {{ logo.label }}
                        </span>
                    </Motion>
                </Motion>
            </AnimatePresence>
        </div>
    </div>
</template>
