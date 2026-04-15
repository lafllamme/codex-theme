<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const config = useRuntimeConfig()
const githubUrl = computed(() => String(config.public.githubUrl))

useCodexPageSeo({
  title: 'Privacy policy',
  description:
    'Privacy information for Codex Theme Studio: controller, legal bases under GDPR, hosting, fonts, and your rights.',
  keywords: ['privacy', 'GDPR', 'DSGVO', 'data protection', 'Cloudflare', 'GitHub'],
})
</script>

<template>
  <LegalPageShell
    title="Privacy policy"
    command-line="./privacy-policy"
    subtitle="Information under Art. 13–14 GDPR (English)"
  >
    <p class="mb-12 text-sm leading-relaxed text-pureWhite/70">
      This page summarizes how we process personal data in connection with this
      website. It is provided in English; the legal framework is the EU
      General Data Protection Regulation (GDPR) / German Bundesdatenschutzgesetz
      (BDSG) where applicable. It does not replace individual legal advice.
    </p>

    <!-- Controller -->
    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## CONTROLLER
      </p>
      <p class="mb-4 text-sm leading-relaxed text-pureWhite/90">
        The controller responsible for this site under GDPR is:
      </p>
      <div class="border-2 border-pureWhite/20 p-6 text-sm leading-relaxed">
        <p class="font-geist-700 text-pureWhite">
          Dogan Teke
        </p>
        <p class="mt-2">
          50737 Cologne, Germany
        </p>
        <p class="mt-4">
          <span class="text-pureWhite/40">General / privacy contact:</span>
          <a
            href="mailto:info@doganteke.ai"
            class="ml-1 text-pureWhite underline decoration-pureWhite/30 underline-offset-2 transition hover:opacity-50"
          >info@doganteke.ai</a>
        </p>
        <p class="mt-2 text-xs text-pureWhite/60">
          For requests under Art. 15–22 GDPR, please email from the address
          concerned or describe your case so we can verify and respond.
        </p>
      </div>
    </section>

    <!-- Summary terminal -->
    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <div
        class="mb-8 bg-pureWhite p-6 font-geist-mono-400 text-xs text-pureBlack leading-relaxed"
      >
        <p>&gt; privacy_config::overview</p>
        <p class="text-pureBlack/50">
          ├─ on_site_marketing_tracking: false
        </p>
        <p class="text-pureBlack/50">
          ├─ hosting: "Cloudflare Pages (edge delivery)"
        </p>
        <p class="text-pureBlack/50">
          ├─ fonts: "@nuxt/fonts (bundled, same-origin — no Google requests from visitors)"
        </p>
        <p class="text-pureBlack/50">
          └─ legal_basis_primary: "Art. 6(1)(f) GDPR (website operation)"
        </p>
      </div>

      <p class="mb-4 font-geist-700 text-xs text-pureWhite/40">
        ## COOKIES_AND_SIMILAR_TECHNOLOGIES
      </p>
      <p class="mb-6 text-base leading-relaxed text-pureWhite/85">
        We do not use consent banners for marketing or analytics on this site
        because we do not deploy advertising or analytics pixels described in
        the table below. Your browser may still store
        <strong class="text-pureWhite">essential technical data</strong>
        (e.g. security-related headers, or data your browser keeps for HTTPS /
        caching). We do not operate a login area on this static site.
      </p>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <p class="mb-3 font-geist-700 text-xs text-pureWhite/40">
            &lt;not_used_here&gt;
          </p>
          <ul class="space-y-1 font-geist-mono-400 text-sm">
            <li>[ ] marketing / advertising cookies</li>
            <li>[ ] Google Analytics / Meta Pixel</li>
            <li>[ ] remarketing tags</li>
          </ul>
        </div>
        <div>
          <p class="mb-3 font-geist-700 text-xs text-pureWhite/40">
            &lt;your_rights&gt;
          </p>
          <ul class="space-y-1 font-geist-mono-400 text-sm">
            <li>[✓] Arts. 15–22 GDPR rights (see below)</li>
            <li>[✓] Art. 77 GDPR — complaint to a supervisory authority</li>
            <li>[✓] contact: info@doganteke.ai</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Processing -->
    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## PROCESSING_ACTIVITIES
      </p>
      <p class="mb-8 text-sm leading-relaxed text-pureWhite/75">
        The following activities may involve personal data (e.g. IP address as
        part of server logs). Legal bases refer to Regulation (EU) 2016/679
        (GDPR).
      </p>

      <div class="space-y-10">
        <div class="border-l-2 border-pureWhite/20 pl-6">
          <p class="mb-2 font-geist-700 text-sm">
            Website delivery &amp; hosting (Cloudflare Pages)
          </p>
          <p class="text-xs leading-relaxed text-pureWhite/80">
            <span class="text-pureWhite/50">Purpose:</span> Providing the site
            and TLS termination at the edge.<br>
            <span class="text-pureWhite/50">Categories:</span> IP address,
            timestamp, requested URL, referrer, user agent (as processed by the
            host).<br>
            <span class="text-pureWhite/50">Legal basis:</span> Art. 6(1)(f)
            GDPR (legitimate interest in secure, stable operation of the
            website).<br>
            <span class="text-pureWhite/50">Recipient:</span>
            Cloudflare, Inc. (including Cloudflare Germany GmbH for regional
            operations) as infrastructure provider — see Cloudflare’s privacy
            notice and DPA.<br>
            <span class="text-pureWhite/50">Retention:</span> according to
            Cloudflare’s log settings (often short rolling periods; see their
            documentation for the product in use).<br>
            <span class="text-pureWhite/50">Third countries:</span> Cloudflare
            may process in the U.S. and other regions; the provider relies on
            appropriate safeguards (e.g. Standard Contractual Clauses) where
            required.
          </p>
        </div>

        <div class="border-l-2 border-pureWhite/20 pl-6">
          <p class="mb-2 font-geist-700 text-sm">
            Webfonts (@nuxt/fonts — first-party delivery)
          </p>
          <p class="text-xs leading-relaxed text-pureWhite/80">
            <span class="text-pureWhite/50">Purpose:</span> Displaying
            typography using font files that are part of this deployment.<br>
            <span class="text-pureWhite/50">Visitor requests:</span> We use
            <strong class="text-pureWhite">Nuxt Fonts</strong> so typefaces are
            <strong class="text-pureWhite">bundled and served from the same host</strong>
            as the rest of the site. Visitors’ browsers do
            <strong class="text-pureWhite">not</strong> load fonts from
            Google’s servers, and we do not send font-related requests to
            Google on your device when you use this website.<br>
            <span class="text-pureWhite/50">Personal data:</span> Loading these
            files is like loading any other static asset: the usual server /
            edge log data may apply (see “Website delivery &amp; hosting”
            above). There is no separate Google-facing font connection from
            visitors.<br>
            <span class="text-pureWhite/50">Build / CI:</span> When we build the
            site, our tooling may download font files from an upstream catalog
            (the Google Fonts catalog is configured as a
            <em>source</em> in code). That step runs on our build environment
            (e.g. developer machine or CI), not in visitors’ browsers, and is
            separate from live browsing.<br>
            <span class="text-pureWhite/50">Legal basis (delivery to you):</span>
            Art. 6(1)(f) GDPR (legitimate interest in presenting the site,
            including readable typography), together with the hosting activity
            above.
          </p>
        </div>

        <div class="border-l-2 border-pureWhite/20 pl-6">
          <p class="mb-2 font-geist-700 text-sm">
            GitHub (external; only if you visit or use it)
          </p>
          <p class="text-xs leading-relaxed text-pureWhite/80">
            <span class="text-pureWhite/50">Purpose:</span> Hosting source code
            and community features when you leave this site for our repository
            or open issues/discussions.<br>
            <span class="text-pureWhite/50">Legal basis:</span> Art. 6(1)(f)
            GDPR (your voluntary use of GitHub) and, where you create content,
            GitHub’s contract with you.<br>
            <span class="text-pureWhite/50">Recipient:</span> GitHub, Inc. /
            Microsoft — processing is governed by GitHub’s privacy statement.<br>
            <span class="text-pureWhite/50">Third countries:</span> U.S. and
            other locations per GitHub; appropriate safeguards per their terms.
          </p>
        </div>

        <div class="border-l-2 border-pureWhite/20 pl-6">
          <p class="mb-2 font-geist-700 text-sm">
            Email contact
          </p>
          <p class="text-xs leading-relaxed text-pureWhite/80">
            <span class="text-pureWhite/50">Purpose:</span> Handling your
            inquiry.<br>
            <span class="text-pureWhite/50">Categories:</span> sender address,
            content, metadata.<br>
            <span class="text-pureWhite/50">Legal basis:</span> Art. 6(1)(f)
            GDPR (responding to requests) and, if contractual, Art. 6(1)(b).<br>
            <span class="text-pureWhite/50">Retention:</span> until the matter
            is resolved and statutory retention periods expire.
          </p>
        </div>
      </div>
    </section>

    <!-- Rights -->
    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## YOUR_RIGHTS
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
          contact: info@doganteke.ai
        </p>
        <p>})</p>
      </div>

      <p class="mb-6 text-sm leading-relaxed text-pureWhite/80">
        Where we process your data, you have the right to access (Art. 15),
        rectification (Art. 16), erasure (Art. 17), restriction (Art. 18),
        data portability (Art. 20), and objection (Art. 21) where the legal
        requirements are met. You may withdraw consent at any time if
        processing is based on consent (Art. 7(3)).
      </p>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div class="mb-4">
            <p class="font-geist-700 text-xs text-pureWhite/40">
              right_of_access
            </p>
            <p class="text-sm text-pureWhite/80">
              Confirmation of processing and a copy of personal data
            </p>
          </div>
          <div class="mb-4">
            <p class="font-geist-700 text-xs text-pureWhite/40">
              right_to_erasure
            </p>
            <p class="text-sm text-pureWhite/80">
              Deletion where grounds apply
            </p>
          </div>
          <div>
            <p class="font-geist-700 text-xs text-pureWhite/40">
              right_to_object
            </p>
            <p class="text-sm text-pureWhite/80">
              Object to processing based on legitimate interests (Art. 21(1))
            </p>
          </div>
        </div>
        <div>
          <div class="mb-4">
            <p class="font-geist-700 text-xs text-pureWhite/40">
              right_to_rectification
            </p>
            <p class="text-sm text-pureWhite/80">
              Correction of inaccurate data
            </p>
          </div>
          <div class="mb-4">
            <p class="font-geist-700 text-xs text-pureWhite/40">
              right_to_portability
            </p>
            <p class="text-sm text-pureWhite/80">
              Structured, machine-readable copy where applicable
            </p>
          </div>
          <div>
            <p class="font-geist-700 text-xs text-pureWhite/40">
              right_to_complain
            </p>
            <p class="text-sm text-pureWhite/80">
              Lodge a complaint with a supervisory authority (Art. 77 GDPR)
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Supervisory authority -->
    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## SUPERVISORY_AUTHORITY
      </p>
      <p class="mb-4 text-sm leading-relaxed text-pureWhite/80">
        Without prejudice to any other administrative or judicial remedy, you
        have the right to lodge a complaint with a supervisory authority,
        in particular in the Member State of your habitual residence, place of
        work, or the place of the alleged infringement (Art. 77 GDPR).
      </p>
      <p class="text-sm leading-relaxed text-pureWhite/80">
        For the controller’s location in North Rhine-Westphalia (Cologne), the
        competent authority is typically:
      </p>
      <div class="mt-4 border-2 border-pureWhite/20 p-6 text-sm leading-relaxed">
        <p class="font-geist-700">
          Landesbeauftragte für Datenschutz und Informationsfreiheit
          Nordrhein-Westfalen (LDI NRW)
        </p>
        <p class="mt-2 text-pureWhite/80">
          Postfach 20 04 44, 40102 Düsseldorf, Germany
        </p>
        <p class="mt-2">
          <a
            href="https://www.ldi.nrw.de"
            target="_blank"
            rel="noopener noreferrer"
            class="text-pureWhite underline decoration-pureWhite/30 underline-offset-2 transition hover:opacity-50"
          >www.ldi.nrw.de</a>
        </p>
      </div>
    </section>

    <!-- Third parties / no sale -->
    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## NO_SALE_OF_DATA
      </p>
      <p class="text-base leading-relaxed text-pureWhite/85">
        We do not sell personal data. Automated decision-making including
        profiling under Art. 22 GDPR does not take place on this website.
      </p>
    </section>

    <!-- Security -->
    <section class="mb-16 border-b-2 border-pureWhite/20 pb-16">
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## SECURITY
      </p>
      <div class="space-y-3 border-l-2 border-pureWhite/20 pl-6 text-sm text-pureWhite/85">
        <p>[✓] TLS (HTTPS) when delivered via the configured host</p>
        <p>[✓] Data minimization for the functions described above</p>
        <p>[✓] No behavioral ad networks operated by us on this site</p>
      </div>
    </section>

    <!-- Changes -->
    <section>
      <p class="mb-6 font-geist-700 text-xs text-pureWhite/40">
        ## CHANGES
      </p>
      <div class="space-y-3 font-geist-mono-400 text-sm">
        <div>
          <span class="text-pureWhite/40">controller:</span> Dogan Teke, 50737
          Cologne, Germany
        </div>
        <div>
          <span class="text-pureWhite/40">email:</span>
          <a
            href="mailto:info@doganteke.ai"
            class="ml-1 text-pureWhite underline decoration-pureWhite/30 underline-offset-2 transition hover:opacity-50"
          >info@doganteke.ai</a>
        </div>
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
          <span class="text-pureWhite/40">last_updated:</span> 2026-04-15
        </div>
      </div>
    </section>
  </LegalPageShell>
</template>
