export function debounce<T extends (...args: any[]) => void | Promise<any>>(
  callback: T,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

export function isFullPageView() {
  return window.innerWidth > 768
}
