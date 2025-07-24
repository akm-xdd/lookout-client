// components/auth/ProtectedRoute.tsx
'use client'
import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

const LoadingSpinner = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
)

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <LoadingSpinner /> 
}) => {
  const { session, loading, initialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect after initialization is complete and we know there's no session
    if (initialized && !loading && !session) {
      router.push('/login')
    }
  }, [initialized, loading, session, router])

  // Show loading state while initializing or loading
  if (!initialized || loading) {
    return <>{fallback}</>
  }

  // Show loading state while redirecting
  if (!session) {
    return <>{fallback}</>
  }

  // User is authenticated, show content
  return <>{children}</>
}

export default ProtectedRoute