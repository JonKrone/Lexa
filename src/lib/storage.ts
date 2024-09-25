export interface IgnoredSite {
  url: string
  addedAt: number
}

export async function getIgnoredSites(): Promise<IgnoredSite[]> {
  const ignoredSites = await chrome.storage.sync.get('ignoredSites')
  return ignoredSites.ignoredSites || []
}

export async function addIgnoredSite(url: string): Promise<void> {
  if (!urlIsValid(url)) {
    throw new Error("That's an invalid url")
  }
  const ignoredSites = await getIgnoredSites()
  if (isSiteIgnored(ignoredSites, url)) {
    throw new Error('Site already ignored')
  }

  const normalizedUrl = normalizeUrl(url)
  console.log('normalizedUrl', normalizedUrl)
  const newIgnoredSites = [
    ...ignoredSites,
    { url: normalizedUrl, addedAt: Date.now() },
  ]
  return chrome.storage.sync.set({ ignoredSites: newIgnoredSites })
}

export async function removeIgnoredSite(url: string): Promise<void> {
  const ignoredSites = await getIgnoredSites()
  const normalizedUrl = normalizeUrl(url)
  const newIgnoredSites = ignoredSites.filter(
    (site) => normalizeUrl(site.url) !== normalizedUrl,
  )

  if (newIgnoredSites.length === ignoredSites.length) return
  await chrome.storage.sync.set({ ignoredSites: newIgnoredSites })
}

export async function isCurrentSiteIgnored(): Promise<boolean> {
  const ignoredSites = await getIgnoredSites()
  const currentDomain = window.location.hostname
  return isSiteIgnored(ignoredSites, currentDomain)
}

function isSiteIgnored(sites: IgnoredSite[], url: string): boolean {
  const normalizedUrl = normalizeUrl(url)
  return sites.some((site) => normalizeUrl(site.url) === normalizedUrl)
}

/**
 * Supports domains with and without the www and any protocol (e.g., capacitor://, http://).
 * Rejects invalid URLs like "..." or ";;;".
 */
export function urlIsValid(url: string): boolean {
  try {
    const processedUrl = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url)
      ? url
      : `http://${url}`
    const parsedUrl = new URL(processedUrl)

    // Check if the hostname contains at least one dot and only valid characters
    const hostnameRegex = /^[a-zA-Z0-9]+([-.][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/
    return hostnameRegex.test(parsedUrl.hostname)
  } catch {
    return false
  }
}

function normalizeUrl(url: string): string {
  const processedUrl = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url)
    ? url
    : `http://${url}`
  const parsedUrl = new URL(processedUrl)

  return parsedUrl.hostname.toLowerCase()
}
