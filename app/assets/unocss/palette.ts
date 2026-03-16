export function colorTokensPreflightCss() {
  return [
    ':root {',
    '  --app-bg: #050a09;',
    '  --app-ink: #edf3f2;',
    '  --app-accent: var(--un-preset-radix-teal9);',
    '}',
    '.dark { color-scheme: dark; }',
  ].join('\n')
}
