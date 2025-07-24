// app/about/page.tsx
'use client'
import React from 'react'
import { motion } from 'motion/react'
import { 
  Heart, 
  Code, 
  Coffee, 
  Globe, 
  Shield, 
  BarChart3, 
  Zap, 
  User, 
  Mail, 
  Github, 
  MapPin, 
  Briefcase,
  Server,
  Database,
  Cloud,
  Lightbulb,
  Target,
  Clock,
  DollarSign,
  AlertTriangle,
  Sparkles,
  Rocket
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Layout Components
import Navbar from '@/app/_components/layout/Navbar'
import AnimatedBackground from '@/app/_components/layout/AnimatedBackground'

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground particleCount={40} />
      
      <Navbar 
        onLoginClick={() => window.location.href = '/login'}
        onGetStartedClick={() => window.location.href = '/register'}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            About LookOut
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            The brutally honest story of a side project that accidentally became useful, 
            built by a developer who just wanted to keep his apps from sleeping.
          </p>
        </motion.div>

        {/* About LookOut Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold">What is LookOut?</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-300">What it Actually Does</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <span className="text-gray-300">Keeps your free-tier apps awake by pinging them regularly</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <BarChart3 className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-gray-300">Monitors uptime and response times with pretty charts</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-blue-400 mt-0.5" />
                    <span className="text-gray-300">Tracks up to 35 endpoints across 5 workspaces (because why not?)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
                    <span className="text-gray-300">Gives you data to prove your side projects actually work</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-purple-300">What it's Really About</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <Heart className="w-5 h-5 text-pink-400 mt-0.5" />
                    <span className="text-gray-300">Built by a solo dev, for solo devs who get it</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Coffee className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <span className="text-gray-300">Completely vibe-coded - features exist because they felt right</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-gray-300">100% free forever (because I'm not trying to pay rent with this)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
                    <span className="text-gray-300">Zero enterprise ambitions - this isn't competing with Datadog</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-6 h-6 text-yellow-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-300 mb-2">The Honest Truth</h4>
                  <p className="text-yellow-200 leading-relaxed">
                    This started when I was checking if the take-home project I built for an interview was still working. I realized that Supabase decided to pause my free-tier database after 7 days of inactivity, which is fair enough. But I wanted to keep my side projects alive without paying for hosting, so I built a simple uptime monitor to ping my Supabase DB and keep it awake. Then I thought, "I can probably do something for other projects too." And then I thought, "I can probably make it look nice and share it with others." And here we are.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* About Me Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold">Who makes this?</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Photo and Basic Info */}
              <div className="md:col-span-1">
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  {/* Photo Placeholder */}
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
                    <Image src="/pfp.jpg" alt="Profile Placeholder" className="w-24 h-24 rounded-full" width={96} height={96} />
                    <span className="sr-only">Profile photo placeholder</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">Anand Mishra</h3>
                  <p className="text-gray-400 mb-4 text-sm">Backend Developer | Frontend Admirer</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">New Delhi, India</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">Actively Job Hunting</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Coffee className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">Caffeine Dependent</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4 mt-6">
                    <a 
                      href="mailto:ctfu.anand@outlook.com"
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      title="Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://github.com/akm-xdd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Skills and What I Do */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-300">What I Actually Know</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <SkillCard
                      icon={<Server className="w-5 h-5 text-green-400" />}
                      title="Backend"
                      skills={["Python/FastAPI/Django", "Node.js", "REST APIs", "PostgreSQL"]}
                    />
                    <SkillCard
                      icon={<Code className="w-5 h-5 text-blue-400" />}
                      title="Frontend"
                      skills={["React/Next.js", "TypeScript", "Tailwind CSS"]}
                    />
                    <SkillCard
                      icon={<Database className="w-5 h-5 text-purple-400" />}
                      title="Database"
                      skills={["Supabase", "MongoDB", "Redis", "SQL"]}
                    />
                    <SkillCard
                      icon={<Cloud className="w-5 h-5 text-yellow-400" />}
                      title="DevOps"
                      skills={["Docker", "AWS", "Vercel", "CI/CD"]}
                    />
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <Briefcase className="w-6 h-6 text-green-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-300 mb-2">Currently Job Hunting 🎯</h4>
                      <p className="text-green-200 text-sm leading-relaxed mb-3">
                        I'm actively looking for Software Engineer opportunities where I can build meaningful products and work with great teams. 
                        If you're hiring and like what you see here, let's chat!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-green-400/20 text-green-300 text-xs rounded-full">Remote Friendly</span>
                        <span className="px-3 py-1 bg-green-400/20 text-green-300 text-xs rounded-full">Full-Stack</span>
                        <span className="px-3 py-1 bg-green-400/20 text-green-300 text-xs rounded-full">Product-Focused</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-300">My Development Philosophy</h3>
                  <div className="space-y-3 text-gray-300">
                    <p className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-pink-400 mt-0.5" />
                      <span>Build things that solve real problems, even if they're small problems</span>
                    </p>
                    <p className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <span>Over-engineer the fun parts, keep the boring parts simple</span>
                    </p>
                    <p className="flex items-start space-x-3">
                      <Code className="w-5 h-5 text-blue-400 mt-0.5" />
                      <span>Write code and forget about it. The rest is tomorrow's problem.</span>
                    </p>
                    <p className="flex items-start space-x-3">
                      <Coffee className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <span>Vibe coding is the future, but it needs structure.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Vision Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-pink-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-pink-400" />
              </div>
              <h2 className="text-3xl font-bold">The Vision (Such As It Is)</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-pink-300">Why LookOut Exists</h3>
                <p className="text-gray-300 leading-relaxed text-lg mb-6">
                  I believe every developer should have access to basic monitoring tools without having to learn enterprise-grade complexity or pay enterprise-grade prices. 
                  Your side project deserves to look professional, and you deserve to sleep well knowing it's actually running.
                </p>
                
                <p className="text-gray-300 leading-relaxed text-lg">
                  LookOut exists in the sweet spot between "nothing" and "overwhelming enterprise solution." 
                  It's the monitoring tool I created for myself but decided to share with the world - simple enough to set up in 5 minutes, 
                  powerful enough to give you real insights, and honest enough to admit when something breaks.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Rocket className="w-6 h-6 text-blue-400" />
                    <h4 className="font-semibold text-blue-300">What Success Looks Like</h4>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Developers actually use it and find it helpful</li>
                    <li>• Someone lands a job because their demo didn't sleep during the interview</li>
                    <li>• The monitoring is so simple that setup doesn't become a project itself</li>
                    <li>• People contribute ideas and improvements</li>
                    <li>• It stays free and useful for the indie dev community</li>
                  </ul>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                    <h4 className="font-semibold text-orange-300">The Honest Reality</h4>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• This might die when I get busy with a new job</li>
                    <li>• It's not making money and probably never will</li>
                    <li>• Some features exist because I thought they'd be cool</li>
                    <li>• I'm learning as I build, so some parts are definitely over-engineered or critically busted</li>
                    <li>• It's a labor of love, not a business plan</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-8">
                <h4 className="text-xl font-semibold mb-4 text-purple-300">The Long Game</h4>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Here's what I hope happens: LookOut becomes the monitoring tool that developers recommend to each other. 
                  Not because it's the most advanced or feature-rich, but because it just works and doesn't get in your way. 
                  The tool you set up once and then forget about until you actually need to check if something's broken.
                </p>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  I want it to be the monitoring equivalent of a good pair of jeans - reliable, comfortable, 
                  and you don't think about it until you need it. No sales calls, no premium tiers, 
                  no "contact us for enterprise pricing." Just useful software that does what it says.
                </p>
                
                <p className="text-gray-300 leading-relaxed">
                  And if this project helps even one developer avoid the embarrassment of a sleeping demo app during a job interview, 
                  or gives someone the confidence to show off their side project knowing it's actually running, then it's worth it.
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 text-red-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-300 mb-2">The Mortality Clause</h4>
                    <p className="text-red-200 text-sm leading-relaxed">
                      Let's be real - this project might not last forever. If I get a demanding job, or life gets busy, or I run out of resources, or I lose interest, LookOut might become a digital ghost town. That's the reality of passion projects. 
                      But while it's alive, it's going to be the best damn free monitoring tool I can build. 
                      And hey, it's open source, so if it does die, someone smarter than me can resurrect it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6">Ready to Keep Your Apps Alive?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join the community of developers who've decided that sleeping demo apps are a thing of the past.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-white font-semibold text-lg"
              >
                Start Monitoring for Free
              </Link>
              
              <Link
                href="/docs"
                className="px-8 py-4 border border-white/20 rounded-lg hover:bg-white/5 transition-all text-white font-semibold text-lg"
              >
                Read the Docs
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>Made with caffeine and stubbornness</span>
              </span>
              <span className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <a 
                  href="https://github.com/akm-xdd/lookout-client" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                >
                  Open Source
                </a>
              </span>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

// Helper Components
const SkillCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  skills: string[];
}> = ({ icon, title, skills }) => (
  <div className="bg-white/5 rounded-lg p-4">
    <div className="flex items-center space-x-2 mb-3">
      {icon}
      <h4 className="font-medium">{title}</h4>
    </div>
    <ul className="space-y-1">
      {skills.map((skill, index) => (
        <li key={index} className="text-xs text-gray-400">{skill}</li>
      ))}
    </ul>
  </div>
)

export default AboutPage