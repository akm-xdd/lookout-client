'use client'
import React from 'react'
import { motion } from 'motion/react'
import { 
  Scale, 
  Shield, 
  AlertTriangle, 
  Coffee, 
  Heart, 
  Trash2, 
  Database, 
  Globe, 
  Clock, 
  User,
  ExternalLink,
  BookOpen
} from 'lucide-react'

// Layout Components
import Navbar from '@/app/_components/layout/Navbar'
import AnimatedBackground from '@/app/_components/layout/AnimatedBackground'

const TOSPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground particleCount={20} />
      
      <Navbar 
        onLoginClick={() => window.location.href = '/login'}
        onGetStartedClick={() => window.location.href = '/register'}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Scale className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The legal stuff, but in plain English. Because nobody likes legal surprises.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: December 2025
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Coffee className="w-6 h-6 text-yellow-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">Legal Disclaimer</h3>
                <p className="text-yellow-200 text-sm leading-relaxed">
                  I'm not a lawyer, just a developer who vibe-coded a monitoring tool. This TOS is written in good faith to protect both of us, but if you're using LookOut for anything mission-critical, please consult actual legal counsel. Seriously.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-12">

          {/* The Service */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold">What LookOut Is (And Isn't)</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  LookOut is a free monitoring service that pings your endpoints and shows you uptime data. 
                  It's designed for solo developers and small projects who want basic monitoring without enterprise complexity.
                </p>
                
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-green-300 mb-2">✅ What it does:</h4>
                  <ul className="text-green-200 text-sm space-y-1">
                    <li>• Monitors up to 35 endpoints across 5 workspaces</li>
                    <li>• Provides uptime statistics and response time data</li>
                    <li>• Offers data export in multiple formats</li>
                    <li>• Keeps your free-tier apps awake</li>
                  </ul>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-red-300 mb-2">❌ What it doesn't do:</h4>
                  <ul className="text-red-200 text-sm space-y-1">
                    <li>• Guarantee 100% uptime (nothing can)</li>
                    <li>• Replace enterprise monitoring solutions</li>
                    <li>• Provide SLA guarantees</li>
                    <li>• Monitor localhost or private networks</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* User Responsibilities */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold">Your Responsibilities</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-red-300 mb-2">🚨 Critical: Information Liability</h4>
                      <p className="text-red-200 text-sm leading-relaxed mb-3">
                        <strong>Any information you enter on this website in any way, shape, or form is solely your liability.</strong> This includes but is not limited to:
                      </p>
                      <ul className="text-red-200 text-sm space-y-1 ml-4">
                        <li>• Endpoint URLs and configurations</li>
                        <li>• Authentication headers, API keys, or tokens</li>
                        <li>• Request bodies or custom data</li>
                        <li>• Workspace names and descriptions</li>
                        <li>• Any data submitted through forms or API calls</li>
                      </ul>
                      <p className="text-red-200 text-sm mt-3">
                        You are responsible for ensuring that any information you provide complies with all applicable laws, regulations, and third-party agreements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Do:</h4>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>• Use legitimate endpoints for monitoring</li>
                      <li>• Respect rate limits and fair usage</li>
                      <li>• Keep your account information accurate</li>
                      <li>• Report security issues responsibly</li>
                      <li>• Use read-only API keys when possible</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-red-300 mb-2">Don't:</h4>
                    <ul className="text-red-200 text-sm space-y-1">
                      <li>• Monitor endpoints you don't own/control</li>
                      <li>• Include sensitive data in configurations</li>
                      <li>• Attempt to abuse or hack the service</li>
                      <li>• Use it for illegal or harmful purposes</li>
                      <li>• Share your account with others</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Service Availability */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold">Service Availability</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-300 mb-2">The Honest Truth:</h4>
                  <p className="text-orange-200 text-sm leading-relaxed">
                    LookOut is provided "as is" with no uptime guarantees. It's a passion project built by one person in their spare time. 
                    While I try to keep it running smoothly, I can't promise 99.9% uptime like enterprise services.
                  </p>
                </div>
                
                <p>
                  I'll do my best to keep the service running and notify users of planned maintenance, 
                  but sometimes things break. When they do, I'll work to fix them as quickly as possible.
                </p>
                
                <p>
                  <strong>For mission-critical applications:</strong> Please use enterprise monitoring solutions. 
                  LookOut is perfect for side projects, personal apps, and non-critical services.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Data & Privacy */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold">Your Data</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-300 mb-2">What I Store:</h4>
                    <ul className="text-green-200 text-sm space-y-1">
                      <li>• Your endpoint configurations</li>
                      <li>• Monitoring results and statistics</li>
                      <li>• Account information (email, etc.)</li>
                      <li>• Usage data for service improvement</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Data Retention:</h4>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>• Monitoring data: 90 days</li>
                      <li>• Aggregated stats: 1 year</li>
                      <li>• Account data: Until deletion</li>
                      <li>• Export your data anytime</li>
                    </ul>
                  </div>
                </div>
                
                <p>
                  I don't sell your data, share it with third parties (except for essential service providers like hosting), 
                  or use it for advertising. Your monitoring data is yours.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Account Termination */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Trash2 className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold">Account Termination</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  You can delete your account anytime from your dashboard. 
                  I can also terminate accounts that violate these terms or pose security risks.
                </p>
                
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-300 mb-2">Before deletion:</h4>
                  <p className="text-yellow-200 text-sm">
                    Export any data you want to keep. Account deletion is permanent and irreversible.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Limitations */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold">Liability & Limitations</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>Use at your own risk.</strong> LookOut is provided for free, and while I try to make it reliable, 
                  I can't be held responsible for any damages, losses, or issues that arise from using the service.
                </p>
                
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-red-300 mb-2">Translation:</h4>
                  <p className="text-red-200 text-sm leading-relaxed">
                    If LookOut goes down and you miss a critical alert, or if there's a bug that affects your monitoring, 
                    I'll do my best to fix it but I can't be sued or held financially responsible. 
                    That's the trade-off for free software.
                  </p>
                </div>
                
                <p className="text-sm">
                  This limitation applies to the maximum extent permitted by law.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Changes & Contact */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold">Changes & Questions</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  I may update these terms occasionally. When I do, I'll update the date at the top and notify active users 
                  through the dashboard or email.
                </p>
                
                <p>
                  Questions about these terms? Email me at{" "}
                  <a 
                    href="mailto:ctfu.anand@outlook.com" 
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    ctfu.anand@outlook.com
                  </a>
                  {" "}or open an issue on{" "}
                  <a 
                    href="https://github.com/akm-xdd/lookout-client" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline inline-flex items-center space-x-1"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Heart className="w-5 h-5 text-pink-400" />
                <Coffee className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-gray-400 leading-relaxed">
                Thanks for reading the fine print. Now go build something awesome and let LookOut keep it awake.
              </p>
              <p className="text-gray-500 text-sm mt-4">
                By using LookOut, you agree to these terms. Simple as that.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default TOSPage
