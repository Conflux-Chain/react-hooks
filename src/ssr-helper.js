export function isSSR() {
  return typeof globalThis.window?.document?.createElement === "undefined"
}

export function isBrowser() {
  return !isSSR()
}

export function onSSR(callback, otherwise) {
  return isSSR() ? callback() : otherwise?.()
}

export function onBrowser(callback, otherwise) {
  return isBrowser() ? callback() : otherwise?.()
}
