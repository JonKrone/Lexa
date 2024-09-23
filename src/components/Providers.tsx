import { ThemeProvider } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC } from 'react'
import { Router } from 'wouter'
import { queryClient } from '../config/react-query'
import { theme } from '../config/theme'

export const Providers: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Router>{children}</Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
