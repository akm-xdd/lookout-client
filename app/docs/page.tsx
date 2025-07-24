// app/docs/page.tsx
'use client'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { 
  Search, 
  Globe, 
  Shield, 
  BarChart3, 
  Zap,
  Settings,
  Play,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Database,
  Code,
  ChevronRight,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Lock,
  Edit,
  Eye,
  Timer,
  CloudSnow,
  Lightbulb,
  Copy
} from 'lucide-react'
import Link from 'next/link'

// Layout Components
import Navbar from '@/app/_components/layout/Navbar'
import AnimatedBackground from '@/app/_components/layout/AnimatedBackground'

interface DocSection {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
  searchKeywords: string[]
}

const DocsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState('getting-started')

  const docSections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Play className="w-5 h-5" />,
      content: <GettingStartedSection />,
      searchKeywords: ['start', 'begin', 'setup', 'first', 'account', 'signup', 'register']
    },
    {
      id: 'workspaces',
      title: 'Managing Workspaces',
      icon: <Database className="w-5 h-5" />,
      content: <WorkspacesSection />,
      searchKeywords: ['workspace', 'organize', 'project', 'environment', 'create', 'manage']
    },
    {
      id: 'endpoints',
      title: 'Endpoint Configuration',
      icon: <Globe className="w-5 h-5" />,
      content: <EndpointsSection />,
      searchKeywords: ['endpoint', 'url', 'monitoring', 'http', 'api', 'configuration', 'setup']
    },
    {
      id: 'security',
      title: 'Security & Best Practices',
      icon: <Lock className="w-5 h-5" />,
      content: <SecuritySection />,
      searchKeywords: ['security', 'privacy', 'sensitive', 'headers', 'authentication', 'tokens', 'keys']
    },
    {
      id: 'monitoring',
      title: 'Understanding Monitoring',
      icon: <BarChart3 className="w-5 h-5" />,
      content: <MonitoringSection />,
      searchKeywords: ['monitoring', 'uptime', 'response', 'metrics', 'analytics', 'performance', 'weather']
    },
    {
      id: 'dashboard',
      title: 'Dashboard Features',
      icon: <Shield className="w-5 h-5" />,
      content: <DashboardSection />,
      searchKeywords: ['dashboard', 'charts', 'export', 'download', 'reports', 'overview']
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting Guide',
      icon: <HelpCircle className="w-5 h-5" />,
      content: <TroubleshootingSection />,
      searchKeywords: ['troubleshoot', 'problems', 'issues', 'errors', 'fix', 'debug', 'help']
    },
    {
      id: 'limits',
      title: 'Limits & Performance',
      icon: <Settings className="w-5 h-5" />,
      content: <LimitsSection />,
      searchKeywords: ['limits', 'performance', 'frequency', 'best practices', 'optimization']
    },
    {
      id: 'examples',
      title: 'URL Examples & Patterns',
      icon: <Code className="w-5 h-5" />,
      content: <ExamplesSection />,
      searchKeywords: ['examples', 'patterns', 'url', 'api', 'configurations', 'samples']
    }
  ]

  // Filter sections based on search - only affects sidebar
  const filteredSections = docSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.searchKeywords.some(keyword => 
      keyword.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  // Always show current section content regardless of search
  const currentSection = docSections.find(section => section.id === activeSection)

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground particleCount={30} />
      
      <Navbar 
        onLoginClick={() => window.location.href = '/login'}
        onGetStartedClick={() => window.location.href = '/register'}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              LookOut Documentation
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Complete guide to monitoring your endpoints effectively and securely. Learn best practices, avoid common pitfalls, and get the most out of your monitoring setup.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">
                Navigation {searchQuery && `(${filteredSections.length} results)`}
              </h3>
              <nav className="space-y-2">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all flex items-center space-x-3 ${
                      activeSection === section.id
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {section.icon}
                    <span className="text-sm">{section.title}</span>
                    {activeSection === section.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              {currentSection?.content || <div>Section not found</div>}
            </div>
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          <Link href="/dashboard" className="block group">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold">Dashboard</h3>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <p className="text-gray-400 text-sm">
                Start monitoring your endpoints and view real-time analytics
              </p>
            </div>
          </Link>

          <a 
            href="https://github.com/akm-xdd/lookout-client" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <Code className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold">Source Code</h3>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <p className="text-gray-400 text-sm">
                Explore the codebase and contribute to the project
              </p>
            </div>
          </a>

          <Link href="/register" className="block group">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold">Get Started</h3>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <p className="text-gray-400 text-sm">
                Create your account and start monitoring in minutes
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

// Enhanced Individual section components
const GettingStartedSection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold mb-4 flex items-center space-x-3">
        <Play className="w-8 h-8 text-blue-400" />
        <span>Getting Started Guide</span>
      </h2>
      <p className="text-gray-300 text-lg leading-relaxed">
        LookOut is designed for solo developers who want reliable endpoint monitoring without the complexity of enterprise tools. This guide will walk you through everything from account creation to advanced monitoring strategies.
      </p>
    </div>

    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <Lightbulb className="w-6 h-6 text-blue-400 mt-1" />
        <div>
          <h4 className="font-semibold text-blue-300 mb-2">What You'll Learn</h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• How to set up effective monitoring in under 10 minutes</li>
            <li>• Best practices for endpoint organization and security</li>
            <li>• Understanding monitoring metrics and when to act on them</li>
            <li>• Common pitfalls and how to avoid them</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Step-by-Step Setup</h3>
      
      <StepCard
        step={1}
        title="Create Your Account"
        description="Sign up with email or GitHub OAuth for instant access"
        icon={<Users className="w-5 h-5" />}
        details={[
          "Email verification is handled automatically by Supabase",
          "GitHub OAuth provides secure, passwordless access",
          "Your data is encrypted and never shared with third parties"
        ]}
      />
      
      <StepCard
        step={2}
        title="Plan Your Workspace Structure"
        description="Think about how you want to organize your monitoring before creating workspaces"
        icon={<Database className="w-5 h-5" />}
        details={[
          "Separate by environment: Development, Staging, Production",
          "Group by application: Frontend, API, Database, Third-party services",
          "Consider using descriptive names like 'E-commerce API - Production'"
        ]}
      />
      
      <StepCard
        step={3}
        title="Add Your First Endpoint"
        description="Start with your most critical user-facing endpoint"
        icon={<Globe className="w-5 h-5" />}
        details={[
          "Begin with a simple GET request to your homepage or health check",
          "Use the recommended 15-20 minute frequency for optimal balance",
          "Set realistic timeout values based on your endpoint's typical response time"
        ]}
      />
      
      <StepCard
        step={4}
        title="Configure Monitoring Settings"
        description="Fine-tune your monitoring for accuracy and efficiency"
        icon={<Settings className="w-5 h-5" />}
        details={[
          "Set appropriate expected status codes (usually 200 for healthy endpoints)",
          "Add necessary authentication headers if required",
          "Test the endpoint manually to verify configuration"
        ]}
      />
      
      <StepCard
        step={5}
        title="Monitor and Optimize"
        description="Review your dashboard regularly and adjust settings as needed"
        icon={<BarChart3 className="w-5 h-5" />}
        details={[
          "Check your dashboard weekly to identify trends",
          "Adjust frequency based on endpoint criticality and stability",
          "Export data monthly for long-term analysis and reporting"
        ]}
      />
    </div>

    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
        <div>
          <h4 className="font-semibold text-green-300 mb-2">Quick Start Checklist</h4>
          <div className="grid md:grid-cols-2 gap-2">
            <label className="flex items-center space-x-2 text-green-200 text-sm">
              <input type="checkbox" className="rounded border-green-500" />
              <span>Account created and verified</span>
            </label>
            <label className="flex items-center space-x-2 text-green-200 text-sm">
              <input type="checkbox" className="rounded border-green-500" />
              <span>First workspace created</span>
            </label>
            <label className="flex items-center space-x-2 text-green-200 text-sm">
              <input type="checkbox" className="rounded border-green-500" />
              <span>Critical endpoint added</span>
            </label>
            <label className="flex items-center space-x-2 text-green-200 text-sm">
              <input type="checkbox" className="rounded border-green-500" />
              <span>Test performed successfully</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const SecuritySection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold mb-4 flex items-center space-x-3">
        <Lock className="w-8 h-8 text-red-400" />
        <span>Security & Privacy Guidelines</span>
      </h2>
      <p className="text-gray-300 text-lg leading-relaxed">
        Protecting your sensitive information while setting up effective monitoring is crucial. This section covers security best practices and common mistakes to avoid.
      </p>
    </div>

    <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-red-400 mt-1" />
        <div>
          <h4 className="font-semibold text-red-300 mb-2">⚠️ Critical Security Warning</h4>
          <p className="text-red-200 text-sm mb-3">
            <strong>Never include sensitive information in endpoint configurations.</strong> Headers, request bodies, and URLs are stored in our database and could be visible to our monitoring system.
          </p>
          <div className="text-red-200 text-sm space-y-1">
            <p><strong>❌ Never include:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Production API keys or tokens</li>
              <li>• Database passwords or connection strings</li>
              <li>• Personal information (emails, phone numbers, addresses)</li>
              <li>• Credit card or payment information</li>
              <li>• Social Security Numbers or government IDs</li>
              <li>• Any data that could identify real users</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Safe Authentication Practices</h3>
      
      <SecurityCard
        title="Use Read-Only API Keys"
        description="Create special monitoring keys with minimal permissions"
        icon={<Shield className="w-6 h-6 text-green-400" />}
        practices={[
          "Generate dedicated API keys just for monitoring",
          "Limit permissions to read-only or health-check endpoints only",
          "Set expiration dates and rotate keys regularly",
          "Use separate keys for different environments"
        ]}
        example={{
          good: "Authorization: Bearer mon_readonly_abc123...",
          bad: "Authorization: Bearer prod_admin_xyz789..."
        }}
      />

      <SecurityCard
        title="Public Health Check Endpoints"
        description="The safest approach is monitoring endpoints that don't require authentication"
        icon={<Globe className="w-6 h-6 text-blue-400" />}
        practices={[
          "Create dedicated /health or /status endpoints",
          "Return basic system status without sensitive data",
          "Include version numbers and basic connectivity tests",
          "Make these endpoints publicly accessible"
        ]}
        example={{
          good: "GET /api/health → {\"status\": \"ok\", \"version\": \"1.2.3\"}",
          bad: "GET /api/users → {\"users\": [{\"email\": \"user@example.com\"}]}"
        }}
      />

      <SecurityCard
        title="Environment Separation"
        description="Never mix production credentials with development monitoring"
        icon={<Database className="w-6 h-6 text-purple-400" />}
        practices={[
          "Use separate workspaces for dev, staging, and production",
          "Test monitoring configuration in development first",
          "Use dummy data in non-production environments",
          "Document which credentials are safe for monitoring"
        ]}
      />
    </div>

    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Data Privacy</h3>
      
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Eye className="w-6 h-6 text-yellow-400 mt-1" />
          <div>
            <h4 className="font-semibold text-yellow-300 mb-2">What LookOut Can See</h4>
            <p className="text-yellow-200 text-sm mb-3">
              To provide monitoring services, our system necessarily has access to:
            </p>
            <ul className="text-yellow-200 text-sm space-y-1 ml-4">
              <li>• Endpoint URLs and HTTP methods</li>
              <li>• Request headers and body content you configure</li>
              <li>• Response status codes and response times</li>
              <li>• Basic response headers (for debugging purposes)</li>
            </ul>
            <p className="text-yellow-200 text-sm mt-3">
              <strong>We do NOT store:</strong> Response body content, user data from your endpoints, or any data not explicitly configured by you.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Endpoint Immutability</h3>
      
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Edit className="w-6 h-6 text-orange-400 mt-1" />
          <div>
            <h4 className="font-semibold text-orange-300 mb-2">🚫 Why Endpoints Cannot Be Edited</h4>
            <p className="text-orange-200 text-sm mb-3">
              Once created, endpoints cannot be edited to prevent the "Ship of Theseus" problem. If you could change the URL, method, headers, and body, is it still the same endpoint?
            </p>
            <div className="text-orange-200 text-sm space-y-2">
              <p><strong>This design prevents:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Historical data becoming meaningless</li>
                <li>• Confusion about what was actually monitored</li>
                <li>• Accidental changes that break monitoring</li>
                <li>• Data integrity issues in reports</li>
              </ul>
              <p className="mt-3"><strong>Instead:</strong> Delete the old endpoint and create a new one with the correct configuration. This maintains data integrity and provides a clear audit trail.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const ExamplesSection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold mb-4 flex items-center space-x-3">
        <Code className="w-8 h-8 text-green-400" />
        <span>URL Examples & Configuration Patterns</span>
      </h2>
      <p className="text-gray-300 text-lg leading-relaxed">
        Real-world examples of endpoint configurations, from simple health checks to complex API monitoring setups.
      </p>
    </div>

    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-6">Simple Configurations</h3>
        
        <div className="space-y-6">
          <ExampleCard
            title="Website Health Check"
            description="Monitor your main website's availability"
            config={{
              name: "Homepage Health",
              url: "https://mywebsite.com",
              method: "GET",
              expected_status: 200,
              frequency: 15,
              timeout: 30
            }}
            explanation="Perfect for monitoring overall website availability. Uses default settings and requires no authentication."
          />

          <ExampleCard
            title="API Health Endpoint"
            description="Monitor a dedicated health check endpoint"
            config={{
              name: "API Health Check",
              url: "https://api.myapp.com/health",
              method: "GET",
              expected_status: 200,
              frequency: 10,
              timeout: 15
            }}
            explanation="Faster checks for critical API infrastructure. Short timeout assumes optimized health endpoint."
          />

          <ExampleCard
            title="Static Asset Monitoring"
            description="Ensure your CDN or static files are accessible"
            config={{
              name: "CDN Status",
              url: "https://cdn.myapp.com/images/logo.png",
              method: "HEAD",
              expected_status: 200,
              frequency: 30,
              timeout: 10
            }}
            explanation="Uses HEAD method to check availability without downloading the file. Lower frequency since CDNs are typically stable."
          />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-6">Authenticated Endpoints</h3>
        
        <div className="space-y-6">
          <ExampleCard
            title="API with Bearer Token"
            description="Monitor authenticated API endpoints"
            config={{
              name: "User API Status",
              url: "https://api.myapp.com/v1/status",
              method: "GET",
              headers: {
                "Authorization": "Bearer mon_readonly_token_here",
                "Accept": "application/json"
              },
              expected_status: 200,
              frequency: 20
            }}
            explanation="Uses read-only monitoring token. Never use production admin tokens for monitoring."
            security="🔒 Use dedicated monitoring tokens with minimal permissions"
          />

          <ExampleCard
            title="API Key Authentication"
            description="Monitor endpoints that use API key authentication"
            config={{
              name: "Analytics API",
              url: "https://analytics.myapp.com/api/health",
              method: "GET",
              headers: {
                "X-API-Key": "monitoring_key_abc123",
                "User-Agent": "LookOut-Monitor/1.0"
              },
              expected_status: 200
            }}
            explanation="Custom User-Agent helps identify monitoring traffic in your logs."
            security="🔒 Create a separate API key just for monitoring"
          />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-6">Advanced Configurations</h3>
        
        <div className="space-y-6">
          <ExampleCard
            title="POST Endpoint Monitoring"
            description="Monitor endpoints that require POST requests"
            config={{
              name: "Webhook Health",
              url: "https://api.myapp.com/webhooks/health",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Monitor-Token": "safe_monitor_token"
              },
              body: '{"action": "health_check", "source": "monitoring"}',
              expected_status: 200,
              timeout: 45
            }}
            explanation="Longer timeout for POST requests that might do more processing. Body contains safe, non-sensitive test data."
            security="⚠️ Never include real user data in the request body"
          />

          <ExampleCard
            title="Third-Party Service"
            description="Monitor external dependencies"
            config={{
              name: "Payment Gateway",
              url: "https://api.stripe.com/v1/charges",
              method: "GET",
              headers: {
                "Authorization": "Bearer sk_test_monitoring_key"
              },
              expected_status: 401,
              frequency: 30
            }}
            explanation="Expects 401 because we're not sending valid parameters - we just want to verify the service is responding."
            note="💡 Sometimes you want to monitor that a service rejects invalid requests properly"
          />

          <ExampleCard
            title="Database Health via API"
            description="Monitor database connectivity through your API"
            config={{
              name: "Database Health",
              url: "https://api.myapp.com/internal/db-health",
              method: "GET",
              headers: {
                "X-Internal-Monitor": "true",
                "Authorization": "Bearer internal_health_token"
              },
              expected_status: 200,
              frequency: 10,
              timeout: 60
            }}
            explanation="Longer timeout for database health checks. Higher frequency since database issues are critical."
            security="🔒 Use internal monitoring endpoints that don't expose sensitive data"
          />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-6">Common Patterns by Industry</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <PatternCard
            title="E-commerce"
            patterns={[
              "Product catalog API → /api/products?limit=1",
              "Shopping cart health → /api/cart/health",
              "Payment processor → /api/payments/status",
              "Inventory system → /api/inventory/health"
            ]}
          />
          
          <PatternCard
            title="SaaS Applications"
            patterns={[
              "User authentication → /api/auth/health",
              "Application status → /api/status",
              "Feature flags service → /api/features/health",
              "Subscription system → /api/billing/status"
            ]}
          />
          
          <PatternCard
            title="Content Platforms"
            patterns={[
              "Content delivery → /api/content/health",
              "Media processing → /api/media/status",
              "Search functionality → /api/search/health",
              "User uploads → /api/upload/status"
            ]}
          />
          
          <PatternCard
            title="API Services"
            patterns={[
              "Rate limiting → /api/rate-limit/status",
              "Data validation → /api/validate/health",
              "External integrations → /api/integrations/status",
              "Caching layer → /api/cache/health"
            ]}
          />
        </div>
      </div>
    </div>

    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <Lightbulb className="w-6 h-6 text-blue-400 mt-1" />
        <div>
          <h4 className="font-semibold text-blue-300 mb-2">Configuration Tips</h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Start with GET requests to public endpoints when possible</li>
            <li>• Use dedicated health check endpoints rather than business logic endpoints</li>
            <li>• Set timeouts based on your endpoint's 95th percentile response time + buffer</li>
            <li>• Monitor dependencies (databases, external APIs) through your own health endpoints</li>
            <li>• Test configurations manually before saving to ensure they work correctly</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
)

const MonitoringSection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold mb-4 flex items-center space-x-3">
        <BarChart3 className="w-8 h-8 text-blue-400" />
        <span>Understanding Monitoring Metrics</span>
      </h2>
      <p className="text-gray-300 text-lg leading-relaxed">
        Learn what each metric means, how it's calculated, and when to take action. Understanding your monitoring data is key to maintaining reliable services.
      </p>
    </div>

    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Core Metrics Explained</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <MetricCard
          title="Uptime Percentage"
          description="The percentage of time your endpoint was available and responding correctly"
          icon={<CheckCircle className="w-6 h-6 text-green-400" />}
          calculation="(Successful Checks ÷ Total Checks) × 100"
          details={[
            "Calculated over rolling time periods (24h, 7d, 30d)",
            "99.9% uptime = ~43 minutes downtime per month",
            "99.5% uptime = ~3.6 hours downtime per month",
            "Tracks both availability and correct response codes"
          ]}
          actionable="< 95% suggests serious reliability issues that need immediate attention"
        />
        
        <MetricCard
          title="Response Time"
          description="How long your endpoint takes to respond to requests"
          icon={<Clock className="w-6 h-6 text-yellow-400" />}
          calculation="Time from request sent to response received"
          details={[
            "Measured in milliseconds (ms)",
            "Includes network latency + server processing time",
            "Averages are shown over time periods",
            "Spikes often indicate performance bottlenecks"
          ]}
          actionable="> 5 seconds consistently indicates performance problems"
        />
        
        <MetricCard
          title="Incidents"
          description="Periods when your endpoint was unavailable or malfunctioning"
          icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
          calculation="3+ consecutive failures = incident start"
          details={[
            "Tracks start time, duration, and cause",
            "Automatically resolves when endpoint recovers",
            "Shows impact on overall availability",
            "Helps identify patterns and trends"
          ]}
          actionable="Frequent short incidents suggest intermittent issues; rare long incidents suggest systemic problems"
        />
        
        <MetricCard
          title="Performance Weather"
          description="Visual representation of your workspace's overall health"
          icon={<CloudSnow className="w-6 h-6 text-purple-400" />}
          calculation="Health score + incident count + endpoint status"
          details={[
            "☀️ Sunny: 95%+ health, no incidents",
            "⛅ Partly Cloudy: 80-94% health, minor issues",
            "☁️ Cloudy: 60-79% health, multiple issues",
            "⛈️ Stormy: <60% health or multiple active incidents"
          ]}
          actionable="⚠️ Weather is descriptive, not predictive - it shows current state, not future forecasts"
        />
      </div>
    </div>

    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">What Triggers an Alert?</h3>
      
      <div className="space-y-4">
        <AlertTriggerCard
          condition="Wrong Status Code"
          description="Response status doesn't match your expected status code"
          examples={[
            "Expected: 200, Got: 404 (endpoint not found)",
            "Expected: 200, Got: 500 (server error)",
            "Expected: 200, Got: 503 (service unavailable)"
          ]}
          troubleshooting="Check if endpoint URL changed, server deployment issues, or configuration errors"
        />
        
        <AlertTriggerCard
          condition="Request Timeout"
          description="Endpoint doesn't respond within the configured timeout period"
          examples={[
            "Database queries taking too long",
            "External API dependencies are slow",
            "Server under heavy load"
          ]}
          troubleshooting="Increase timeout if this is expected, or investigate performance bottlenecks"
        />
        
        <AlertTriggerCard
          condition="Network/Connection Error"
          description="Unable to establish connection to the endpoint"
          examples={[
            "DNS resolution failure",
            "Connection refused (service not running)",
            "Network connectivity issues"
          ]}
          troubleshooting="Check if service is running, DNS is correct, and firewall allows connections"
        />
        
        <AlertTriggerCard
          condition="SSL/TLS Certificate Issues"
          description="Problems with HTTPS certificates or encryption"
          examples={[
            "Certificate expired",
            "Certificate not trusted",
            "SSL handshake failure"
          ]}
          troubleshooting="Renew certificates, check certificate chain, verify SSL configuration"
        />
      </div>
    </div>

    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Interpreting Your Data</h3>
      
      <div className="space-y-4">
        <InterpretationCard
          scenario="Sudden Drop in Uptime"
          indicators={[
            "Uptime drops from 99%+ to <90%",
            "Multiple incidents in short time",
            "Response times increase significantly"
          ]}
          likely_causes={[
            "Deployment or configuration change",
            "Infrastructure problems",
            "Database performance issues",
            "External dependency failure"
          ]}
          actions={[
            "Check recent deployments or changes",
            "Review server resources and logs",
            "Test endpoint manually",
            "Check external service status pages"
          ]}
        />
        
        <InterpretationCard
          scenario="Gradually Increasing Response Times"
          indicators={[
            "Response times trending upward over days/weeks",
            "Occasional timeouts starting to appear",
            "Performance varies by time of day"
          ]}
          likely_causes={[
            "Growing database size without optimization",
            "Increasing user load",
            "Memory leaks",
            "Inefficient code changes"
          ]}
          actions={[
            "Analyze database query performance",
            "Review application performance metrics",
            "Consider scaling resources",
            "Profile recent code changes"
          ]}
        />
        
        <InterpretationCard
          scenario="Intermittent Failures"
          indicators={[
            "Random failures with no clear pattern",
            "Sometimes works, sometimes doesn't",
            "Different error types (timeouts, 500s, connection errors)"
          ]}
          likely_causes={[
            "Load balancer issues",
            "Inconsistent server configurations",
            "Race conditions in code",
            "Resource contention"
          ]}
          actions={[
            "Check load balancer configuration",
            "Verify all servers have identical configs",
            "Review logs for patterns",
            "Test during different load conditions"
          ]}
        />
      </div>
    </div>

    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <Timer className="w-6 h-6 text-purple-400 mt-1" />
        <div>
          <h4 className="font-semibold text-purple-300 mb-2">Optimal Check Frequency</h4>
          <p className="text-purple-200 text-sm mb-3">
            <strong>Recommended: 15-20 minutes</strong> for most endpoints. This provides:
          </p>
          <ul className="text-purple-200 text-sm space-y-1 ml-4">
            <li>• Good balance between coverage and resource usage</li>
            <li>• Sufficient data for meaningful statistics</li>
            <li>• Early detection without overwhelming your servers</li>
            <li>• Cost-effective monitoring for solo developers</li>
          </ul>
          <p className="text-purple-200 text-sm mt-3">
            <strong>Adjust based on criticality:</strong> 5-10 minutes for critical services, 30+ minutes for less important endpoints.
          </p>
        </div>
      </div>
    </div>
  </div>
)

// Continue with other enhanced sections...
const WorkspacesSection: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-3xl font-bold mb-4 flex items-center space-x-3">
        <Database className="w-8 h-8 text-purple-400" />
        <span>Workspace Organization Strategy</span>
      </h2>
      <p className="text-gray-300 text-lg">
        Effective workspace organization makes monitoring management easier and provides better insights into your infrastructure.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <FeatureCard
        title="Workspace Concept"
        description="Logical containers for organizing related endpoints"
        icon={<Database className="w-6 h-6 text-purple-400" />}
        points={[
          "Maximum 7 endpoints per workspace",
          "Unlimited workspaces per account",
          "Independent monitoring and statistics",
          "Separate health scores and weather"
        ]}
      />
      <FeatureCard
        title="Organization Strategies"
        description="Choose the approach that fits your workflow"
        icon={<Settings className="w-6 h-6 text-yellow-400" />}
        points={[
          "By environment (dev, staging, prod)",
          "By application (frontend, API, admin)",
          "By team or responsibility area",
          "By criticality level"
        ]}
      />
    </div>

    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Workspace Management</h3>
      
      <div className="space-y-3">
        <InfoCard
          title="Creating Effective Workspaces"
          description="Use descriptive names like 'E-commerce API - Production' or 'Frontend - Staging'. Add descriptions explaining what endpoints belong here. This helps you, not us."
        />
        <InfoCard
          title="The 7-Endpoint Limit"
          description="Designed to encourage focused monitoring. If you need more endpoints, consider if they belong in a separate workspace or if some are redundant."
        />
        <InfoCard
          title="Workspace Deletion"
          description="Deleting a workspace permanently removes all endpoints and their historical data. Export data first if you need to keep records."
        />
      </div>
    </div>
  </div>
)

const EndpointsSection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold mb-4 flex items-center space-x-3">
        <Globe className="w-8 h-8 text-green-400" />
        <span>Endpoint Configuration Guide</span>
      </h2>
      <p className="text-gray-300 text-lg leading-relaxed">
        Master endpoint configuration to get accurate monitoring data while avoiding common pitfalls. This comprehensive guide covers everything from basic settings to advanced configurations.
      </p>
    </div>

    {/* Localhost warning */}
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-red-400 mt-1" />
        <div>
          <h4 className="font-semibold text-red-300 mb-2">🚫 Localhost URL Warning</h4>
          <p className="text-red-200 text-sm">
            <strong>Localhost URLs cannot be monitored by this system.</strong> The monitoring server cannot access URLs that only exist on your local machine (localhost, 127.0.0.1, 0.0.0.0, or private IP ranges). Please use a publicly accessible URL instead.
          </p>
        </div>
      </div>
    </div>

    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Basic Configuration Fields</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <ConfigFieldCard
          title="Endpoint Name"
          description="Descriptive identifier for your endpoint"
          tips={[
            "Use clear, descriptive names like 'API Health Check'",
            "Include environment in name: 'Production User API'",
            "Keep it under 100 characters",
            "Avoid special characters or emojis"
          ]}
          examples={[
            "✅ Homepage Health Check",
            "✅ User Authentication API - Prod",
            "❌ endpoint1",
            "❌ 🚀 My Super Cool API 🎉"
          ]}
        />

        <ConfigFieldCard
          title="URL"
          description="Full URL including protocol (http:// or https://)"
          tips={[
            "Always include the protocol (https:// preferred)",
            "Use publicly accessible URLs only",
            "Include query parameters if needed",
            "Avoid URLs with sensitive data"
          ]}
          examples={[
            "✅ https://api.myapp.com/health",
            "✅ https://mysite.com/status?format=json",
            "❌ myapp.com/health (missing protocol)",
            "❌ localhost:3000/api (not accessible)"
          ]}
        />

        <ConfigFieldCard
          title="HTTP Method"
          description="HTTP verb to use for the request"
          tips={[
            "GET: Most common, for health checks and status",
            "HEAD: Check availability without downloading content",
            "POST: For endpoints that require data submission",
            "Choose based on your endpoint's requirements"
          ]}
          examples={[
            "✅ GET for /health endpoints",
            "✅ HEAD for static files",
            "✅ POST for webhook testing",
            "❌ DELETE for monitoring (destructive)"
          ]}
        />

        <ConfigFieldCard
          title="Expected Status"
          description="HTTP status code you expect from a healthy endpoint"
          tips={[
            "200: Standard success response",
            "204: Success with no content",
            "301/302: For redirect monitoring",
            "401: Sometimes expected for auth endpoints"
          ]}
          examples={[
            "✅ 200 for health checks",
            "✅ 401 for protected endpoints",
            "✅ 204 for empty success responses",
            "❌ 500 (indicates server error)"
          ]}
        />
      </div>
    </div>

    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Advanced Configuration</h3>
      
      <div className="space-y-6">
        <AdvancedConfigCard
          title="Check Frequency"
          description="How often to monitor your endpoint (5-60 minutes)"
          recommendation="15-20 minutes for most endpoints"
          details={[
            "Critical services: 5-10 minutes (payment, auth)",
            "Important services: 15-20 minutes (main APIs)",
            "Less critical: 30-60 minutes (admin panels, docs)",
            "Consider your server capacity and costs"
          ]}
          warning="Very frequent checks (< 10 minutes) can strain your and our servers and may trigger rate limiting"
        />

        <AdvancedConfigCard
          title="Request Timeout"
          description="Maximum time to wait for a response (5-120 seconds)"
          recommendation="30 seconds for most endpoints"
          details={[
            "Fast endpoints: 10-15 seconds",
            "Standard APIs: 30-45 seconds",
            "Heavy processing: 60-120 seconds",
            "Database queries: 45-90 seconds"
          ]}
          warning="Set timeout based on your endpoint's 95th percentile response time + 30% buffer"
        />

        <AdvancedConfigCard
          title="Custom Headers"
          description="HTTP headers to include with requests"
          recommendation="Use sparingly and securely"
          details={[
            "Authorization: Bearer tokens or API keys",
            "Accept: Specify response format",
            "User-Agent: Identify monitoring traffic",
            "X-Custom-Headers: Your specific needs"
          ]}
          warning="Never include production admin tokens or sensitive credentials"
        />

        <AdvancedConfigCard
          title="Request Body"
          description="Data to send with POST/PUT/PATCH requests"
          recommendation="Use safe, non-sensitive test data only"
          details={[
            "JSON format for APIs",
            "Form data for traditional endpoints",
            "Keep data minimal and safe",
            "Use dummy/test data only"
          ]}
          warning="Never include real user data, passwords, or sensitive information"
        />
      </div>
    </div>

    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Configuration Best Practices</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <BestPracticeCard
          title="Start Simple"
          description="Begin with basic configurations and add complexity gradually"
          practices={[
            "Start with GET requests to public endpoints",
            "Use default timeouts initially",
            "Add authentication only when necessary",
            "Test configurations manually first"
          ]}
        />

        <BestPracticeCard
          title="Security First"
          description="Always prioritize security in your configurations"
          practices={[
            "Use read-only or monitoring-specific credentials",
            "Never expose production admin access",
            "Separate staging and production monitoring",
            "Regularly rotate monitoring credentials"
          ]}
        />

        <BestPracticeCard
          title="Optimize for Signal"
          description="Configure monitoring to provide meaningful alerts"
          practices={[
            "Monitor what matters to users",
            "Set realistic expectations",
            "Focus on user-facing functionality",
            "Avoid monitoring internal debugging endpoints"
          ]}
        />

        <BestPracticeCard
          title="Document Everything"
          description="Keep track of what you're monitoring and why"
          practices={[
            "Use descriptive endpoint names",
            "Add meaningful workspace descriptions",
            "Document authentication requirements",
            "Note any special configuration reasons"
          ]}
        />
      </div>
    </div>

    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <Lightbulb className="w-6 h-6 text-blue-400 mt-1" />
        <div>
          <h4 className="font-semibold text-blue-300 mb-2">Remember: Endpoints Cannot Be Modified</h4>
          <p className="text-blue-200 text-sm mb-3">
            Once created, endpoints are immutable to preserve data integrity. If you need to change configuration:
          </p>
          <ul className="text-blue-200 text-sm space-y-1 ml-4">
            <li>• Delete the existing endpoint</li>
            <li>• Create a new one with correct settings</li>
            <li>• Export historical data if needed</li>
            <li>• This prevents confusion about what was actually monitored</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
)

const DashboardSection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold mb-4 flex items-center space-x-3">
        <Shield className="w-8 h-8 text-purple-400" />
        <span>Dashboard Features & Navigation</span>
      </h2>
      <p className="text-gray-300 text-lg leading-relaxed">
        Your dashboard is the central hub for monitoring insights. Learn how to interpret data, use advanced features, and get the most value from your monitoring setup.
      </p>
    </div>

    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Dashboard Overview</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <DashboardFeatureCard
          title="Overview Stats"
          description="High-level summary of your monitoring health"
          icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
          features={[
            "Total endpoints across all workspaces",
            "Overall uptime percentage", 
            "Active incidents count",
            "System-wide performance trends"
          ]}
          usage="Check this first to get a quick health snapshot of all your services"
        />
        
        <DashboardFeatureCard
          title="Workspace Cards"
          description="Individual workspace health and management"
          icon={<Database className="w-6 h-6 text-purple-400" />}
          features={[
            "Per-workspace uptime and performance",
            "Endpoint count and status distribution",
            "Quick actions (add endpoint, settings)"
          ]}
          usage="Drill down into specific projects or environments to see detailed status"
        />
        
        <DashboardFeatureCard
          title="Charts & Analytics"
          description="Visual insights into performance trends"
          icon={<BarChart3 className="w-6 h-6 text-green-400" />}
          features={[
            "7-day uptime trends (after 7 days of data)",
            "24-hour response time analysis",
            "Best/worst performing endpoints",
            "Historical incident timeline"
          ]}
          usage="Identify patterns, performance improvements, or degradations over time"
        />
        
        <DashboardFeatureCard
          title="Recent Incidents"
          description="Timeline of recent monitoring alerts and issues"
          icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
          features={[
            "Incident start/end times and duration",
            "Root cause identification",
            "Affected endpoints and workspaces",
            "Resolution status tracking"
          ]}
          usage="Review what went wrong and when to improve your infrastructure"
        />
      </div>
    </div>

    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Advanced Features</h3>
      
      <div className="space-y-6">
        <AdvancedFeatureCard
          title="Data Export & Reporting"
          description="Download your monitoring data in multiple formats"
          icon={<Download className="w-6 h-6 text-blue-400" />}
          formats={[
            {
              name: "PDF Report",
              description: "Professional reports for stakeholders",
              use_case: "Monthly reports for managers or clients"
            },
            {
              name: "Excel Spreadsheet",
              description: "Detailed data for analysis",
              use_case: "Performance analysis and trend identification"
            },
            {
              name: "CSV Data",
              description: "Raw data for processing",
              use_case: "Import into other tools or custom analysis"
            },
            {
              name: "JSON Export",
              description: "Machine-readable format",
              use_case: "Integration with other systems or scripts"
            }
          ]}
          tips={[
            "Export data monthly for long-term trend analysis",
            "Use PDF reports for stakeholder communication",
            "CSV format works well with Google Sheets or Excel",
            "JSON format is perfect for automated processing"
          ]}
        />

        <AdvancedFeatureCard
          title="Manual Endpoint Testing"
          description="Test endpoints on-demand to verify configuration"
          icon={<Play className="w-6 h-6 text-green-400" />}
          formats={[
            {
              name: "Instant Testing",
              description: "Test any endpoint immediately",
              use_case: "Manually verify endpoint configurations"
            },
            {
              name: "Detailed Results",
              description: "See response time, status, headers",
              use_case: "Debug configuration issues"
            },
            {
              name: "Error Diagnosis",
              description: "Get specific error messages",
              use_case: "Troubleshoot connection problems"
            },
            {
                name: "Guaranteed Result",
                description: "Manual tests always return the actual result",
                use_case: "Verify endpoint health without waiting for scheduled checks"
            }
          ]}
          tips={[
            "Manual tests help you to randomly verify endpoint health",
            "Use manual testing to debug configuration issues",
            "Test after making infrastructure changes",
            "Rate limited to 5 tests per minute to prevent abuse"
          ]}
        />

        <AdvancedFeatureCard
          title="Workspace Management"
          description="Organize and manage your monitoring structure"
          icon={<Settings className="w-6 h-6 text-yellow-400" />}
          formats={[
            {
              name: "Create Workspaces",
              description: "Organize endpoints by project/environment/function",
              use_case: "Neatly group related endpoints"
            },
            {
              name: "Edit Workspace Details",
              description: "Update names and descriptions",
              use_case: "Keep organization current as projects evolve"
            },
            {
              name: "Workspace Statistics",
              description: "Per-workspace health and performance",
              use_case: "Compare performance across different services"
            }
          ]}
          tips={[
            "Use descriptive names that will make sense in 6 months",
            "Group related endpoints together",
            "Maximum 7 endpoints per workspace for focus",
            "Delete unused workspaces to reduce clutter"
          ]}
        />
      </div>
    </div>

    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Interpreting Dashboard Data</h3>
      
      <div className="space-y-4">
        <DataInterpretationCard
          metric="Uptime Trends"
          timeframe="Shows 7-day rolling averages"
          interpretation={[
            "Flat line at 100%: Excellent stability",
            "Gradual decline: Systematic issues developing",
            "Sharp drops: Incidents or outages",
            "Volatile pattern: Intermittent problems"
          ]}
          actions={[
            "Investigate sharp drops immediately",
            "Track gradual declines to prevent outages",
            "Celebrate consistent high uptime",
            "Use data to justify infrastructure investments"
          ]}
        />

        <DataInterpretationCard
          metric="Response Time Charts"
          timeframe="24-hour hourly averages"
          interpretation={[
            "Consistent low times: Well-optimized service",
            "Peak hour spikes: Load-related performance issues",
            "Random spikes: Infrastructure or code problems",
            "Gradual increases: Capacity or efficiency issues"
          ]}
          actions={[
            "Optimize for peak hour performance",
            "Investigate random spike causes",
            "Plan capacity increases for gradual rises",
            "Use data to optimize caching strategies"
          ]}
        />

        <DataInterpretationCard
          metric="Performance Weather"
          timeframe="Real-time health summary"
          interpretation={[
            "☀️ Sunny: All systems operating normally",
            "⛅ Partly Cloudy: Minor issues detected",
            "☁️ Cloudy: Multiple problems need attention",
            "⛈️ Stormy: Major issues requiring immediate action"
          ]}
          actions={[
            "Sunny: Maintain current practices",
            "Partly Cloudy: Monitor closely, plan fixes",
            "Cloudy: Prioritize fixes for affected services",
            "Stormy: Drop everything and investigate immediately"
          ]}
        />
      </div>
    </div>

    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
        <div>
          <h4 className="font-semibold text-green-300 mb-2">Dashboard Best Practices</h4>
          <ul className="text-green-200 text-sm space-y-1">
            <li>• Check your dashboard weekly to identify trends and patterns</li>
            <li>• Use the overview stats to quickly assess overall health</li>
            <li>• Use manual testing when you make infrastructure changes</li>
            <li>• Pay attention to performance weather - it's designed to give you quick insights</li>
            <li>• Don't ignore gradual degradation - small problems become big problems</li>
            <li>• Celebrate good uptime! Use the data to showcase your reliability</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
)

const TroubleshootingSection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold mb-4 flex items-center space-x-3">
        <HelpCircle className="w-8 h-8 text-orange-400" />
        <span>Troubleshooting Guide</span>
      </h2>
      <p className="text-gray-300 text-lg leading-relaxed">
        Comprehensive guide to diagnosing and fixing common monitoring issues. From configuration problems to performance issues, learn how to identify and resolve problems quickly.
      </p>
    </div>

    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Common Issues & Solutions</h3>
      
      <div className="space-y-6">
        <TroubleshootCard
          problem="Endpoint Always Shows as Down"
          severity="high"
          symptoms={[
            "100% failure rate despite service being online",
            "All checks return errors",
            "Manual testing also fails"
          ]}
          causes={[
            "Wrong expected status code configured",
            "Endpoint requires authentication not provided",
            "Firewall blocking monitoring requests",
            "URL typo or incorrect path",
            "Service requires specific headers",
            "We messed up"
          ]}
          solutions={[
            "Verify expected status matches actual response (test manually)",
            "Add required authentication headers (API keys, tokens)",
            "Check if endpoint requires specific User-Agent or Accept headers",
            "Verify URL is publicly accessible from external networks",
            "Check server logs for blocked requests from monitoring IPs"
          ]}
          prevention="Always test endpoints manually before configuring monitoring"
        />

        <TroubleshootCard
          problem="Intermittent Failures (Sometimes Up, Sometimes Down)"
          severity="medium"
          symptoms={[
            "Unpredictable failures with no clear pattern",
            "Sometimes works, sometimes doesn't",
            "Different error types (timeouts, 500s, connection errors)"
          ]}
          causes={[
            "Load balancer health check issues",
            "Auto-scaling causing temporary unavailability",
            "Rate limiting triggered by monitoring frequency",
            "Database connection pool exhaustion",
            "Memory leaks causing periodic crashes"
          ]}
          solutions={[
            "Check load balancer configuration and health check settings",
            "Review server auto-scaling policies and thresholds",
            "Examine application logs during failure periods",
            "Monitor server resource usage (CPU, memory, connections)"
          ]}
          prevention="Monitor server resources and set up proper health checks. Slow responses times don't always mean something is wrong. Look for patterns. We admit, sometimes it's just our fault."
        />

        <TroubleshootCard
          problem="Slow Response Times Getting Worse"
          severity="medium"
          symptoms={[
            "Response times gradually increasing over days/weeks",
            "Occasional timeouts starting to appear",
            "Performance varies significantly by time of day"
          ]}
          causes={[
            "Database growing without proper indexing",
            "Memory leaks in application",
            "Increasing user load without scaling",
            "Inefficient recent code changes",
            "Log files or temporary data accumulating",
            "Our monitoring server is overloaded"
          ]}
          solutions={[
            "Analyze database query performance and add indexes",
            "Review application memory usage patterns",
            "Consider scaling infrastructure (vertical or horizontal)",
            "Profile recent code deployments for performance regressions",
            "Clean up accumulated logs and temporary files"
          ]}
          prevention="Set up performance monitoring and regular capacity planning"
        />

        <TroubleshootCard
          problem="SSL/TLS Certificate Errors"
          severity="high"
          symptoms={[
            "Certificate verification failures",
            "SSL handshake timeout errors",
            "Certificate expired warnings"
          ]}
          causes={[
            "SSL certificate expired",
            "Certificate chain incomplete",
            "Wrong certificate installed",
            "SSL configuration issues"
          ]}
          solutions={[
            "Renew expired SSL certificates immediately",
            "Verify complete certificate chain is installed",
            "Check certificate matches the domain being monitored",
            "Test SSL configuration with online SSL checkers",
            "Ensure proper cipher suite configuration"
          ]}
          prevention="Set up certificate expiration alerts 30 days before expiry"
        />

        <TroubleshootCard
          problem="Network/Connection Errors"
          severity="high"
          symptoms={[
            "Connection refused errors",
            "DNS resolution failures",
            "Network timeout errors"
          ]}
          causes={[
            "Service not running or crashed",
            "DNS configuration problems",
            "Network connectivity issues",
            "Port not open or firewall blocking"
          ]}
          solutions={[
            "Verify service is running and listening on correct port",
            "Check DNS records are correct and propagated",
            "Test network connectivity from different locations",
            "Review firewall rules for monitoring IP ranges",
            "Confirm service is bound to public interface, not just localhost"
          ]}
          prevention="Set up proper infrastructure monitoring and alerting"
        />
      </div>
    </div>

    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Diagnostic Steps</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <DiagnosticCard
          title="Quick Diagnosis (2-5 minutes)"
          description="Fast checks to identify obvious problems"
          steps={[
            "Test endpoint manually in browser/Postman",
            "Check if service is running and responsive",
            "Verify DNS resolution works correctly",
            "Confirm expected status code matches reality",
            "Review recent deployments or changes"
          ]}
          when="Use when monitoring suddenly starts failing"
        />

        <DiagnosticCard
          title="Deep Diagnosis (15-30 minutes)"
          description="Comprehensive investigation for persistent issues"
          steps={[
            "Analyze server logs during failure periods",
            "Check resource usage (CPU, memory, disk, network)",
            "Review application performance metrics",
            "Test from multiple external locations",
            "Examine load balancer and proxy configurations",
            "Validate SSL certificates and security settings"
          ]}
          when="Use for intermittent or gradual degradation issues"
        />

        <DiagnosticCard
          title="Performance Analysis (30-60 minutes)"
          description="In-depth investigation of performance problems"
          steps={[
            "Profile database queries and connection pools",
            "Analyze application code for bottlenecks",
            "Review caching strategies and hit rates",
            "Examine external API dependencies",
            "Load test to identify capacity limits",
            "Compare performance with previous baselines"
          ]}
          when="Use when response times are consistently slow"
        />

        <DiagnosticCard
          title="Infrastructure Review (1-2 hours)"
          description="Comprehensive system health evaluation"
          steps={[
            "Review entire application stack configuration",
            "Audit security settings and access controls",
            "Validate backup and disaster recovery procedures",
            "Check monitoring and alerting coverage",
            "Assess capacity planning and scaling policies",
            "Document findings and create improvement plan"
          ]}
          when="Use after major incidents or during planned reviews"
        />
      </div>
    </div>

    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Prevention Strategies</h3>
      
      <div className="space-y-4">
        <PreventionCard
          strategy="Proactive Monitoring Setup"
          description="Set up monitoring that catches problems before they become critical"
          actions={[
            "Monitor key dependencies (databases, external APIs)",
            "Set up infrastructure monitoring (CPU, memory, disk)",
            "Create separate health check endpoints for monitoring",
            "Use realistic test data that exercises your full stack"
          ]}
        />

        <PreventionCard
          strategy="Regular Maintenance Schedule"
          description="Establish routines that prevent common problems"
          actions={[
            "Weekly dashboard reviews to identify trends",
            "Monthly SSL certificate expiration checks",
            "Quarterly performance baseline reviews",
            "Regular log cleanup and archival procedures"
          ]}
        />

        <PreventionCard
          strategy="Documentation & Change Management"
          description="Keep track of changes that might affect monitoring"
          actions={[
            "Document all monitoring configurations and reasons",
            "Note infrastructure changes that might affect endpoints",
            "Keep track of SSL certificate expiration dates",
            "Maintain contact information for emergency escalation"
          ]}
        />
      </div>
    </div>

    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-orange-400 mt-1" />
        <div>
          <h4 className="font-semibold text-orange-300 mb-2">When to Seek Help</h4>
          <p className="text-orange-200 text-sm mb-3">
            Some problems require additional expertise or tools beyond basic troubleshooting:
          </p>
          <ul className="text-orange-200 text-sm space-y-1 ml-4">
            <li>• Persistent performance issues affecting user experience</li>
            <li>• Security-related problems (certificate issues, authentication failures)</li>
            <li>• Infrastructure problems affecting multiple services</li>
            <li>• Issues that require specialized knowledge of your hosting platform</li>
          </ul>
          <p className="text-orange-200 text-sm mt-3">
            <strong>Remember:</strong> Monitoring shows symptoms, not always causes. Use it as a starting point for investigation. If you're stuck, reach out to your team or community for help. Troubleshooting is a team effort!
          </p>
        </div>
      </div>
    </div>
  </div>
)

const LimitsSection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold mb-4 flex items-center space-x-3">
        <Settings className="w-8 h-8 text-blue-400" />
        <span>Limits & Performance Guidelines</span>
      </h2>
      <p className="text-gray-300 text-lg leading-relaxed">
        Understanding platform limits, optimization strategies, and best practices for effective monitoring. Learn how to get the most value while staying within system constraints.
      </p>
    </div>

    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Platform Limits</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <LimitCard
          title="Workspace Limits"
          description="Organizational constraints for focused monitoring"
          limits={[
            "Maximum 5 workspaces per account",
            "Maximum 7 endpoints per workspace",
            "Workspace names up to 100 characters",
            "Descriptions up to 500 characters"
          ]}
          reasoning="Designed for solo developers to encourage focused, manageable monitoring setups"
        />
        
        <LimitCard
          title="Endpoint Limits"
          description="Configuration constraints for reliable monitoring"
          limits={[
            "Check frequency: 5-60 minutes",
            "Request timeout: 5-120 seconds",
            "Endpoint name: 100 characters max",
            "Request body: 10,000 characters max"
          ]}
          reasoning="Balances monitoring effectiveness with server resource usage"
        />
        
        <LimitCard
          title="Rate Limits"
          description="Usage constraints to ensure fair access and system stability"
          limits={[
            "Manual endpoint tests: 5 per minute",
            "Dashboard refreshes: 20 per minute", 
            "Workspace creation: 10 per 5 minutes",
            "Endpoint creation: 20 per 5 minutes",
            "General API requests: 100 per minute",
            "Authentication attempts: 20 per 5 minutes (per IP)"
          ]}
          reasoning="Prevents abuse while allowing normal usage patterns"
        />
        
        <LimitCard
          title="Data Retention"
          description="How long monitoring data is stored"
          limits={[
            "Detailed check results: 90 days",
            "Aggregated statistics: 1 year",
            "Incident records: 1 year",
            "Exported data: Your responsibility"
          ]}
          reasoning="Balances useful historical data with storage costs"
        />
      </div>
    </div>

    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Performance Optimization</h3>
      
      <div className="space-y-6">
        <OptimizationCard
          title="Optimal Check Frequency Strategy"
          description="Balance monitoring coverage with resource efficiency"
          icon={<Timer className="w-6 h-6 text-blue-400" />}
          recommendations={[
            {
              type: "Critical Services",
              frequency: "5-10 minutes",
              examples: "Payment processing, user authentication, core APIs",
              reasoning: "Immediate detection of issues affecting user experience"
            },
            {
              type: "Important Services", 
              frequency: "15-20 minutes (Recommended)",
              examples: "Main application APIs, user-facing features",
              reasoning: "Good balance of coverage and efficiency for most services"
            },
            {
              type: "Supporting Services",
              frequency: "30-45 minutes",
              examples: "Admin panels, documentation sites, internal tools",
              reasoning: "Adequate coverage for less critical infrastructure"
            },
            {
              type: "Development/Testing",
              frequency: "45-60 minutes",
              examples: "Staging environments, test APIs, experimental features",
              reasoning: "Basic coverage without overwhelming development resources"
            }
          ]}
        />

        <OptimizationCard
          title="Timeout Configuration Best Practices"
          description="Set realistic timeouts based on endpoint characteristics"
          icon={<Clock className="w-6 h-6 text-yellow-400" />}
          recommendations={[
            {
              type: "Fast Endpoints",
              frequency: "10-15 seconds",
              examples: "Health checks, status endpoints, static files",
              reasoning: "Should respond quickly; longer timeouts hide problems"
            },
            {
              type: "Standard APIs",
              frequency: "30-45 seconds",
              examples: "User data retrieval, search functionality, form submissions",
              reasoning: "Accounts for normal processing time plus network latency"
            },
            {
              type: "Heavy Processing",
              frequency: "60-90 seconds",
              examples: "Report generation, file uploads, complex calculations",
              reasoning: "Allows time for legitimate processing without false positives"
            },
            {
              type: "Database Operations",
              frequency: "45-120 seconds",
              examples: "Data imports, backup verification, maintenance endpoints",
              reasoning: "Database operations can be slow, especially during maintenance"
            }
          ]}
        />
      </div>
    </div>

    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Resource Management</h3>
      
      <div className="space-y-6">
        <ResourceCard
          title="Monitoring Overhead on Your Servers"
          description="Understanding the impact of monitoring on your infrastructure"
          impact={[
            "Each check creates one HTTP request to your server",
            "Monitoring at 15-minute intervals = 96 requests per day per endpoint",
            "7 endpoints per workspace = 672 requests per day per workspace",
            "Minimal CPU/memory impact for simple health check endpoints"
          ]}
          optimization={[
            "Create dedicated /health endpoints that bypass heavy processing",
            "Use caching for health check responses when possible",
            "Monitor with HEAD requests for static assets to reduce bandwidth",
            "Consider CDN or load balancer health checks for redundancy"
          ]}
        />

        <ResourceCard
          title="Cost-Effective Monitoring Strategies"
          description="Maximize monitoring value while minimizing resource usage"
          impact={[
            "Focus on user-facing functionality rather than internal processes",
            "Monitor dependencies through your own health endpoints",
            "Use fewer, more comprehensive health checks instead of many simple ones",
            "Group related functionality into single endpoint checks when possible"
          ]}
          optimization={[
            "Implement health endpoints that check multiple dependencies",
            "Use appropriate check frequencies based on service criticality",
            "Monitor production more frequently than staging/development",
            "Export data monthly to reduce real-time dashboard queries"
          ]}
        />
      </div>
    </div>

    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Advanced Best Practices</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <AdvancedPracticeCard
          title="Monitoring Architecture"
          description="Structure your monitoring for maximum effectiveness"
          practices={[
            "Create tiered monitoring (critical → important → supporting)",
            "Use workspace separation to isolate different environments",
            "Implement health endpoints that aggregate dependency status",
            "Design monitoring to fail gracefully when dependencies are down"
          ]}
          benefits="Reduces noise, focuses attention on what matters most"
        />

        <AdvancedPracticeCard
          title="Alert Management"
          description="Configure monitoring to provide actionable insights"
          practices={[
            "Monitor outcomes, not just availability (can users complete tasks?)",
            "Set realistic expectations based on SLA requirements",
            "Focus on user-impacting issues rather than internal metrics",
            "Use monitoring data to improve infrastructure, not just react to problems"
          ]}
          benefits="Reduces false positives, improves incident response"
        />

        <AdvancedPracticeCard
          title="Data Utilization"
          description="Get maximum value from your monitoring data"
          practices={[
            "Export data monthly for trend analysis and reporting",
            "Use uptime statistics to demonstrate reliability to stakeholders",
            "Identify performance patterns to optimize infrastructure timing",
            "Track improvements after infrastructure changes"
          ]}
          benefits="Demonstrates value, guides infrastructure decisions"
        />

        <AdvancedPracticeCard
          title="Scalability Planning"
          description="Prepare monitoring for growth"
          practices={[
            "Start with core functionality, expand monitoring as you grow",
            "Use performance trends to plan capacity improvements",
            "Document monitoring configurations for team knowledge sharing",
            "Regularly review and optimize monitoring based on changing needs"
          ]}
          benefits="Ensures monitoring grows with your business needs"
        />
      </div>
    </div>

    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <Zap className="w-6 h-6 text-blue-400 mt-1" />
        <div>
          <h4 className="font-semibold text-blue-300 mb-2">Optimization Summary</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-blue-200 mb-2">⚡ Quick Wins:</h5>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Use 15-20 minute frequency for most endpoints</li>
                <li>• Create dedicated health check endpoints</li>
                <li>• Monitor user-facing functionality first</li>
                <li>• Export data monthly for analysis</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-200 mb-2">🎯 Long-term Strategy:</h5>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Build tiered monitoring based on criticality</li>
                <li>• Use monitoring data to guide infrastructure decisions</li>
                <li>• Document configurations for team knowledge</li>
                <li>• Regularly review and optimize based on growth</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Enhanced Helper Components
const StepCard: React.FC<{ 
  step: number; 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  details: string[];
}> = ({ step, title, description, icon, details }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <div className="flex items-start space-x-4 mb-4">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          {icon}
          <h4 className="font-semibold text-lg">{title}</h4>
        </div>
        <p className="text-gray-400 mb-3">{description}</p>
      </div>
    </div>
    <ul className="space-y-1 ml-12">
      {details.map((detail, index) => (
        <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
          <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0 mt-2" />
          <span>{detail}</span>
        </li>
      ))}
    </ul>
  </div>
)

const SecurityCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  practices: string[];
  example?: { good: string; bad: string };
}> = ({ title, description, icon, practices, example }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <div className="flex items-center space-x-3 mb-3">
      {icon}
      <h4 className="font-semibold text-lg">{title}</h4>
    </div>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="space-y-3">
      <div>
        <h5 className="font-medium text-green-300 mb-2">Best Practices:</h5>
        <ul className="space-y-1">
          {practices.map((practice, index) => (
            <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
              <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
              <span>{practice}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {example && (
        <div className="mt-4">
          <h5 className="font-medium text-gray-300 mb-2">Examples:</h5>
          <div className="space-y-2">
            <div className="p-2 bg-green-500/10 border border-green-500/30 rounded text-xs">
              <span className="text-green-300">✅ Good: </span>
              <code className="text-green-200">{example.good}</code>
            </div>
            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-xs">
              <span className="text-red-300">❌ Bad: </span>
              <code className="text-red-200">{example.bad}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)

const ExampleCard: React.FC<{
  title: string;
  description: string;
  config: any;
  explanation: string;
  security?: string;
  note?: string;
}> = ({ title, description, config, explanation, security, note }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-semibold text-lg text-green-300">{title}</h4>
      <Copy className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
    </div>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="bg-black/50 p-4 rounded-lg mb-4 overflow-x-auto">
      <pre className="text-xs text-gray-300">
        <code>{JSON.stringify(config, null, 2)}</code>
      </pre>
    </div>
    
    <p className="text-gray-300 text-sm mb-3">{explanation}</p>
    
    {security && (
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-sm text-yellow-200">
        {security}
      </div>
    )}
    
    {note && (
      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm text-blue-200 mt-2">
        {note}
      </div>
    )}
  </div>
)

const PatternCard: React.FC<{ title: string; patterns: string[] }> = ({ title, patterns }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <h4 className="font-semibold text-lg mb-4 text-purple-300">{title}</h4>
    <ul className="space-y-2">
      {patterns.map((pattern, index) => (
        <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
          <Globe className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
          <code className="text-purple-200">{pattern}</code>
        </li>
      ))}
    </ul>
  </div>
)

const MetricCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  calculation: string;
  details: string[];
  actionable: string;
}> = ({ title, description, icon, calculation, details, actionable }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <div className="flex items-center space-x-3 mb-3">
      {icon}
      <h4 className="font-semibold text-lg">{title}</h4>
    </div>
    <p className="text-gray-400 text-sm mb-3">{description}</p>
    
    <div className="space-y-3">
      <div>
        <h5 className="font-medium text-blue-300 text-sm mb-1">Calculation:</h5>
        <p className="text-blue-200 text-xs font-mono bg-blue-500/10 p-2 rounded">{calculation}</p>
      </div>
      
      <div>
        <h5 className="font-medium text-gray-300 text-sm mb-2">Key Points:</h5>
        <ul className="space-y-1">
          {details.map((detail, index) => (
            <li key={index} className="text-xs text-gray-400 flex items-start space-x-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0 mt-1.5" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded">
        <h5 className="font-medium text-orange-300 text-xs mb-1">When to Act:</h5>
        <p className="text-orange-200 text-xs">{actionable}</p>
      </div>
    </div>
  </div>
)

const AlertTriggerCard: React.FC<{
  condition: string;
  description: string;
  examples: string[];
  troubleshooting: string;
}> = ({ condition, description, examples, troubleshooting }) => (
  <div className="p-6 bg-red-500/5 rounded-lg border border-red-500/20">
    <h4 className="font-semibold text-red-300 mb-2">{condition}</h4>
    <p className="text-red-200 text-sm mb-3">{description}</p>
    
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h5 className="font-medium text-orange-300 text-sm mb-2">Common Examples:</h5>
        <ul className="space-y-1">
          {examples.map((example, index) => (
            <li key={index} className="text-xs text-gray-400 flex items-start space-x-2">
              <AlertTriangle className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" />
              <span>{example}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h5 className="font-medium text-green-300 text-sm mb-2">Troubleshooting:</h5>
        <p className="text-green-200 text-xs">{troubleshooting}</p>
      </div>
    </div>
  </div>
)

const InterpretationCard: React.FC<{
  scenario: string;
  indicators: string[];
  likely_causes: string[];
  actions: string[];
}> = ({ scenario, indicators, likely_causes, actions }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <h4 className="font-semibold text-yellow-300 text-lg mb-3">{scenario}</h4>
    
    <div className="grid md:grid-cols-3 gap-4">
      <div>
        <h5 className="font-medium text-blue-300 text-sm mb-2">Indicators:</h5>
        <ul className="space-y-1">
          {indicators.map((indicator, index) => (
            <li key={index} className="text-xs text-gray-300 flex items-start space-x-2">
              <Eye className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>{indicator}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h5 className="font-medium text-orange-300 text-sm mb-2">Likely Causes:</h5>
        <ul className="space-y-1">
          {likely_causes.map((cause, index) => (
            <li key={index} className="text-xs text-gray-300 flex items-start space-x-2">
              <AlertTriangle className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" />
              <span>{cause}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h5 className="font-medium text-green-300 text-sm mb-2">Actions:</h5>
        <ul className="space-y-1">
          {actions.map((action, index) => (
            <li key={index} className="text-xs text-gray-300 flex items-start space-x-2">
              <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode; points: string[] }> = ({ title, description, icon, points }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <div className="flex items-center space-x-3 mb-3">
      {icon}
      <h4 className="font-semibold">{title}</h4>
    </div>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    <ul className="space-y-1">
      {points.map((point, index) => (
        <li key={index} className="text-sm text-gray-300 flex items-center space-x-2">
          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </div>
)

const InfoCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
    <h5 className="font-medium mb-1">{title}</h5>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
)

// Additional helper components for the new sections
const ConfigFieldCard: React.FC<{
  title: string;
  description: string;
  tips: string[];
  examples: string[];
}> = ({ title, description, tips, examples }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <h4 className="font-semibold text-lg text-green-300 mb-2">{title}</h4>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="space-y-4">
      <div>
        <h5 className="font-medium text-blue-300 text-sm mb-2">Tips:</h5>
        <ul className="space-y-1">
          {tips.map((tip, index) => (
            <li key={index} className="text-xs text-gray-300 flex items-start space-x-2">
              <Lightbulb className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h5 className="font-medium text-gray-300 text-sm mb-2">Examples:</h5>
        <ul className="space-y-1">
          {examples.map((example, index) => (
            <li key={index} className="text-xs font-mono">
              <code className={example.startsWith('✅') ? 'text-green-300' : 'text-red-300'}>
                {example}
              </code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

const AdvancedConfigCard: React.FC<{
  title: string;
  description: string;
  recommendation: string;
  details: string[];
  warning: string;
}> = ({ title, description, recommendation, details, warning }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-400 text-sm mb-3">{description}</p>
    
    <div className="space-y-4">
      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
        <h5 className="font-medium text-green-300 text-sm mb-1">Recommended:</h5>
        <p className="text-green-200 text-sm">{recommendation}</p>
      </div>
      
      <div>
        <h5 className="font-medium text-gray-300 text-sm mb-2">Guidelines:</h5>
        <ul className="space-y-1">
          {details.map((detail, index) => (
            <li key={index} className="text-xs text-gray-400 flex items-start space-x-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0 mt-1.5" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
        <h5 className="font-medium text-yellow-300 text-sm mb-1">Important:</h5>
        <p className="text-yellow-200 text-sm">{warning}</p>
      </div>
    </div>
  </div>
)

const BestPracticeCard: React.FC<{
  title: string;
  description: string;
  practices: string[];
}> = ({ title, description, practices }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    <ul className="space-y-2">
      {practices.map((practice, index) => (
        <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
          <span>{practice}</span>
        </li>
      ))}
    </ul>
  </div>
)

const DashboardFeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  usage: string;
}> = ({ title, description, icon, features, usage }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <div className="flex items-center space-x-3 mb-3">
      {icon}
      <h4 className="font-semibold text-lg">{title}</h4>
    </div>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="space-y-4">
      <div>
        <h5 className="font-medium text-blue-300 text-sm mb-2">Features:</h5>
        <ul className="space-y-1">
          {features.map((feature, index) => (
            <li key={index} className="text-xs text-gray-300 flex items-start space-x-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0 mt-1.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded">
        <h5 className="font-medium text-purple-300 text-sm mb-1">How to Use:</h5>
        <p className="text-purple-200 text-sm">{usage}</p>
      </div>
    </div>
  </div>
)

const AdvancedFeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  formats: Array<{
    name: string;
    description: string;
    use_case: string;
  }>;
  tips: string[];
}> = ({ title, description, icon, formats, tips }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <div className="flex items-center space-x-3 mb-4">
      {icon}
      <h4 className="font-semibold text-lg">{title}</h4>
    </div>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {formats.map((format, index) => (
          <div key={index} className="p-3 bg-white/5 rounded border border-white/10">
            <h5 className="font-medium text-green-300 text-sm mb-1">{format.name}</h5>
            <p className="text-gray-400 text-xs mb-2">{format.description}</p>
            <p className="text-blue-300 text-xs"><strong>Use for:</strong> {format.use_case}</p>
          </div>
        ))}
      </div>
      
      <div>
        <h5 className="font-medium text-yellow-300 text-sm mb-2">Tips:</h5>
        <ul className="space-y-1">
          {tips.map((tip, index) => (
            <li key={index} className="text-xs text-gray-300 flex items-start space-x-2">
              <Lightbulb className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

const DataInterpretationCard: React.FC<{
  metric: string;
  timeframe: string;
  interpretation: string[];
  actions: string[];
}> = ({ metric, timeframe, interpretation, actions }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <h4 className="font-semibold text-lg text-blue-300 mb-2">{metric}</h4>
    <p className="text-gray-400 text-sm mb-4">{timeframe}</p>
    
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h5 className="font-medium text-orange-300 text-sm mb-2">What It Means:</h5>
        <ul className="space-y-1">
          {interpretation.map((item, index) => (
            <li key={index} className="text-xs text-gray-300 flex items-start space-x-2">
              <Eye className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h5 className="font-medium text-green-300 text-sm mb-2">What To Do:</h5>
        <ul className="space-y-1">
          {actions.map((action, index) => (
            <li key={index} className="text-xs text-gray-300 flex items-start space-x-2">
              <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

const TroubleshootCard: React.FC<{
  problem: string;
  severity: 'high' | 'medium' | 'low';
  symptoms: string[];
  causes: string[];
  solutions: string[];
  prevention: string;
}> = ({ problem, severity, symptoms, causes, solutions, prevention }) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'high': return 'border-red-500/30 bg-red-500/5'
      case 'medium': return 'border-yellow-500/30 bg-yellow-500/5'
      case 'low': return 'border-blue-500/30 bg-blue-500/5'
    }
  }

  const getSeverityTextColor = () => {
    switch (severity) {
      case 'high': return 'text-red-300'
      case 'medium': return 'text-yellow-300'
      case 'low': return 'text-blue-300'
    }
  }

  return (
    <div className={`p-6 rounded-lg border ${getSeverityColor()}`}>
      <div className="flex items-center space-x-2 mb-3">
        <h4 className={`font-semibold text-lg ${getSeverityTextColor()}`}>{problem}</h4>
        <span className={`text-xs px-2 py-1 rounded ${getSeverityTextColor()} border border-current`}>
          {severity.toUpperCase()}
        </span>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <h5 className="font-medium text-red-300 text-sm mb-2">Symptoms:</h5>
          <ul className="space-y-1">
            {symptoms.map((symptom, index) => (
              <li key={index} className="text-xs text-gray-400 flex items-start space-x-2">
                <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium text-orange-300 text-sm mb-2">Likely Causes:</h5>
          <ul className="space-y-1">
            {causes.map((cause, index) => (
              <li key={index} className="text-xs text-gray-400 flex items-start space-x-2">
                <HelpCircle className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" />
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium text-green-300 text-sm mb-2">Solutions:</h5>
          <ul className="space-y-1">
            {solutions.map((solution, index) => (
              <li key={index} className="text-xs text-gray-400 flex items-start space-x-2">
                <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                <span>{solution}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
        <h5 className="font-medium text-blue-300 text-sm mb-1">Prevention:</h5>
        <p className="text-blue-200 text-sm">{prevention}</p>
      </div>
    </div>
  )
}

const DiagnosticCard: React.FC<{
  title: string;
  description: string;
  steps: string[];
  when: string;
}> = ({ title, description, steps, when }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="space-y-4">
      <div>
        <h5 className="font-medium text-blue-300 text-sm mb-2">Steps:</h5>
        <ol className="space-y-1">
          {steps.map((step, index) => (
            <li key={index} className="text-xs text-gray-300 flex items-start space-x-2">
              <span className="text-blue-400 font-mono flex-shrink-0 mt-0.5">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      
      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded">
        <h5 className="font-medium text-purple-300 text-sm mb-1">When to Use:</h5>
        <p className="text-purple-200 text-sm">{when}</p>
      </div>
    </div>
  </div>
)

const PreventionCard: React.FC<{
  strategy: string;
  description: string;
  actions: string[];
}> = ({ strategy, description, actions }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <h4 className="font-semibold text-lg text-green-300 mb-2">{strategy}</h4>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    <ul className="space-y-2">
      {actions.map((action, index) => (
        <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
          <Shield className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
          <span>{action}</span>
        </li>
      ))}
    </ul>
  </div>
)

const LimitCard: React.FC<{
  title: string;
  description: string;
  limits: string[];
  reasoning: string;
}> = ({ title, description, limits, reasoning }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="space-y-4">
      <div>
        <h5 className="font-medium text-blue-300 text-sm mb-2">Limits:</h5>
        <ul className="space-y-1">
          {limits.map((limit, index) => (
            <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1.5" />
              <span>{limit}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-3 bg-gray-500/10 border border-gray-500/30 rounded">
        <h5 className="font-medium text-gray-300 text-sm mb-1">Why These Limits:</h5>
        <p className="text-gray-400 text-sm">{reasoning}</p>
      </div>
    </div>
  </div>
)

const OptimizationCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  recommendations: Array<{
    type: string;
    frequency: string;
    examples: string;
    reasoning: string;
  }>;
}> = ({ title, description, icon, recommendations }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <div className="flex items-center space-x-3 mb-4">
      {icon}
      <h4 className="font-semibold text-lg">{title}</h4>
    </div>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <div key={index} className="p-4 bg-white/5 rounded border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-blue-300">{rec.type}</h5>
            <span className="text-sm font-mono bg-blue-500/10 text-blue-300 px-2 py-1 rounded">
              {rec.frequency}
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-2">
            <strong>Examples:</strong> {rec.examples}
          </p>
          <p className="text-gray-300 text-xs">{rec.reasoning}</p>
        </div>
      ))}
    </div>
  </div>
)

const ResourceCard: React.FC<{
  title: string;
  description: string;
  impact: string[];
  optimization: string[];
}> = ({ title, description, impact, optimization }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h5 className="font-medium text-orange-300 text-sm mb-2">Impact:</h5>
        <ul className="space-y-1">
          {impact.map((item, index) => (
            <li key={index} className="text-xs text-gray-400 flex items-start space-x-2">
              <AlertTriangle className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h5 className="font-medium text-green-300 text-sm mb-2">Optimization:</h5>
        <ul className="space-y-1">
          {optimization.map((item, index) => (
            <li key={index} className="text-xs text-gray-400 flex items-start space-x-2">
              <Zap className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

const AdvancedPracticeCard: React.FC<{
  title: string;
  description: string;
  practices: string[];
  benefits: string;
}> = ({ title, description, practices, benefits }) => (
  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="space-y-4">
      <div>
        <h5 className="font-medium text-blue-300 text-sm mb-2">Practices:</h5>
        <ul className="space-y-1">
          {practices.map((practice, index) => (
            <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
              <CheckCircle className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>{practice}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
        <h5 className="font-medium text-green-300 text-sm mb-1">Benefits:</h5>
        <p className="text-green-200 text-sm">{benefits}</p>
      </div>
    </div>
  </div>
)

export default DocsPage