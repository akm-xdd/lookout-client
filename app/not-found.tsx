'use client'
import React from 'react'
import { motion } from 'motion/react'
import { Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Layout Components
import Navbar from '@/app/_components/layout/Navbar'
import AnimatedBackground from '@/app/_components/layout/AnimatedBackground'

export default function NotFoundPage() {
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
          
          {/* 404 Number */}
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-8xl md:text-9xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-6"
          >
            404
          </motion.h1>

          {/* Main Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-400 mb-2">
              This page seems to be offline.
            </p>
            <p className="text-gray-500">
              Don't let this happen to <em>your</em> projects — monitor them with LookOut.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link 
              href="/"
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>

            <Link 
              href="/dashboard"
              className="flex items-center space-x-2 px-6 py-3 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}