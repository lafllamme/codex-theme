<script setup lang="ts">
import DocsSectionShell from '~/components/docs/DocsSectionShell.vue'
</script>

<template>
  <DocsSectionShell id="introduction" title="Introduction">
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
  </DocsSectionShell>
</template>
