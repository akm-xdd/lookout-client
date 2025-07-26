// lib/supabase.ts - FIXED VERSION
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// console.log('🔍 Supabase Config Check:')
// console.log('URL:', supabaseUrl)
// console.log('Key (first 10 chars):', supabaseAnonKey?.substring(0, 10) + '...')

// Create browser client for client-side operations
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const authHelpers = {
  // Sign up with email/password
  async signUp(email: string, password: string) {
    // console.log('🚀 Starting signUp for:', email)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    // console.log('📧 SignUp result:', { data, error })
    return { data, error }
  },

  // Sign in with email/password
  async signIn(email: string, password: string) {
    // console.log('🔑 Starting signIn for:', email)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    // console.log('🔑 SignIn result:', { 
      user: data.user?.email, 
      session: !!data.session,
      error 
    })
    return { data, error }
  },

  // Sign in with GitHub - FIXED with proper PKCE flow
  async signInWithGitHub() {
    // console.log('🐙 Starting GitHub OAuth...')
    // console.log('🔗 Redirect URL will be:', `${window.location.origin}/auth/callback`)
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    // console.log('🐙 GitHub OAuth result:', { data, error })
    return { data, error }
  },

  // Sign out
  async signOut() {
    // console.log('👋 Signing out...')
    const { error } = await supabase.auth.signOut()
    // console.log('👋 SignOut result:', { error })
    return { error }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    // console.log('📱 Current session:', { 
      hasSession: !!session, 
      userEmail: session?.user?.email,
      error 
    })
    return { session, error }
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    // console.log('👤 Current user:', { 
      hasUser: !!user, 
      userEmail: user?.email,
      error 
    })
    return { user, error }
  }
}

// Test connection on import
supabase.auth.getSession().then(({ data, error }) => {
  // console.log('🔌 Initial connection test:', { 
    hasSession: !!data.session,
    userEmail: data.session?.user?.email,
    error 
  })
})