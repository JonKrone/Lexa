import { ThemeProvider } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { FC } from 'react'
import { Router } from 'wouter'
import { queryClient } from '../config/react-query'
import { theme } from '../config/theme'

export const Providers: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} position="top" /> */}
      <JotaiProvider>
        <ThemeProvider theme={theme}>
          <Router>{children}</Router>
        </ThemeProvider>
      </JotaiProvider>
    </QueryClientProvider>
  )
}
