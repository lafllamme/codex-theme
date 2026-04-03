export function fontUtilitiesPreflightCss() {
  return [
    ':root {',
    '  --font-ui: \'Geist\', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;',
    '  --font-code: \'Geist Mono\', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;',
    '}',
    'body { font-family: var(--font-ui); }',
    'code, pre { font-family: var(--font-code); }',
  ].join('\n')
}
