// contexts/AuthContext.tsx
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Define public routes
  const publicRoutes = ['/', '/login', '/register', '/auth/callback']
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
        }

        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        setInitialized(true)

        console.log('Initial session check:', { 
          hasSession: !!session, 
          pathname, 
          userEmail: session?.user?.email 
        })

      } catch (error) {
        console.error('Session initialization error:', error)
        setLoading(false)
        setInitialized(true)
      }
    }

    getInitialSession()
  }, [])

  // Handle routing after initialization
  useEffect(() => {
    if (!initialized || loading) return

    const handleRouting = () => {
      if (session && user) {
        // User is authenticated
        if (pathname === '/login' || pathname === '/register') {
          console.log('Authenticated user on auth page, redirecting to dashboard')
          router.push('/dashboard')
        }
        // Allow access to auth callback during OAuth flow
        else if (pathname === '/auth/callback') {
          console.log('Processing auth callback...')
          // Let the callback page handle the redirect
        }
      } else {
        // User is not authenticated
        if (!isPublicRoute) {
          console.log('Unauthenticated user on protected route, redirecting to login')
          router.push('/login')
        }
      }
    }

    // Small delay to prevent race conditions
    const timer = setTimeout(handleRouting, 100)
    return () => clearTimeout(timer)
  }, [session, user, pathname, initialized, loading, isPublicRoute, router])

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', { 
          event, 
          userEmail: session?.user?.email,
          pathname 
        })
        
        setSession(session)
        setUser(session?.user ?? null)

        // Handle specific auth events with toasts
        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully')
          
          // Show success toast for OAuth sign-ins
          if (session?.user) {
            const provider = session.user.app_metadata?.provider
            const email = session.user.email
            
            if (provider === 'github') {
              toast.success("It is always nice to see you!")
            } else if (provider === 'email') {
              // This might be handled in the login component instead
              console.log('Email sign-in handled by login component')
            }
          }
          
          // Only redirect if not already on dashboard
          if (pathname !== '/dashboard') {
            router.push('/dashboard')
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out')
          
          // Only show sign-out toast if it wasn't triggered from login page
          if (pathname !== '/login' && pathname !== '/') {
            toast.success('You can always come back!')
          }
          
          router.push('/')
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, pathname])

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        toast.error('Sign out failed', {
          description: 'Please try again',
          duration: 3000,
        })
      }
      // The onAuthStateChange will handle the success toast and redirect
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Sign out failed', {
        description: 'An unexpected error occurred',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    signOut,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}