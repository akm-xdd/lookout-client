'use client'
import React from 'react'
import { motion } from 'motion/react'
import { Plus, Settings, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import ProtectedRoute from '../auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import AnimatedBackground from '@/app/_components/layout/AnimatedBackground'

export default function DashboardPage() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    // No need for toast here - AuthContext handles it
    await signOut()
  }

  const handleCreateWorkspace = () => {
    // TODO: Open create workspace modal/page
    toast.info('Coming soon!', {
      description: 'Workspace creation is being built',
      duration: 3000,
    })
  }

  const handleSettings = () => {
    // TODO: Navigate to settings
    toast.info('Settings coming soon!', {
      description: 'User settings page is being built',
      duration: 3000,
    })
  }

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen bg-black text-white"
      >
        <AnimatedBackground particleCount={20} />
        
        {/* Header */}
        <header className="relative z-10 px-6 py-4 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/icon.png" alt="LookOut" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LookOut
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">
                {user?.email}
              </span>
              <button 
                onClick={handleSettings}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            
            {/* Welcome Section */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Welcome to your Dashboard
              </h1>
              <p className="text-gray-400 text-lg">
                Manage your workspaces and monitor your projects from here.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">0/5</div>
                <div className="text-gray-400">Workspaces</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">0/35</div>
                <div className="text-gray-400">Total Endpoints</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">--</div>
                <div className="text-gray-400">Avg Uptime</div>
              </div>
            </div>

            {/* Workspaces Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Workspaces</h2>
                <button 
                  onClick={handleCreateWorkspace}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Workspace</span>
                </button>
              </div>

              {/* Empty State */}
              <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No workspaces yet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Create your first workspace to start monitoring your projects. Each workspace can contain up to 7 endpoints.
                </p>
                <button 
                  onClick={handleCreateWorkspace}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Workspace</span>
                </button>
              </div>
            </div>

          </div>
        </main>
      </motion.div>
    </ProtectedRoute>
  )
}