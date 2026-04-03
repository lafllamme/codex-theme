function resolvePureTone(tone: string) {
  return tone === 'White' ? '#ffffff' : '#000000'
}

function resolvePureToneRgb(tone: string) {
  return tone === 'White' ? '255,255,255' : '0,0,0'
}

function normalizeOpacity(raw?: string) {
  if (!raw) {
    return undefined
  }

  const clamped = Math.min(100, Math.max(0, Number(raw)))
  return clamped / 100
}

export const rules = [
  [/^(?:text|color)-pure(White|Black)(?:\/(\d{1,3}))?$/, ([, tone, opacity]) => {
    const alpha = normalizeOpacity(opacity)

    if (alpha === undefined) {
      return { color: resolvePureTone(tone) }
    }

    return { color: `rgba(${resolvePureToneRgb(tone)},${String(alpha)})` }
  }],

  [/^bg-pure(White|Black)(?:\/(\d{1,3}))?$/, ([, tone, opacity]) => {
    const alpha = normalizeOpacity(opacity)

    if (alpha === undefined) {
      return { 'background-color': resolvePureTone(tone) }
    }

    return { 'background-color': `rgba(${resolvePureToneRgb(tone)},${String(alpha)})` }
  }],

  [/^border-pure(White|Black)(?:\/(\d{1,3}))?$/, ([, tone, opacity]) => {
    const alpha = normalizeOpacity(opacity)

    if (alpha === undefined) {
      return { 'border-color': resolvePureTone(tone) }
    }

    return { 'border-color': `rgba(${resolvePureToneRgb(tone)},${String(alpha)})` }
  }],
]
