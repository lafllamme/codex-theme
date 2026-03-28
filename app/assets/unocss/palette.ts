export function colorTokensPreflightCss() {
  return [
    ':root {',
    '  --app-bg: #050a09;',
    '  --app-ink: #edf3f2;',
    '  --app-accent: var(--un-preset-radix-mint9);',
    '}',
    'a,',
    '.dark { color-scheme: dark; }',
  ].join('\n')
}
