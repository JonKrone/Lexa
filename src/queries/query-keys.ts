export const QueryKeys = {
  settings: ['settings'] as const,
  translationDetails: (context: string) =>
    ['translationDetails', context] as const,
}
