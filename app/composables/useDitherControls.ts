import { useState } from '#imports'

export function useDitherControls() {
  const enableMouseInteraction = useState<boolean>('dither-enable-mouse', () => true)
  const disableAnimation = useState<boolean>('dither-disable-animation', () => false)
  const waveSpeed = useState<number>('dither-wave-speed', () => 0.1)
  const waveFrequency = useState<number>('dither-wave-frequency', () => 2.5)
  const waveAmplitude = useState<number>('dither-wave-amplitude', () => 0.2)
  const colorNum = useState<number>('dither-color-num', () => 4)
  const pixelSize = useState<number>('dither-pixel-size', () => 3)
  const mouseRadius = useState<number>('dither-mouse-radius', () => 0.5)
  const waveColorR = useState<number>('dither-wave-color-r', () => 0.1)
  const waveColorG = useState<number>('dither-wave-color-g', () => 0.7)
  const waveColorB = useState<number>('dither-wave-color-b', () => 0.5)

  return {
    enableMouseInteraction,
    disableAnimation,
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    colorNum,
    pixelSize,
    mouseRadius,
    waveColorR,
    waveColorG,
    waveColorB,
  }
}
