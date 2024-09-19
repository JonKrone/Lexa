export function getPageLanguage(): string | null {
  const langAttribute = document.documentElement.lang || null
  const metaContentLanguage =
    document
      .querySelector('meta[http-equiv="Content-Language"]')
      ?.getAttribute('content') || null
  const ogLocale =
    document
      .querySelector('meta[property="og:locale"]')
      ?.getAttribute('content') || null

  return langAttribute ?? metaContentLanguage ?? ogLocale ?? null
}

export function getPageTitle(): string | null {
  const titleTag = document.title || null
  const ogTitle =
    document
      .querySelector('meta[property="og:title"]')
      ?.getAttribute('content') || null
  const twitterTitle =
    document
      .querySelector('meta[name="twitter:title"]')
      ?.getAttribute('content') || null
  const metaTitle =
    document.querySelector('meta[name="title"]')?.getAttribute('content') ||
    null

  return titleTag ?? ogTitle ?? twitterTitle ?? metaTitle ?? null
}
