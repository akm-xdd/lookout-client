// components/auth/ProtectedRoute.tsx
'use client'
import React from 'react'
import { useAuth } from '@/contexts/AuthContext'

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
  const { session, loading } = useAuth()

  if (loading) {
    return <>{fallback}</>
  }

  if (!session) {
    // The AuthContext will handle redirecting to login
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default ProtectedRoute