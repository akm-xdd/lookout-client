'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Github, Mail, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

// Layout Components
import Navbar from '@/app/_components/layout/Navbar'
import Footer from '@/app/_components/layout/Footer'
import AnimatedBackground from '@/app/_components/layout/AnimatedBackground'

// Auth helpers
import { authHelpers } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Check for URL error parameters and show toast
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const errorParam = params.get('error')
    const errorDescription = params.get('error_description')
    
    if (errorParam) {
      toast.error('Authentication failed', {
        description: errorDescription || 'Please try signing in again',
        duration: 5000,
      })
      
      // Clean up URL without page reload
      window.history.replaceState({}, '', '/login')
    }
  }, [])

const handleEmailLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    const { data, error: authError } = await authHelpers.signIn(email, password)
    
    if (authError) {
      toast.error('Sign in failed', {
        description: authError.message,
        duration: 4000,
      })
      setLoading(false)
    } else if (data.session) {
      // Show success toast and wait 1 second before redirect
      toast.success('Welcome back!')
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
      
    } else {
      toast.error('Sign in failed', {
        description: 'No session was created. Please try again.',
        duration: 4000,
      })
      setLoading(false)
    }
  } catch (err) {
    toast.error('Unexpected error', {
      description: 'Something went wrong. Please try again.',
      duration: 4000,
    })
    setLoading(false)
  }
}

const handleGitHubLogin = async () => {
  setLoading(true)
  
  try {
    const { error: authError } = await authHelpers.signInWithGitHub()
    
    if (authError) {
      toast.error('GitHub sign in failed', {
        description: authError.message,
        duration: 4000,
      })
      setLoading(false)
    } else {
      toast.loading('This may take a second...Or several.', {
        duration: 2000,
      })
      // GitHub will handle its own redirect
    }
  } catch (err) {
    toast.error('GitHub sign in failed', {
      description: 'Unable to connect to GitHub. Please try again.',
      duration: 4000,
    })
    setLoading(false)
  }
}
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-black text-white overflow-hidden"
    >
      <AnimatedBackground particleCount={20} />
      
      <Navbar />

      <div className="relative z-10 px-6 py-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Sign in to access your monitoring dashboard
            </p>
          </div>

          {/* GitHub Login */}
          <button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full mb-6 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center space-x-3 text-lg font-medium disabled:opacity-50"
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">or</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 text-lg font-medium disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              {!loading && (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                Get started
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </motion.div>
  )
}