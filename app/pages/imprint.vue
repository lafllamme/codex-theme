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
        <p>
          We cannot guarantee the accuracy, completeness, or timeliness of all
          content. As a service provider we are responsible for our own content
          on these pages in accordance with general law.
        </p>
      </div>
    </section>

    <section>
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## COPYRIGHT
      </p>
      <p class="text-sm leading-relaxed text-pureWhite/80">
        &lt;copyright&gt; All contents and works on this site are subject to
        applicable copyright law. Reproduction, editing, distribution, or any
        use beyond what the license permits may require written permission.
        &lt;/copyright&gt;
      </p>
    </section>
  </LegalPageShell>
</template>
