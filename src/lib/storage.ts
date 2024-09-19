export interface IgnoredSite {
  domain: string
  addedAt: number
}

export async function getIgnoredSites(): Promise<IgnoredSite[]> {
  const ignoredSites = await chrome.storage.sync.get('ignoredSites')
  return ignoredSites.ignoredSites || []
}

export async function addIgnoredSite(domain: string): Promise<void> {
  if (!isValidDomain(domain)) {
    throw new Error('Invalid domain')
  }
  const ignoredSites = await getIgnoredSites()
  if (isSiteIgnored(ignoredSites, domain)) return Promise.resolve()

  const newIgnoredSites = [...ignoredSites, { domain, addedAt: Date.now() }]
  return chrome.storage.sync.set({ ignoredSites: newIgnoredSites })
}

export async function removeIgnoredSite(domain: string): Promise<void> {
  if (!isValidDomain(domain)) {
    throw new Error('Invalid domain')
  }
  const ignoredSites = await getIgnoredSites()
  const newIgnoredSites = ignoredSites.filter((site) => site.domain !== domain)

  if (newIgnoredSites.length === ignoredSites.length) return Promise.resolve()
  return chrome.storage.sync.set({ ignoredSites: newIgnoredSites })
}

export async function isCurrentSiteIgnored(): Promise<boolean> {
  const ignoredSites = await getIgnoredSites()
  const currentDomain = window.location.hostname
  return isSiteIgnored(ignoredSites, currentDomain)
}

function isSiteIgnored(sites: IgnoredSite[], domain: string): boolean {
  return sites.some((site) => site.domain === domain)
}

/**
 * Supports domains with and without the www or http/https prefix.
 */
function isValidDomain(domain: string): boolean {
  try {
    new URL(`http://${domain}`)
    return true
  } catch (error) {
    return false
  }
}
