'use client'
import React from 'react'
import { motion } from 'motion/react'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

// Layout Components
import Navbar from '@/app/_components/layout/Navbar'
import AnimatedBackground from '@/app/_components/layout/AnimatedBackground'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-black text-white overflow-hidden"
    >
      <AnimatedBackground particleCount={20} />
      
      <Navbar 
        onLoginClick={() => window.location.href = '/login'}
        onGetStartedClick={() => window.location.href = '/register'}
      />

      <div className="relative z-10 px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Error Icon with Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 border-2 border-red-500/40 rounded-full mb-4"
            >
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </motion.div>
          </motion.div>

          {/* 500 Number */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-7xl md:text-8xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-6"
          >
            500
          </motion.h1>

          {/* Main Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              Server Error
            </h2>
            <p className="text-lg text-gray-400 mb-2">
              Something went wrong on our end.
            </p>
            <p className="text-gray-500">
              LookOut is on the lookout for this issue and will resolve it shortly.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button
              onClick={reset}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>

            <Link 
              href="/"
              className="flex items-center space-x-2 px-6 py-3 text-gray-400 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          {/* Status Update */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>We're working to restore service</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}