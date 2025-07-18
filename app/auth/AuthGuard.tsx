'use client'
import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean // true = need to be logged in, false = need to be logged out
  fallback?: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  fallback 
}) => {
  const { session, loading } = useAuth()
  const router = useRouter()

  // Show loading while checking auth
  if (loading) {
    return fallback || (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Block access based on requirements
  if (requireAuth && !session) {
    // Need to be logged in but aren't
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need to be logged in to access this page.</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (!requireAuth && session) {
    // Need to be logged out but aren't
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Already Logged In</h1>
          <p className="text-gray-400 mb-6">You're already logged in as {session.user?.email}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Access allowed
  return <>{children}</>
}

export default AuthGuard
