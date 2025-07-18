'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { APIError } from '@/lib/api-client'

interface QueryProviderProps {
  children: React.ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
  // Create QueryClient on the client side to avoid SSR issues
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes (same as your current cache)
        gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
        retry: (failureCount, error) => {
          // Don't retry on auth errors or client errors
          if (error instanceof APIError && error.status >= 400 && error.status < 500) {
            return false
          }
          return failureCount < 3
        },
        refetchOnWindowFocus: false, // Prevent refetch when switching tabs
        refetchOnReconnect: true, // Refetch when network reconnects
      },
      mutations: {
        retry: 1, // Retry mutations once on failure
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}