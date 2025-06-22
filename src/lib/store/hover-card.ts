import { atom, useAtom } from 'jotai'

// Atom to track the currently active hover card ID
// Only one hover card can be active at a time
const activeHoverCardIdAtom = atom<string | null>(null)

export const useActiveHoverCardId = () => {
  const [activeId, setActiveId] = useAtom(activeHoverCardIdAtom)
  return { activeId, setActiveId }
}
