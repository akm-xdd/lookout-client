'use client'
import React, { useState } from 'react'
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

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Client-side validation with toasts
    if (password !== confirmPassword) {
      toast.error('Passwords don\'t match', {
        description: 'Please make sure both password fields are identical',
        duration: 4000,
      })
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error('Password too short', {
        description: 'Password must be at least 6 characters long',
        duration: 4000,
      })
      setLoading(false)
      return
    }

    try {
      const { data, error: authError } = await authHelpers.signUp(email, password)
      
      if (authError) {
        toast.error('Registration failed', {
          description: authError.message,
          duration: 5000,
        })
        setLoading(false)
      } else {
        toast.success('Account created successfully!', {
          description: 'Please check your email to verify your account before signing in',
          duration: 6000,
        })
        
        // Clear form
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setLoading(false)
      }
    } catch (err) {
      toast.error('Unexpected error', {
        description: 'Something went wrong during registration. Please try again.',
        duration: 4000,
      })
      setLoading(false)
    }
  }

  const handleGitHubRegister = async () => {
    setLoading(true)
    
    try {
      const { error: authError } = await authHelpers.signInWithGitHub()
      
      if (authError) {
        toast.error('GitHub registration failed', {
          description: authError.message,
          duration: 4000,
        })
        setLoading(false)
      } else {
        toast.loading('Redirecting to GitHub...', {
          duration: 2000,
        })
        // OAuth redirect will happen automatically
      }
    } catch (err) {
      toast.error('GitHub registration failed', {
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
              Get Started
            </h1>
            <p className="text-gray-400">
              Create your account and start monitoring your projects
            </p>
          </div>

          {/* GitHub Register */}
          <button
            onClick={handleGitHubRegister}
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
          <form onSubmit={handleEmailRegister} className="space-y-4">
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
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 text-lg font-medium disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              {!loading && (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </motion.div>
  )
}