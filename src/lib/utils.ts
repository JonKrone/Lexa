export function debounce<T extends (...args: any[]) => void>(
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
