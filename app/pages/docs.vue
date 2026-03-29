<script setup lang="ts">
import DsInstallationTabs from "~/components/docs/DsInstallationTabs.vue";
import DsExpandableCodeBlock from "~/components/docs/DsExpandableCodeBlock.vue";
import DsTerminalBlock from "~/components/docs/DsTerminalBlock.vue";

definePageMeta({
    layout: "default",
});

const schemaExample = `codex-theme-v1:{
  "codeThemeId": "rose-pine",
  "variant": "dark",
  "theme": {
    "accent": "#ea9a97",
    "surface": "#232136",
    "ink": "#e0def4",
    "contrast": 60,
    "opaqueWindows": false,
    "fonts": { "ui": null, "code": null },
    "semanticColors": {
      "diffAdded": "#9ccfd8",
      "diffRemoved": "#908caa",
      "skill": "#c4a7e7"
    }
  }
}`;

type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

const quickStartPm = ref<PackageManager>("pnpm");

const installCommandByPm: Record<PackageManager, string> = {
    npm: "npm install",
    yarn: "yarn install",
    pnpm: "pnpm install",
    bun: "bun install",
};

const runConvertByPm: Record<PackageManager, string> = {
    npm: "npm run convert",
    yarn: "yarn convert",
    pnpm: "pnpm convert",
    bun: "bun run convert",
};

const quickStartInstallTabs = computed(() => [
    {
        id: "npm",
        label: "npm",
        icon: "simple-icons:npm",
        command: installCommandByPm.npm,
    },
    {
        id: "yarn",
        label: "yarn",
        icon: "simple-icons:yarn",
        command: installCommandByPm.yarn,
    },
    {
        id: "pnpm",
        label: "pnpm",
        icon: "simple-icons:pnpm",
        command: installCommandByPm.pnpm,
    },
    {
        id: "bun",
        label: "bun",
        icon: "simple-icons:bun",
        command: installCommandByPm.bun,
    },
]);

const quickStartPipelineCommand = computed(
    () => `cd codex-themes
${runConvertByPm[quickStartPm.value]}`,
);

const quickStartCloneCommand = `git clone https://github.com/lafllamme/codex-themes`;

const quickStartInputPresetExample = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Ansi 0 Color</key>
  <dict>
    <key>Alpha Component</key>
    <real>1</real>
    <key>Blue Component</key>
    <real>0.015686275437474251</real>
    <key>Color Space</key>
    <string>sRGB</string>
    <key>Green Component</key>
    <real>0.015686275437474251</real>
    <key>Red Component</key>
    <real>0.015686275437474251</real>
  </dict>
  <key>Ansi 1 Color</key>
  <dict>
    <key>Alpha Component</key>
    <real>1</real>
    <key>Blue Component</key>
    <real>0.2010747492313385</real>
    <key>Color Space</key>
    <string>sRGB</string>
    <key>Green Component</key>
    <real>0.29108250141143799</real>
    <key>Red Component</key>
    <real>0.84613037109375</real>
  </dict>
  <key>Background Color</key>
  <dict>
    <key>Alpha Component</key>
    <real>1</real>
    <key>Blue Component</key>
    <real>0.015686275437474251</real>
    <key>Color Space</key>
    <string>sRGB</string>
    <key>Green Component</key>
    <real>0.015686275437474251</real>
    <key>Red Component</key>
    <real>0.015686275437474251</real>
  </dict>
  <key>Foreground Color</key>
  <dict>
    <key>Alpha Component</key>
    <real>1</real>
    <key>Blue Component</key>
    <real>1</real>
    <key>Color Space</key>
    <string>sRGB</string>
    <key>Green Component</key>
    <real>1</real>
    <key>Red Component</key>
    <real>0.99607843160629272</real>
  </dict>
</dict>
</plist>`;

const tocSections = [
    { id: "introduction", label: "Introduction" },
    { id: "installation", label: "Installation" },
    { id: "quick-start", label: "Quick Start" },
    { id: "codex-json-format", label: "Codex JSON Format" },
    { id: "theme-generation-algorithm", label: "Theme Generation Algorithm" },
    { id: "preset-sources", label: "Preset Sources (iTerm2 + Curated)" },
    { id: "reference", label: "Reference" },
    { id: "known-limitations", label: "Known Limitations" },
] as const;
</script>

<template>
    <main class="docs-page antialiased">
        <DocsTocSidebar :sections="tocSections" />

        <section class="docs-main relative z-10 lg:ml-72">
            <div class="mx-auto max-w-4xl px-6 pb-28 sm:px-8 lg:px-0 lg:pb-40">
                <header
                    class="pb-18 pt-[calc(var(--hero-top-offset)+44px)] lg:pb-20 lg:pt-42"
                >
                    <div class="mb-8">
                        <p
                            class="font-geist-400 mb-3 text-[clamp(2.1rem,4.4vw,4.9rem)] color-sand-10 leading-17 tracking-[-0.02em] uppercase"
                        >
                            Dive Into
                        </p>
                        <h1
                            class="color-pureWhite text-[clamp(2.6rem,6.4vw,6rem)] leading-17 tracking-tight"
                        >
                            <span class="font-geist-700">Theme</span>
                            <span
                                class="font-imbue-400 ml-2 color-[#10b981] italic"
                                >studio</span
                            >
                        </h1>
                    </div>
                    <p
                        class="color-slate-11 font-geist-300 max-w-2xl text-[clamp(1.05rem,1.4vw,1.32rem)] leading-normal"
                    >
                        A quick primer on how Codex maps a theme JSON payload to
                        interface tokens so you can shape your own theme from
                        that contract.
                    </p>
                </header>

                <section
                    id="introduction"
                    class="relative [scroll-margin-top:calc(var(--hero-top-offset)+96px)] max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
                >
                    <div
                        class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pt-16 pb-8 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
                    >
                        <h2
                            class="font-geist-500 color-pureWhite text-2xl lg:text-4xl"
                        >
                            Introduction
                        </h2>
                    </div>
                    <div
                        class="flex flex-col gap-8 pb-20 max-lg:pb-14 color-sand-11 font-light text-base lg:text-lg leading-normal"
                    >
                        <p>
                            I was genuinely excited when Codex themes launched,
                            but I kept running into the same friction: the
                            default selection felt limited, and comparing
                            options took too much back-and-forth. I wanted to
                            move faster without losing confidence in what I was
                            shipping.
                        </p>
                        <p>
                            The bigger issue was context. A theme could look
                            fine in a small preview, then feel wrong in a real
                            coding environment once spacing, contrast, and
                            especially fonts came into play. That gap between
                            preview and real usage was the main reason this
                            project exists.
                        </p>
                        <p>
                            Theme Studio is a dev-for-dev web app built to close
                            that gap. It maps theme tokens into a
                            Codex-compatible JSON payload, so you can generate,
                            tweak, and export themes quickly while keeping the
                            output predictable and reusable.
                        </p>
                        <p>
                            It also includes extra generated presets for anyone
                            who wants a strong starting point with minimal
                            setup. As Codex introduces more theming controls,
                            this project will continue to adopt those
                            capabilities and expose them here.
                        </p>
                        <p>
                            On a personal note, rebuilding a Codex-like
                            experience in the browser was genuinely fun and
                            surprisingly challenging. It made me respect even
                            more how much structure sits behind an app like
                            Codex. If this tool saves you even a few clicks, it
                            already did its job. Happy theming!
                        </p>
                    </div>
                </section>

                <section
                    id="installation"
                    class="relative [scroll-margin-top:calc(var(--hero-top-offset)+96px)] max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
                >
                    <div
                        class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pt-16 pb-8 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
                    >
                        <h2
                            class="font-geist-500 color-pureWhite text-2xl lg:text-4xl"
                        >
                            Installation
                        </h2>
                    </div>
                    <div
                        class="flex flex-col gap-8 pb-20 max-lg:pb-14 color-sand-11 font-light text-base lg:text-lg leading-normal"
                    >
                        <p>
                            Choose the path that matches your goal. Most users
                            should use the web builder directly.
                        </p>
                        <DocsInstallBento />
                        <p class="text-sm pt-1">
                            Under the hood, both paths converge on the same
                            contract: source colors are mapped into a stable
                            Codex theme payload, semantic fields are normalized,
                            and the final JSON is shaped for predictable import
                            behavior.
                        </p>
                    </div>
                </section>

                <section
                    id="quick-start"
                    class="relative [scroll-margin-top:calc(var(--hero-top-offset)+96px)] max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
                >
                    <div
                        class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pt-16 pb-8 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
                    >
                        <h2
                            class="font-geist-500 color-pureWhite text-2xl lg:text-4xl"
                        >
                            Quick Start
                        </h2>
                    </div>
                    <div
                        class="flex flex-col gap-8 pb-20 max-lg:pb-14 color-sand-11 font-light text-base lg:text-lg leading-normal"
                    >
                        <p>
                            Choose the workflow that fits your setup. Both paths
                            end in the same Codex-compatible payload, but they
                            optimize for different workflows.
                        </p>
                        <div
                            class="border-borderSubtle bg-surface/70 flex flex-col gap-8 border rounded-xl text-sm"
                        >
                            <div class="space-y-4">
                                <h4
                                    class="text-brand-400 font-geist-mono-500 text-sm tracking-[0.18em] uppercase"
                                >
                                    Path A — Web Builder (Fastest)
                                </h4>
                                <div class="flex gap-4">
                                    <span
                                        class="text-brand-400 font-geist-mono-500"
                                        >01</span
                                    >
                                    <p>
                                        Open
                                        <NuxtLink
                                            to="/themes"
                                            class="text-text-primary underline decoration-dotted underline-offset-3"
                                            >Theme Builder</NuxtLink
                                        >
                                        and pick a base preset.
                                    </p>
                                </div>
                                <div class="flex gap-4">
                                    <span
                                        class="text-brand-400 font-geist-mono-500"
                                        >02</span
                                    >
                                    <p>
                                        Shape the core tone with
                                        <code>accent</code>,
                                        <code>surface</code>, and
                                        <code>ink</code>, then adjust
                                        <code>contrast</code> and
                                        <code>semanticColors</code> for
                                        real-world readability.
                                    </p>
                                </div>
                                <div class="flex gap-4">
                                    <span
                                        class="text-brand-400 font-geist-mono-500"
                                        >03</span
                                    >
                                    <p>
                                        Export the payload and import it
                                        directly into Codex for a quick visual
                                        sanity check in your actual coding
                                        context.
                                    </p>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <h4
                                    class="text-brand-400 font-geist-mono-500 text-sm tracking-[0.18em] uppercase"
                                >
                                    Path B — Local iTerm2 Pipeline
                                </h4>
                                <p class="text-xs color-sand-10">
                                    Best when you want reproducible generation
                                    from raw terminal palettes.
                                </p>
                                <div class="space-y-6 pb-4">
                                    <h5
                                        class="text-2xl font-geist-500 color-pureWhite"
                                    >
                                        Prerequisites
                                    </h5>
                                    <ul
                                        class="list-disc space-y-1 pl-6 text-[1.02rem] leading-relaxed color-sand-10 marker:color-sand-8"
                                    >
                                        <li class="font-400">
                                            <span
                                                class="font-geist-500 color-pureWhite"
                                                >Node.js</span
                                            >
                                            -
                                            <a
                                                href="https://nodejs.org/en"
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                class="mx-1 inline-flex items-center rounded-lg border-2 border-dashed border-pureWhite/35 bg-slate-1 px-2 py-1 font-geist-mono-500 text-[0.95em] leading-none color-pureWhite transition-colors duration-200 hover:border-pureWhite/55 hover:bg-slate-2"
                                                >20.x</a
                                            >
                                            or newer (but we recommend the
                                            <a
                                                href="https://nodejs.org/en/about/previous-releases"
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                class="relative inline-block pb-0.5 leading-5 font-geist-500 !text-[#10b981] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#10b981] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100"
                                                >active LTS release</a
                                            >).
                                        </li>
                                        <li>
                                            <span
                                                class="font-geist-600 color-pureWhite"
                                                >Package manager</span
                                            >
                                            -
                                            <code>pnpm</code>
                                            (recommended), <code>npm</code>,
                                            <code>yarn</code>, or
                                            <code>bun</code>.
                                        </li>
                                        <li>
                                            <span
                                                class="font-geist-600 color-pureWhite"
                                                >iTerm Preset</span
                                            >
                                            - at least one
                                            <code>.itermcolors</code>
                                            file placed in
                                            <code>input/</code> (see
                                            <a
                                                href="https://iterm2colorschemes.com/"
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                class="relative inline-block leading-5 pb-0.5 font-geist-500 !text-[#10b981] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#10b981] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100"
                                                >iTerm2 Color Schemes</a
                                            >).
                                        </li>
                                    </ul>
                                </div>
                                <div class="space-y-[4.5rem]">
                                    <div
                                        class="grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3"
                                    >
                                        <span
                                            class="pt-0.5 text-brand-400 font-geist-mono-500"
                                            >01</span
                                        >
                                        <div class="space-y-5">
                                            <p>
                                                Clone
                                                <a
                                                    href="https://github.com/lafllamme/codex-themes"
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                    class="text-text-primary underline leading-5 decoration-dotted underline-offset-3"
                                                    >lafllamme/codex-themes</a
                                                >.
                                            </p>
                                            <DsTerminalBlock
                                                title="Terminal"
                                                :text="quickStartCloneCommand"
                                                language="shellscript"
                                                code-theme-id="everforest"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        class="grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3"
                                    >
                                        <span
                                            class="pt-0.5 text-brand-400 font-geist-mono-500"
                                            >02</span
                                        >
                                        <div class="space-y-5">
                                            <p>
                                                Add an iTerm preset file to
                                                <code>input/</code> (official
                                                iTerm2 preset or your own custom
                                                one).
                                            </p>
                                            <p class="text-sm color-sand-10">
                                                Place your preferred iTerm2
                                                color preset (or your own custom
                                                preset) in the local
                                                <code>codex-themes</code>
                                                input folder as
                                                <code>input/yourTheme.itermcolors</code
                                                >, as shown in the Adventure
                                                example below.
                                            </p>
                                            <DsExpandableCodeBlock
                                                title="input/Adventure.itermcolors"
                                                :text="quickStartInputPresetExample"
                                                language="xml"
                                                code-theme-id="everforest"
                                                :collapsed-lines="10"
                                            />
                                            <p class="pt-16 text-sm color-sand-10">
                                                Install dependencies (once) with
                                                your preferred package manager:
                                            </p>
                                            <DsInstallationTabs
                                                v-model="quickStartPm"
                                                :tabs="quickStartInstallTabs"
                                                code-theme-id="everforest"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        class="grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3"
                                    >
                                        <span
                                            class="pt-0.5 text-brand-400 font-geist-mono-500"
                                            >03</span
                                        >
                                        <div class="space-y-5">
                                            <p>
                                                Run the converter command shown
                                                below to generate
                                                Codex-compatible JSON themes in
                                                <code>output/</code>.
                                            </p>
                                            <DsTerminalBlock
                                                title="Terminal"
                                                :text="quickStartPipelineCommand"
                                                language="shellscript"
                                                code-theme-id="everforest"
                                            />
                                            <div
                                                class="rounded-xl border border-emerald-10/40 bg-emerald-11/8 px-4 py-3"
                                            >
                                                <p
                                                    class="text-[13px] leading-relaxed color-emerald-7"
                                                >
                                                    Converter output is written
                                                    to
                                                    <code>output/</code> as
                                                    Codex-compatible theme JSON
                                                    files ready for import.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="text-sm">
                            Both paths converge to the same
                            <code class="text-text-primary text-xs"
                                >codex-theme-v1</code
                            >
                            contract. For field-by-field key details, continue
                            to the next section:
                            <span class="text-text-primary"
                                >Codex JSON Format</span
                            >.
                        </p>
                        <div
                            class="rounded-xl border border-dashed border-sand-8/50 bg-sand-12/20 px-5 py-4"
                        >
                            <p class="text-sm color-sand-10">
                                <span class="font-geist-600 color-pureWhite"
                                    >Next step:</span
                                >
                                after generating or exporting your theme,
                                validate semantic balance in the real workbench,
                                then refine in small passes.
                            </p>
                        </div>
                    </div>
                </section>

                <section
                    id="codex-json-format"
                    class="relative [scroll-margin-top:calc(var(--hero-top-offset)+96px)] max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
                >
                    <div
                        class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pt-16 pb-8 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
                    >
                        <h2
                            class="font-geist-500 color-pureWhite text-2xl lg:text-4xl"
                        >
                            Codex JSON Format
                        </h2>
                    </div>
                    <div
                        class="flex flex-col gap-8 pb-20 max-lg:pb-14 color-sand-11 font-light text-base lg:text-lg leading-normal"
                    >
                        <p>
                            Payload exchange uses the
                            <code class="text-text-primary text-xs"
                                >codex-theme-v1:</code
                            >
                            prefix as parser signature. The contract is stable
                            and designed for predictable import/export.
                        </p>
                        <div class="space-y-8">
                            <div>
                                <h4
                                    class="text-brand-400 font-geist-mono-500 mb-2 text-sm tracking-[0.18em] uppercase"
                                >
                                    Top-Level Fields
                                </h4>
                                <p class="text-sm">
                                    <code>codeThemeId</code> (theme identity),
                                    <code>variant</code>
                                    (<code>dark</code>/<code>light</code>), and
                                    <code>theme</code> (all visual tokens).
                                </p>
                            </div>
                            <div>
                                <h4
                                    class="text-brand-400 font-geist-mono-500 mb-2 text-sm tracking-[0.18em] uppercase"
                                >
                                    Theme Fields
                                </h4>
                                <p class="text-sm">
                                    <code>accent</code>, <code>surface</code>,
                                    <code>ink</code>, <code>contrast</code>,
                                    <code>opaqueWindows</code>,
                                    <code>fonts</code> (<code>ui</code>,
                                    <code>code</code>), and
                                    <code>semanticColors</code>.
                                </p>
                            </div>
                        </div>
                        <div class="relative mt-8">
                            <div
                                class="bg-brand-500/5 absolute inset-0 rounded-3xl blur-2xl"
                            />
                            <pre
                                class="text-text-secondary border-borderSubtle bg-black/40 relative overflow-x-auto border rounded-2xl p-8 text-xs leading-relaxed"
                            ><code>{{ schemaExample }}</code></pre>
                        </div>
                        <div
                            class="border-borderSubtle mt-8 overflow-hidden border rounded-xl"
                        >
                            <table class="w-full text-left text-sm">
                                <thead class="bg-surface/70 text-text-primary">
                                    <tr>
                                        <th class="font-geist-500 px-4 py-3">
                                            Field
                                        </th>
                                        <th class="font-geist-500 px-4 py-3">
                                            Visual Effect
                                        </th>
                                        <th class="font-geist-500 px-4 py-3">
                                            Edit Priority
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="text-text-secondary">
                                    <tr class="border-borderSubtle/70 border-t">
                                        <td class="px-4 py-3">
                                            <code>accent</code>
                                        </td>
                                        <td class="px-4 py-3">
                                            Interactive highlights, emphasis
                                            color, visual personality.
                                        </td>
                                        <td class="px-4 py-3">First</td>
                                    </tr>
                                    <tr class="border-borderSubtle/70 border-t">
                                        <td class="px-4 py-3">
                                            <code>surface</code>
                                        </td>
                                        <td class="px-4 py-3">
                                            Background plane and overall depth
                                            impression.
                                        </td>
                                        <td class="px-4 py-3">First</td>
                                    </tr>
                                    <tr class="border-borderSubtle/70 border-t">
                                        <td class="px-4 py-3">
                                            <code>ink</code>
                                        </td>
                                        <td class="px-4 py-3">
                                            Foreground text legibility and
                                            perceived sharpness.
                                        </td>
                                        <td class="px-4 py-3">First</td>
                                    </tr>
                                    <tr class="border-borderSubtle/70 border-t">
                                        <td class="px-4 py-3">
                                            <code>contrast</code>
                                        </td>
                                        <td class="px-4 py-3">
                                            Global separation between content
                                            and background.
                                        </td>
                                        <td class="px-4 py-3">As needed</td>
                                    </tr>
                                    <tr class="border-borderSubtle/70 border-t">
                                        <td class="px-4 py-3">
                                            <code>semanticColors.*</code>
                                        </td>
                                        <td class="px-4 py-3">
                                            Status and meaning tokens (diffs,
                                            skills, contextual cues).
                                        </td>
                                        <td class="px-4 py-3">
                                            After base tones
                                        </td>
                                    </tr>
                                    <tr class="border-borderSubtle/70 border-t">
                                        <td class="px-4 py-3">
                                            <code>fonts</code>,
                                            <code>opaqueWindows</code>
                                        </td>
                                        <td class="px-4 py-3">
                                            Runtime and rendering behavior
                                            adjustments.
                                        </td>
                                        <td class="px-4 py-3">Rarely</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section
                    id="theme-generation-algorithm"
                    class="relative [scroll-margin-top:calc(var(--hero-top-offset)+96px)] max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
                >
                    <div
                        class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pt-16 pb-8 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
                    >
                        <h2
                            class="font-geist-500 color-pureWhite text-2xl lg:text-4xl"
                        >
                            Theme Generation Algorithm
                        </h2>
                    </div>
                    <div
                        class="flex flex-col gap-8 pb-20 max-lg:pb-14 color-sand-11 font-light text-base lg:text-lg leading-normal"
                    >
                        <p>
                            Generation is pipeline-based and deterministic: same
                            input palette + same settings produce the same
                            output payload.
                        </p>
                        <div
                            class="border-borderSubtle bg-surface flex flex-col gap-6 border rounded-xl p-8"
                        >
                            <div class="flex gap-4">
                                <span
                                    class="text-brand-400 font-geist-mono-500 text-sm"
                                    >01</span
                                >
                                <p class="text-sm">
                                    Parse incoming palette data (builder input
                                    or external theme source) into normalized
                                    color primitives.
                                </p>
                            </div>
                            <div class="flex gap-4">
                                <span
                                    class="text-brand-400 font-geist-mono-500 text-sm"
                                    >02</span
                                >
                                <p class="text-sm">
                                    Map and normalize semantic fields
                                    (<code>accent</code>, <code>surface</code>,
                                    <code>ink</code>, semantic colors) into the
                                    Codex payload structure.
                                </p>
                            </div>
                            <div class="flex gap-4">
                                <span
                                    class="text-brand-400 font-geist-mono-500 text-sm"
                                    >03</span
                                >
                                <p class="text-sm">
                                    Validate readability and contrast behavior
                                    across key token groups so the payload
                                    remains usable in real code contexts.
                                </p>
                            </div>
                            <div class="flex gap-4">
                                <span
                                    class="text-brand-400 font-geist-mono-500 text-sm"
                                    >04</span
                                >
                                <p class="text-sm">
                                    Infer <code>variant</code>, resolve a
                                    compatible <code>codeThemeId</code>, and
                                    finalize the Codex JSON output.
                                </p>
                            </div>
                        </div>
                        <p>
                            Practical note: two different sources can converge
                            visually after normalization because semantic
                            mapping intentionally compresses wild palette
                            variance into usable UI behavior.
                        </p>
                    </div>
                </section>

                <section
                    id="preset-sources"
                    class="relative [scroll-margin-top:calc(var(--hero-top-offset)+96px)] max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
                >
                    <div
                        class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pt-16 pb-8 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
                    >
                        <h2
                            class="font-geist-500 color-pureWhite text-2xl lg:text-4xl"
                        >
                            Preset Sources (iTerm2 + Curated)
                        </h2>
                    </div>
                    <div
                        class="flex flex-col gap-8 pb-20 max-lg:pb-14 color-sand-11 font-light text-base lg:text-lg leading-normal"
                    >
                        <p>
                            Many presets are pre-generated from iTerm2-like
                            source palettes, combined with curated in-house
                            sets. All are converted into the same Codex JSON
                            structure.
                        </p>
                        <p>
                            This is intentional: the website remains the easiest
                            creation path, while the repository/script path
                            exists for reproducibility, local generation, and
                            future automation workflows.
                        </p>
                    </div>
                </section>

                <section
                    id="reference"
                    class="relative [scroll-margin-top:calc(var(--hero-top-offset)+96px)] max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
                >
                    <div
                        class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pt-16 pb-8 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
                    >
                        <h2
                            class="font-geist-500 color-pureWhite text-2xl lg:text-4xl"
                        >
                            Reference
                        </h2>
                    </div>
                    <div
                        class="flex flex-col gap-8 pb-20 max-lg:pb-14 color-sand-11 font-light text-base lg:text-lg leading-normal"
                    >
                        <ul class="text-sm space-y-3">
                            <li>Repository (coming soon)</li>
                            <li>Script documentation (coming soon)</li>
                            <li>
                                Codex schema/version reference (coming soon)
                            </li>
                        </ul>
                    </div>
                </section>

                <section
                    id="known-limitations"
                    class="relative [scroll-margin-top:calc(var(--hero-top-offset)+96px)] max-lg:[scroll-margin-top:calc(var(--hero-top-offset)+112px)]"
                >
                    <div
                        class="sticky top-[calc(var(--hero-top-offset)+12px)] z-20 bg-[linear-gradient(to_bottom,#030507_80%,transparent)] pt-16 pb-8 max-lg:top-[calc(var(--hero-top-offset)+8px)] max-lg:pt-9"
                    >
                        <h2
                            class="font-geist-500 color-pureWhite text-2xl lg:text-4xl"
                        >
                            Known Limitations
                        </h2>
                    </div>
                    <div
                        class="flex flex-col gap-8 pb-40 color-sand-11 font-light text-base lg:text-lg leading-normal"
                    >
                        <p>
                            Some syntax and semantic behavior remains
                            constrained by upstream Codex mappings, so not every
                            color token can be fully overridden in every editor
                            context.
                        </p>
                        <a
                            href="https://github.com/openai/codex/issues/14766"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="group relative w-fit leading-5 inline-flex items-center self-start gap-2 pb-0.5 text-sm font-geist-500 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#10b981] !text-[#10b981] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100"
                        >
                            View GitHub Discussion
                            <Icon
                                name="ph:arrow-up-right"
                                class="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                    </div>
                </section>
            </div>
        </section>
    </main>
</template>

<style scoped>
.docs-page {
    background-color: #030507;
    color: #f8fafc;
}
</style>
