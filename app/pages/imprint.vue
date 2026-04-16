<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const config = useRuntimeConfig()
const githubUrl = computed(() => String(config.public.githubUrl))

useCodexPageSeo({
  title: 'Imprint',
  description:
    'Legal information and site notice for Codex Theme Studio — operator, contact, and liability.',
  keywords: ['imprint', 'legal', 'disclosure', 'contact'],
})
</script>

<template>
  <LegalPageShell
    title="Imprint"
    command-line="./imprint"
    subtitle="Legal information"
  >
    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <div
        class="mb-8 bg-pureWhite p-6 font-geist-mono-400 text-xs text-pureBlack leading-relaxed"
      >
        <p>&gt; codex_theme_studio::Project</p>
        <p class="text-pureBlack/50">
          ├─ name: "Codex Theme Studio"
        </p>
        <p class="text-pureBlack/50">
          ├─ location: "50737 Cologne, Germany"
        </p>
        <p class="text-pureBlack/50">
          └─ status: "active"
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <p class="mb-3 font-geist-700 text-xs text-pureWhite/40">
            ## PROJECT_NAME
          </p>
          <p class="mb-2 font-geist-700 text-lg">
            Codex Theme Studio
          </p>
          <p class="text-xs text-pureWhite/60">
            Open-source theme tooling for OpenAI Codex
          </p>
        </div>

        <div class="border-pureWhite/20 md:border-l-2 md:pl-6">
          <p class="mb-3 font-geist-700 text-xs text-pureWhite/40">
            ## ADDRESS
          </p>
          <p class="text-sm leading-relaxed">
            Dogan Teke<br>
            50737 Cologne<br>
            Germany
          </p>
        </div>

        <div class="border-pureWhite/20 md:border-l-2 md:pl-6">
          <p class="mb-3 font-geist-700 text-xs text-pureWhite/40">
            ## CONTACT
          </p>
          <p class="text-sm">
            <span class="text-pureWhite/40">email:</span>
            <a
              href="mailto:info@doganteke.ai"
              class="ml-1 text-pureWhite underline decoration-pureWhite/30 underline-offset-2 transition hover:opacity-50"
            >info@doganteke.ai</a>
          </p>
          <p class="mt-2 text-sm">
            <span class="text-pureWhite/40">web:</span>
            <a
              :href="githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="ml-1 text-pureWhite underline decoration-pureWhite/30 underline-offset-2 transition hover:opacity-50"
            >GitHub repository</a>
          </p>
        </div>
      </div>
    </section>

    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## RESPONSIBLE_CONTENT
      </p>
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div class="border-pureWhite/20 lg:border-r-2 lg:pr-6">
          <p class="mb-2 text-sm">
            &gt; operator()
          </p>
          <p class="mb-4 font-geist-700 text-2xl tracking-tight sm:text-3xl">
            Dogan Teke
          </p>
          <p class="text-xs text-pureWhite/60">
            Responsible for content (§ 55 Abs. 2 RStV where applicable)
          </p>
        </div>
        <div>
          <p class="mb-4 text-sm">
            &gt; liability_notice()
          </p>
          <p class="text-xs leading-relaxed text-pureWhite/80">
            Responsible for editorial content under applicable local law: Dogan
            Teke, reachable via the contact details above.
          </p>
        </div>
      </div>
    </section>

    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## REGISTRATION
      </p>
      <div class="space-y-4 font-geist-mono-400 text-sm">
        <div>
          <span class="text-pureWhite/40">entity:</span> Independent open-source
          project (no commercial register entry required for this notice)
        </div>
        <div>
          <span class="text-pureWhite/40">vat_id:</span>
          <span class="font-geist-700"> N/A</span>
        </div>
      </div>
    </section>

    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## LIABILITY_NOTICE
      </p>
      <div class="border-2 border-pureWhite/20 p-6 text-sm leading-relaxed">
        <p class="mb-4 text-pureWhite/40">
          &lt;!-- The contents of this site are provided with care. --&gt;
        </p>
        <p class="mb-4">
          Codex Theme Studio is an independent open-source project. This
          website is a small, static site about the tooling (e.g. generating
          themes for OpenAI Codex). Nothing here is a commercial service,
          professional advice, or a warranty of any kind.
        </p>
        <p class="mb-4">
          We aim to keep information reasonable and up to date, but we do
          <span class="font-geist-700 text-pureWhite">not</span> guarantee that
          everything on these pages is complete, accurate, or current. You use
          the information and any software from the project at your own risk.
        </p>
        <p class="mb-4">
          To the extent permitted by law, we are not liable for damages or
          losses arising from your use of this site, reliance on its content,
          or use of the software under the project license — including
          indirect or consequential losses.
        </p>
        <p class="text-xs text-pureWhite/60">
          External sites (for example GitHub) have their own terms and privacy
          notices; we do not control their content.
        </p>
      </div>
    </section>

    <section>
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## COPYRIGHT
      </p>
      <p class="text-sm leading-relaxed text-pureWhite/80">
        The Codex Theme Studio source code and materials we publish with the
        project are released under the
        <a
          :href="`${githubUrl}/blob/main/LICENSE`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-pureWhite underline decoration-pureWhite/30 underline-offset-2 transition hover:opacity-50"
        >MIT License</a>.
        You may use, copy, modify, merge, publish, distribute, sublicense,
        and/or sell copies of the software as permitted there; the license
        text in the repository is authoritative.
      </p>
      <p class="mt-4 text-xs text-pureWhite/60">
        Third-party components, fonts, or assets may carry their own licenses;
        see notices in the repository where applicable.
      </p>
    </section>
  </LegalPageShell>
</template>
