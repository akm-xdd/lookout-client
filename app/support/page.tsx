// app/support/page.tsx
'use client'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { 
  Mail, 
  MessageCircle, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Bug, 
  Lightbulb, 
  Shield, 
  Database, 
  Globe, 
  Github, 
  BookOpen, 
  Copy, 
  ExternalLink,
  Heart,
  User,
  Settings,
  HelpCircle,
  Zap,
  Coffee
} from 'lucide-react'
import Link from 'next/link'

// Layout Components
import Navbar from '@/app/_components/layout/Navbar'
import Footer from '@/app/_components/layout/Footer'
import AnimatedBackground from '@/app/_components/layout/AnimatedBackground'

const SupportPage: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('ctfu.anand@outlook.com')
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

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
            <HelpCircle className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Support & Help
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get help, report issues, or just say hi. I'm here to help make your monitoring experience as smooth as possible.
          </p>
        </motion.div>

        {/* Honest Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <div>
                <h3 className="text-2xl font-semibold text-blue-300 mb-4">A Personal Note</h3>
                <p className="text-blue-200 text-lg leading-relaxed mb-4">
                  Hi! I'm Anand, the solo developer behind LookOut. This project started as my personal solution for keeping my side projects alive on free hosting platforms, and I've shared it hoping it helps other developers too. I am currently looking for my next opportunity, so if you like what you see, feel free to <span><a href="mailto:ctfu.anand@outlook.com" className="text-blue-400 hover:underline">reach out</a></span>!
                </p>
                <p className="text-blue-200 leading-relaxed mb-4">
                  <strong>Let's be honest:</strong> I'm one person building this in my spare time, completely vibe coding late at night with coffee and good music. I am doing this for free and don't have the money, a team, or extensive resources to test everything thoroughly and catch every issue. I'll occasionally mess up, miss edge cases, or ship bugs.
                  When that happens, I'm committed to fixing things quickly and learning from mistakes. Your patience and feedback make this project better for everyone.

                  I will eventually run out of resources, and maybe need to put my foot down on this project, because I can't keep running it forever for free. And I really wish to keep it free for everyone. There is simply no other way I would want LookOut to be. For more, please visit the <a href="/tos" className="text-blue-400 hover:underline">About</a> page.
                </p>
                <p className="text-blue-200 leading-relaxed">
                  Whether you're reporting a bug, need help with configuration, or just want to share feedback, I genuinely appreciate you taking the time to reach out. Every message helps me understand how to improve LookOut.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Primary Contact */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-semibold">Email Support</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Best for detailed questions, bug reports, or anything that needs a thoughtful response.
              </p>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <code className="text-green-300 text-lg">ctfu.anand@outlook.com</code>
                  <button
                    onClick={copyEmail}
                    className="p-2 text-green-400 hover:text-green-300 transition-colors"
                    title="Copy email"
                  >
                    {copiedEmail ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Response time: Usually within 24-48 hours</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">Time zone: IST (GMT+5:30)</span>
                </div>
              </div>
            </div>

            {/* Alternative Channels */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Github className="w-6 h-6 text-gray-400" />
                <h3 className="text-xl font-semibold">GitHub Issues</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Perfect for bug reports, feature requests, or technical discussions. Open and transparent.
              </p>
              
              <a 
                href="https://github.com/akm-xdd/lookout-client/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors mb-6"
              >
                <Github className="w-5 h-5" />
                <span>Open an Issue</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Public discussion helps everyone</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <BookOpen className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Great for feature requests</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Support Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">What Can I Help With?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SupportCategoryCard
              icon={<Bug className="w-6 h-6 text-red-400" />}
              title="Bug Reports"
              description="Something broken? Not working as expected?"
              priority="High Priority"
              examples={[
                "Endpoints not monitoring correctly",
                "Dashboard data not loading",
                "Error messages during setup",
                "Authentication problems"
              ]}
              response="Usually fixed within 1-3 days"
            />

            <SupportCategoryCard
              icon={<HelpCircle className="w-6 h-6 text-blue-400" />}
              title="Configuration Help"
              description="Need help setting up monitoring properly?"
              priority="Normal Priority"
              examples={[
                "Endpoint configuration questions",
                "Authentication setup",
                "Workspace organization",
                "Best practices guidance"
              ]}
              response="Detailed response within 24-48 hours"
            />

            <SupportCategoryCard
              icon={<Lightbulb className="w-6 h-6 text-yellow-400" />}
              title="Feature Requests"
              description="Ideas for making LookOut better?"
              priority="Evaluated Carefully"
              examples={[
                "New monitoring features",
                "Dashboard improvements",
                "Integration suggestions",
                "Workflow enhancements"
              ]}
              response="Discussion and roadmap consideration"
            />

            <SupportCategoryCard
              icon={<Shield className="w-6 h-6 text-green-400" />}
              title="Security Concerns"
              description="Found a security issue? Please tell me."
              priority="Critical Priority"
              examples={[
                "Potential vulnerabilities",
                "Data privacy questions",
                "Authentication bypasses",
                "Sensitive data exposure"
              ]}
              response="Immediate response and fix"
            />

            <SupportCategoryCard
              icon={<Database className="w-6 h-6 text-purple-400" />}
              title="Data Questions"
              description="Questions about your monitoring data?"
              priority="Normal Priority"
              examples={[
                "Data export help",
                "Historical data questions",
                "Metric interpretation",
                "Report generation"
              ]}
              response="Helpful explanation within 24 hours"
            />

            <SupportCategoryCard
              icon={<Heart className="w-6 h-6 text-pink-400" />}
              title="General Feedback"
              description="Thoughts, suggestions, or just want to chat?"
              priority="Always Welcome"
              examples={[
                "Overall experience feedback",
                "Design suggestions",
                "Documentation improvements",
                "Success stories"
              ]}
              response="Appreciated and considered for roadmap"
            />
          </div>
        </motion.div>

        {/* How to Report Effectively */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">How to Get the Best Help</h2>
          
          <div className="space-y-8">
            <EffectiveReportingCard
              type="🐛 Bug Reports"
              description="Help me understand and reproduce the issue quickly"
              template={`Subject: [BUG] Brief description of the issue

**What happened:**
Describe what you were trying to do and what went wrong.

**Steps to reproduce:**
1. Go to...
2. Click on...
3. See error...

**Expected behavior:**
What should have happened instead?

**Environment:**
- Browser: Chrome/Firefox/Safari + version
- Operating System: Windows/Mac/Linux
- Time when it occurred: (helps me check logs)

**Screenshots/Error messages:**
Include any error messages or screenshots if helpful.

**Additional context:**
Anything else that might be relevant?`}
            />

            <EffectiveReportingCard
              type="❓ Configuration Help"
              description="Provide context so I can give you the best guidance"
              template={`Subject: [HELP] Configuration question about...

**What I'm trying to achieve:**
Describe your monitoring goal.

**What I've tried:**
- Attempted configuration A...
- Tried approach B...
- Looked at documentation section X...

**Current setup:**
- Type of service/API I'm monitoring
- Authentication method if any
- Expected behavior

**Specific question:**
What exactly are you stuck on?

**Constraints:**
Any limitations or requirements I should know about?`}
            />

            <EffectiveReportingCard
              type="💡 Feature Requests"
              description="Help me understand the value and use case"
              template={`Subject: [FEATURE] Brief description of the feature

**Problem/Use case:**
What problem would this solve? Why do you need this?

**Proposed solution:**
How do you envision this working?

**Alternative solutions:**
Are there any workarounds you've considered?

**Additional context:**
- How many users might benefit from this?
- How critical is this for your workflow?
- Any examples from other tools?

**Mockups/Examples:**
If you have any visual ideas or examples, please share!`}
            />
          </div>
        </motion.div>

        {/* Response Expectations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">What to Expect</h2>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-300">What I Promise</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-gray-300">I'll read every message personally</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-gray-300">Honest assessment of timelines</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-gray-300">Updates if fixes take longer than expected</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-gray-300">Acknowledgment within 24-48 hours</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-gray-300">Transparent communication about limitations</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-orange-300">Reality Check</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
                    <span className="text-gray-300">I work on this in my spare time</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
                    <span className="text-gray-300">Some features may take weeks/months</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
                    <span className="text-gray-300">Complex requests might not be feasible</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
                    <span className="text-gray-300">Response times vary during busy periods</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
                    <span className="text-gray-300">Some bugs might require architectural changes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Self-Help Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Try These First</h2>
          <p className="text-center text-gray-400 mb-8">
            You might find your answer faster in these resources:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <SelfHelpCard
              icon={<BookOpen className="w-6 h-6 text-blue-400" />}
              title="Documentation"
              description="Comprehensive guides and examples"
              link="/docs"
              linkText="Browse Docs"
              coverage={[
                "Getting started guide",
                "Configuration examples",
                "Troubleshooting common issues",
                "Best practices and tips"
              ]}
            />

            <SelfHelpCard
              icon={<Github className="w-6 h-6 text-gray-400" />}
              title="GitHub Issues"
              description="Community discussions and known issues"
              link="https://github.com/akm-xdd/lookout-client/issues"
              linkText="Browse Issues"
              external={true}
              coverage={[
                "Known bugs and workarounds",
                "Feature request discussions",
                "Community solutions",
                "Development roadmap"
              ]}
            />

            <SelfHelpCard
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Quick Diagnostics"
              description="Common fixes you can try right now"
              link="#diagnostics"
              linkText="Try These"
              coverage={[
                "Test endpoint manually",
                "Check recent configuration changes",
                "Verify authentication setup",
                "Review error messages"
              ]}
            />
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-8 h-8 text-red-400 mt-1" />
              <div>
                <h3 className="text-2xl font-semibold text-red-300 mb-4">Security Issues & Emergencies</h3>
                <p className="text-red-200 leading-relaxed mb-4">
                  If you've discovered a security vulnerability or there's a critical issue affecting user data, please contact me immediately at{" "}
                  <button
                    onClick={copyEmail}
                    className="underline hover:no-underline font-semibold"
                  >
                    ctfu.anand@outlook.com
                  </button>
                  {" "}with "SECURITY" or "URGENT" in the subject line.
                </p>
                <p className="text-red-200 text-sm">
                  I monitor my email regularly and will respond to security issues within a few hours, even outside normal hours.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Closing Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center mt-16"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Coffee className="w-6 h-6 text-yellow-400" />
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-gray-400 leading-relaxed">
              Thanks for using LookOut and for taking the time to reach out when you need help. 
              Every question, bug report, and piece of feedback makes this project better. 
              Building useful tools for the developer community is what makes this worthwhile.
            </p>
            <p className="text-gray-500 text-sm mt-4">
              – Anand
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Helper Components
const SupportCategoryCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  priority: string;
  examples: string[];
  response: string;
}> = ({ icon, title, description, priority, examples, response }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
    <div className="flex items-center space-x-3 mb-3">
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="space-y-4">
      <div>
        <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full mb-3">
          {priority}
        </div>
        <h4 className="font-medium text-sm mb-2">Examples:</h4>
        <ul className="space-y-1">
          {examples.map((example, index) => (
            <li key={index} className="text-xs text-gray-400 flex items-start space-x-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0 mt-1.5" />
              <span>{example}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="pt-3 border-t border-white/10">
        <p className="text-xs text-gray-500">
          <strong>Typical response:</strong> {response}
        </p>
      </div>
    </div>
  </div>
)

const EffectiveReportingCard: React.FC<{
  type: string;
  description: string;
  template: string;
}> = ({ type, description, template }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
    <h3 className="text-xl font-semibold mb-2">{type}</h3>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="bg-black/50 rounded-lg p-4">
      <pre className="text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto">
        {template}
      </pre>
    </div>
  </div>
)

const SelfHelpCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
  external?: boolean;
  coverage: string[];
}> = ({ icon, title, description, link, linkText, external = false, coverage }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
    <div className="flex items-center space-x-3 mb-3">
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <ul className="space-y-2 mb-6">
      {coverage.map((item, index) => (
        <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
    
    {external ? (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
      >
        <span>{linkText}</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    ) : (
      <Link href={link} className="text-blue-400 hover:text-blue-300 transition-colors">
        {linkText}
      </Link>
    )}
  </div>
)

export default SupportPage