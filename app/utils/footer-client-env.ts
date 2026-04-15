const RE_CHROMIUM_BRAND = /^Chromium$/i
const RE_NOT_A_BRAND = /^Not\)?A;Brand$/i
const RE_NOT_A_BRAND_ALT = /^Not A;Brand$/i
const RE_GOOGLE_CHROME = /^Google Chrome$/i
const RE_MS_EDGE = /^Microsoft Edge$/i

const RE_UA_EDG = /\bEdg\/(\d+)/
const RE_UA_FIREFOX = /\bFirefox\/(\d+)/
const RE_UA_CHROME = /\bChrome\/(\d+)/
const RE_UA_EDG_WORD = /\bEdg\b/
const RE_UA_SAFARI_WORD = /\bSafari\b/
const RE_UA_VERSION = /\bVersion\/(\d+)/

/** Skip generic Client Hints brand entries so we show a human browser name when possible. */
function pickBrand(
  brands: readonly { brand: string, version: string }[],
): { brand: string, version: string } | null {
  if (!brands.length)
    return null
  const preferred = brands.find(
    b =>
      !RE_CHROMIUM_BRAND.test(b.brand)
      && !RE_NOT_A_BRAND.test(b.brand)
      && !RE_NOT_A_BRAND_ALT.test(b.brand),
  )
  return preferred ?? brands[0] ?? null
}

function shortenBrand(brand: string): string {
  return brand
    .replace(RE_GOOGLE_CHROME, 'Chrome')
    .replace(RE_MS_EDGE, 'Edge')
}

function formatClientLine(browser: string, version: string, platform: string): string {
  const p = platform.trim() || '—'
  if (browser === '—')
    return `Client: — · PLATFORM: ${p}`
  const v = version.trim()
  return v ? `Client: ${browser} ${v} · PLATFORM: ${p}` : `Client: ${browser} · PLATFORM: ${p}`
}

/**
 * Footer line: `Client: <browser> <version> · PLATFORM: <platform>`.
 * Uses `navigator.userAgentData` when present; otherwise a small `userAgent` parse.
 * Call only on the client (`onMounted`).
 */
export function buildFooterClientLine(): string {
  if (typeof navigator === 'undefined')
    return 'Client: — · PLATFORM: —'

  const uaData = navigator.userAgentData
  if (uaData?.brands?.length) {
    const chosen = pickBrand(uaData.brands)
    const platform = uaData.platform?.trim() || '—'
    if (chosen) {
      const name = shortenBrand(chosen.brand)
      return formatClientLine(name, chosen.version, platform)
    }
  }

  const ua = navigator.userAgent
  const platform = navigator.platform?.trim() || '—'

  const edge = ua.match(RE_UA_EDG)
  if (edge)
    return formatClientLine('Edge', edge[1] ?? '', platform)

  const fx = ua.match(RE_UA_FIREFOX)
  if (fx)
    return formatClientLine('Firefox', fx[1] ?? '', platform)

  const chrome = ua.match(RE_UA_CHROME)
  if (chrome && !RE_UA_EDG_WORD.test(ua))
    return formatClientLine('Chrome', chrome[1] ?? '', platform)

  const safariVersion = ua.match(RE_UA_VERSION)
  if (safariVersion && RE_UA_SAFARI_WORD.test(ua) && !chrome)
    return formatClientLine('Safari', safariVersion[1] ?? '', platform)

  return formatClientLine('—', '', platform)
}
