import antfu from '@antfu/eslint-config'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default antfu(
  {
    formatters: true,
    unocss: true,
    vue: true,
    typescript: true,
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/.nitro/**',
      '**/dist/**',
      '**/*.md',
      'docs/**',
      'scripts/**',
      'docs/themes/**',
      'package.json',
      'tsconfig.json',
      'pnpm-lock.yaml',
    ],
  },
  {
    files: ['app/**/*.{vue,js,jsx,ts,tsx,mjs,cjs,mts,cts}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      unocss: {
        configPath: 'uno.config.ts',
      },
    },
  },
)
