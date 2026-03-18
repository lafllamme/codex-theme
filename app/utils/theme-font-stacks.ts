/** Default stacks (Geist loaded via @nuxt/fonts). */
export const DEFAULT_THEME_UI_FONT = '\'Geist\', ui-sans-serif, system-ui, -apple-system, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif'
export const DEFAULT_THEME_CODE_FONT = '\'Geist Mono\', ui-monospace, \'SFMono-Regular\', Menlo, Monaco, Consolas, monospace'

const RE_BACKSLASH = /\\/g
const RE_APOSTROPHE = /'/g
const RE_MONO_STACK = /monospace|SFMono|Menlo|Consolas|ui-monospace/i

function quoteFamily(name: string) {
  const t = name.trim()
  return `'${t.replace(RE_BACKSLASH, '\\\\').replace(RE_APOSTROPHE, '\\\'')}'`
}

/**
 * Codex often stores a single family name (`Satoshi`, `Inter`) or a full stack.
 * Web fonts: Satoshi (Fontshare), Inter + Geist (@nuxt/fonts).
 */
export function resolveThemeUiFont(raw: string | null | undefined): string {
  if (!raw?.trim())
    return DEFAULT_THEME_UI_FONT
  const t = raw.trim()
  if (t.includes(','))
    return t
  return `${quoteFamily(t)}, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif`
}

/**
 * When `code` is null but `ui` is a system mono stack (matrix, nord, …), use ui for code too.
 */
export function resolveThemeCodeFont(
  code: string | null | undefined,
  ui: string | null | undefined,
): string {
  const c = code?.trim()
  if (c) {
    if (c.includes(','))
      return c
    return `${quoteFamily(c)}, 'Geist Mono', ui-monospace, Menlo, Monaco, Consolas, monospace`
  }
  const u = ui?.trim() ?? ''
  if (u && RE_MONO_STACK.test(u))
    return u
  return DEFAULT_THEME_CODE_FONT
}
