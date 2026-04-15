<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const config = useRuntimeConfig()
const githubUrl = computed(() => String(config.public.githubUrl))

useCodexPageSeo({
  title: 'Privacy policy',
  description:
    'How Codex Theme Studio handles data: no cookies, no tracking on this static site, and your GDPR rights.',
  keywords: ['privacy', 'GDPR', 'data protection', 'cookies'],
})
</script>

<template>
  <LegalPageShell
    title="Privacy policy"
    command-line="./privacy-policy"
    subtitle="GDPR-oriented / minimal processing"
  >
    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <div
        class="mb-8 bg-pureWhite p-6 font-geist-mono-400 text-xs text-pureBlack leading-relaxed"
      >
        <p>&gt; privacy_config::cookies</p>
        <p class="text-pureBlack/50">
          ├─ cookies_stored: false
        </p>
        <p class="text-pureBlack/50">
          ├─ tracking_enabled: false
        </p>
        <p class="text-pureBlack/50">
          └─ compliance_level: "GDPR_AWARE"
        </p>
      </div>

      <p class="mb-4 font-geist-700 text-xs text-pureWhite/40">
        ## NO_COOKIES_GUARANTEE
      </p>
      <p class="mb-8 font-geist-400 text-base leading-relaxed">
        This static site does not set analytics or marketing cookies. We do not
        run third-party ad or social pixels on these pages.
      </p>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <p class="mb-3 font-geist-700 text-xs text-pureWhite/40">
            &lt;disabled_features&gt;
          </p>
          <ul class="space-y-1 font-geist-mono-400 text-sm">
            <li>[ ] marketing_cookies</li>
            <li>[ ] analytics_beacons</li>
            <li>[ ] tracking_pixels</li>
            <li>[ ] third_party_ad_networks</li>
          </ul>
          <p class="mt-4 font-geist-700 text-xs text-pureWhite/40">
            &lt;/disabled_features&gt;
          </p>
        </div>
        <div>
          <p class="mb-3 font-geist-700 text-xs text-pureWhite/40">
            &lt;your_rights&gt;
          </p>
          <ul class="space-y-1 font-geist-mono-400 text-sm">
            <li>[✓] transparency</li>
            <li>[✓] access &amp; erasure (where applicable)</li>
            <li>[✓] no profiling on this site</li>
            <li>[✓] contact via GitHub for project matters</li>
          </ul>
          <p class="mt-4 font-geist-700 text-xs text-pureWhite/40">
            &lt;/your_rights&gt;
          </p>
        </div>
      </div>
    </section>

    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## DATA_PROCESSING_POLICY
      </p>

      <div class="space-y-8">
        <div class="border-l-2 border-pureWhite/20 pl-6">
          <p class="mb-2 text-sm font-geist-700">
            function contact_via_github()
          </p>
          <p class="text-xs leading-relaxed text-pureWhite/80">
            If you open an issue or discussion on GitHub, your public profile
            and message are processed by GitHub under their terms and privacy
            policy.
          </p>
        </div>

        <div class="border-l-2 border-pureWhite/20 pl-6">
          <p class="mb-2 text-sm font-geist-700">
            function hosting_logs()
          </p>
          <p class="text-xs leading-relaxed text-pureWhite/80">
            Our host may create short-lived server logs (e.g. IP, timestamp,
            user agent) for security and operations. Retention depends on the
            provider’s defaults.
          </p>
        </div>

        <div class="border-l-2 border-pureWhite/20 pl-6">
          <p class="mb-2 text-sm font-geist-700">
            function tracking_tools()
          </p>
          <p class="text-xs leading-relaxed text-pureWhite/80">
            Returns: NONE on this site. No Google Analytics, no Facebook Pixel,
            no on-site remarketing tags.
          </p>
        </div>
      </div>
    </section>

    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## GDPR_RIGHTS
      </p>

      <div
        v-pre
        class="mb-8 bg-pureWhite p-6 font-geist-mono-400 text-xs text-pureBlack leading-relaxed"
      >
        <p>&gt; gdpr_rights.forEach((right) => {</p>
        <p class="ml-4 text-pureBlack/50">
          console.log(right.name)
        </p>
        <p class="ml-4 text-pureBlack/50">
          console.log(right.description)
        </p>
        <p class="ml-4 text-pureBlack/50">
          contact: via GitHub or your supervisory authority
        </p>
        <p>})</p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div class="mb-4">
            <p class="font-geist-700 text-xs text-pureWhite/40">
              right_of_access
            </p>
            <p class="text-sm text-pureWhite/80">
              Know what we hold (if any)
            </p>
          </div>
          <div class="mb-4">
            <p class="font-geist-700 text-xs text-pureWhite/40">
              right_to_erasure
            </p>
            <p class="text-sm text-pureWhite/80">
              Request deletion where applicable
            </p>
          </div>
          <div>
            <p class="font-geist-700 text-xs text-pureWhite/40">
              right_to_object
            </p>
            <p class="text-sm text-pureWhite/80">
              Object to certain processing
            </p>
          </div>
        </div>
        <div>
          <div class="mb-4">
            <p class="font-geist-700 text-xs text-pureWhite/40">
              right_to_rectification
            </p>
            <p class="text-sm text-pureWhite/80">
              Correct inaccuracies
            </p>
          </div>
          <div class="mb-4">
            <p class="font-geist-700 text-xs text-pureWhite/40">
              right_to_portability
            </p>
            <p class="text-sm text-pureWhite/80">
              Receive structured data you provided
            </p>
          </div>
          <div>
            <p class="font-geist-700 text-xs text-pureWhite/40">
              right_to_complain
            </p>
            <p class="text-sm text-pureWhite/80">
              Lodge a complaint with a supervisory authority
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## THIRD_PARTY_POLICY
      </p>

      <div
        class="mb-8 bg-pureWhite p-6 font-geist-mono-400 text-sm text-pureBlack leading-relaxed"
      >
        <p>&gt; third_parties.on_this_page</p>
        <p class="text-pureBlack/50">
          → fonts &amp; assets loaded per deployment; see network tab for hosts
        </p>
      </div>

      <p class="text-base leading-relaxed">
        We do not sell your personal data. External services (e.g. GitHub when
        you follow a link, or font CDNs if configured) have their own
        policies.
      </p>
    </section>

    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## SECURITY_MEASURES
      </p>

      <div class="space-y-3 border-l-2 border-pureWhite/20 pl-6 text-sm">
        <p>[✓] HTTPS for this site when served over TLS</p>
        <p>[✓] Minimal data collection by design</p>
        <p>[✓] No on-site behavioral ad tracking</p>
      </div>
    </section>

    <section>
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## CONTACT_INFORMATION
      </p>

      <div class="space-y-3 font-geist-mono-400 text-sm">
        <div>
          <span class="text-pureWhite/40">project:</span>
          <a
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="ml-1 text-pureWhite underline decoration-pureWhite/30 underline-offset-2 transition hover:opacity-50"
          >GitHub</a>
        </div>
        <div>
          <span class="text-pureWhite/40">location:</span> Cologne, Germany
        </div>
        <div>
          <span class="text-pureWhite/40">last_updated:</span> 2026-04-15
        </div>
      </div>
    </section>
  </LegalPageShell>
</template>
