import Lenis from 'lenis'

const WRAPPER_SELECTOR = '[data-app-scroll-container]'
const INIT_RETRY_MS = 120
const MAX_INIT_ATTEMPTS = 24

function getScrollElements() {
  const wrapper = document.querySelector<HTMLElement>(WRAPPER_SELECTOR)
  const content = wrapper?.firstElementChild as HTMLElement | null

  return {
    wrapper,
    content: content ?? undefined,
  }
}

function createLenis(wrapper: HTMLElement, content?: HTMLElement) {
  return new Lenis({
    wrapper,
    content,
    autoRaf: true,
    smoothWheel: true,
    duration: 1.05,
    wheelMultiplier: 0.92,
    touchMultiplier: 1,
    stopInertiaOnNavigate: true,
  })
}

export default defineNuxtPlugin((nuxtApp) => {
  let lenis: Lenis | null = null
  let initAttempts = 0

  const destroyLenis = () => {
    lenis?.destroy()
    lenis = null
  }

  const initLenis = () => {
    const { wrapper, content } = getScrollElements()
    if (!wrapper)
      return false

    destroyLenis()
    lenis = createLenis(wrapper, content)

    return true
  }

  const initWithRetry = () => {
    if (initLenis()) {
      initAttempts = 0
      return
    }

    if (initAttempts >= MAX_INIT_ATTEMPTS)
      return

    initAttempts += 1
    setTimeout(initWithRetry, INIT_RETRY_MS)
  }

  onNuxtReady(() => {
    initWithRetry()
  })

  nuxtApp.hook('page:finish', () => {
    requestAnimationFrame(() => {
      const { wrapper, content } = getScrollElements()

      if (!wrapper) {
        destroyLenis()
        return
      }

      if (!lenis) {
        lenis = createLenis(wrapper, content)
        return
      }

      const currentWrapper = lenis.options.wrapper
      const currentContent = lenis.options.content
      const wrapperChanged = currentWrapper !== wrapper
      const contentChanged = currentContent !== content

      if (wrapperChanged || contentChanged) {
        destroyLenis()
        lenis = createLenis(wrapper, content)
        return
      }

      lenis.resize()
    })
  })

  nuxtApp.hook('app:beforeUnmount', () => {
    destroyLenis()
  })
})
