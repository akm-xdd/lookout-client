// app/auth/callback/route.ts - UPDATED WITH SUCCESS PARAMETER
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  
  console.log('🔄 Auth callback received:')
  console.log('- Full URL:', request.url)
  console.log('- Search params:', Object.fromEntries(searchParams.entries()))
  
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/dashboard'

  // Check for OAuth errors first
  if (error) {
    console.error('❌ OAuth error in callback:', { error, errorDescription })
    return NextResponse.redirect(`${origin}/login?error=${error}&error_description=${encodeURIComponent(errorDescription || '')}`)
  }

  if (code) {
    console.log('✅ Authorization code received:', code.substring(0, 10) + '...')
    
    const cookieStore =  await cookies()
    
    // Create server-side Supabase client with cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    
    try {
      console.log('🔄 Exchanging code for session...')
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('❌ Code exchange error:', exchangeError)
        return NextResponse.redirect(`${origin}/login?error=exchange_failed&error_description=${encodeURIComponent(exchangeError.message)}`)
      }
      
      if (data.session) {
        console.log('✅ Session created successfully:', {
          userId: data.session.user.id,
          email: data.session.user.email,
          provider: data.session.user.app_metadata.provider
        })
        
        // Add success parameter for OAuth login toast
        const redirectUrl = `${next}?success=oauth`
        
        // Redirect to dashboard with success parameter
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${redirectUrl}`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`)
        } else {
          return NextResponse.redirect(`${origin}${redirectUrl}`)
        }
      } else {
        console.error('❌ No session in exchange response')
        return NextResponse.redirect(`${origin}/login?error=no_session`)
      }
      
    } catch (err) {
      console.error('💥 Unexpected error in callback:', err)
      return NextResponse.redirect(`${origin}/login?error=callback_error&error_description=${encodeURIComponent(String(err))}`)
    }
  }

  console.log('❌ No code parameter in callback')
  return NextResponse.redirect(`${origin}/login?error=no_code`)
}