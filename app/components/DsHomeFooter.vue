<script setup lang="ts">
import { onMounted } from 'vue'
import { buildFooterClientLine } from '@/utils/footer-client-env'

const PLACEHOLDER_CLIENT_LINE = 'Client: — · — · SYST_LOG: stable'
const clientLine = ref(PLACEHOLDER_CLIENT_LINE)
const year = new Date().getFullYear()

onMounted(() => {
  clientLine.value = buildFooterClientLine()
})
</script>

<template>
  <footer
    class="relative z-10 mt-auto"
    aria-label="Site"
  >
    <div
      class="from-black/82 via-black/48 border-t to-transparent bg-gradient-to-t px-4 py-10 shadow-[0_-18px_50px_-8px_rgba(0,0,0,0.55),0_-6px_28px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.09)] backdrop-blur-[20px] border-pureWhite/12 sm:px-6"
    >
      <div
        class="mx-auto max-w-[1240px] flex flex-col items-stretch gap-8 md:flex-row md:items-center md:justify-between"
      >
        <div class="text-center md:text-left">
          <p class="font-geist-700 text-[13px] text-pureWhite/88">
            Codex Theme Studio
          </p>
          <p class="font-geist-400 mt-1 text-[11px] text-pureWhite/45">
            Theme packs for OpenAI Codex
          </p>
        </div>

        <nav aria-label="Footer" class="flex justify-center">
          <ul
            class="font-geist-500 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] tracking-[0.2em] uppercase text-pureWhite/50"
          >
            <li>
              <NuxtLink class="transition-colors hover:text-pureWhite" to="/">
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink class="transition-colors hover:text-pureWhite" to="/themes">
                Theme builder
              </NuxtLink>
            </li>
            <li>
              <NuxtLink class="transition-colors hover:text-pureWhite" to="/docs">
                Documentation
              </NuxtLink>
            </li>
            <li>
              <a
                class="transition-colors hover:text-pureWhite"
                href="https://github.com/lafllamme/codex-themes"
                rel="noopener noreferrer"
              >GitHub</a>
            </li>
          </ul>
        </nav>

        <div class="text-center md:text-right">
          <p class="font-geist-mono-500 text-[10px] tracking-[0.16em] uppercase text-pureWhite/40">
            © {{ year }} Codex Theme Studio
          </p>
          <p
            class="font-geist-mono-500 mt-1 text-[10px] tracking-[0.12em] normal-case text-pureWhite/35"
          >
            {{ clientLine }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
