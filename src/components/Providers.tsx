import { Theme, ThemeProps } from '@radix-ui/themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC } from 'react'
import { Router } from 'wouter'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const theme = {
  accentColor: 'teal',
} satisfies ThemeProps

export const Providers: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme {...theme}>
        <Router>{children}</Router>
      </Theme>
    </QueryClientProvider>
  )
}
