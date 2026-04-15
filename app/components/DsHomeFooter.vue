<script setup lang="ts">
import { onMounted } from 'vue'
import DsGlassSurface from '@/components/DsGlassSurface.vue'
import { buildFooterClientLine } from '@/utils/footer-client-env'

const PLACEHOLDER_CLIENT_LINE = 'Client: — · PLATFORM: —'
const clientLine = ref(PLACEHOLDER_CLIENT_LINE)
const year = new Date().getFullYear()

const social = {
  linkedin: 'https://www.linkedin.com/in/dogan-teke-781147108/',
  x: 'https://x.com/',
  github: 'https://github.com/lafllamme/codex-themes',
} as const

onMounted(() => {
  clientLine.value = buildFooterClientLine()
})
</script>

<template>
  <footer
    class="relative z-10 mt-auto"
    aria-label="Site"
  >
    <DsGlassSurface
      as="div"
      tone="soft"
      class="w-full border-x-0 border-b-0 border-t rounded-none px-4 py-6 shadow-[0_-10px_26px_-12px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[24px] border-pureWhite/12 sm:px-6"
    >
      <div
        class="mx-auto max-w-[1240px] flex flex-col items-stretch gap-6 md:flex-row md:items-center md:justify-between"
      >
        <div
          class="max-w-md flex flex-col items-center gap-4 text-center md:min-w-[260px] md:items-start md:text-left"
        >
          <p
            class="font-geist-400 text-[15px] leading-relaxed tracking-tight text-pureWhite/58 sm:text-base"
          >
            Designed and built in Cologne, Germany<br>
            <span class="text-pureWhite/48">— Powered by Codex</span>
          </p>
          <div class="flex items-center justify-center gap-5 md:justify-start">
            <a
              :href="social.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex transition-colors text-pureWhite/42 hover:text-pureWhite"
              aria-label="LinkedIn"
            >
              <Icon name="mdi:linkedin" class="size-6" />
            </a>
            <a
              :href="social.x"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex transition-colors text-pureWhite/42 hover:text-pureWhite"
              aria-label="X"
            >
              <Icon name="ph:x-logo" class="size-6" />
            </a>
          </div>
        </div>

        <div
          class="group max-w-[min(100%,28rem)] inline-flex flex-col items-center text-center md:ml-auto md:items-end md:text-right"
        >
          <p
            class="font-geist-mono-300 text-xs leading-snug tracking-[0.11em] uppercase transition-colors duration-200 text-pureWhite/44 sm:text-[13px] group-hover:text-pureWhite"
          >
            © {{ year }} Codex Theme Studio
          </p>
          <p
            class="font-geist-mono-300 mt-2 text-xs leading-snug tracking-[0.09em] uppercase transition-colors duration-200 text-pureWhite/38 sm:text-[13px] group-hover:text-pureWhite"
          >
            {{ clientLine }}
          </p>
        </div>
      </div>
    </DsGlassSurface>
  </footer>
</template>
