/**
 * Single shared HTMLAudioElement for the theme randomize dice SFX (~6KB @ /sounds/dice.mp3).
 */
export function useDiceSfx() {
  let audio: HTMLAudioElement | null = null

  function playDiceRoll() {
    if (!import.meta.client)
      return

    if (!audio) {
      audio = new Audio('/sounds/dice.mp3')
      audio.preload = 'auto'
    }

    audio.currentTime = 0
    void audio.play().catch(() => {
      // Ignore autoplay / decode errors (e.g. missing file in dev)
    })
  }

  return { playDiceRoll }
}
