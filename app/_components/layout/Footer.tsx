import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Twitter, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  variant?: 'default' | 'simple';
  showSocial?: boolean;
}

const Footer: React.FC<FooterProps> = ({ 
  variant = 'default',
  showSocial = true 
}) => {
  const currentYear = new Date().getFullYear();

  // Simple variant for dashboard/app pages
  if (variant === 'simple') {
    return (
      <footer className="relative z-10 px-6 py-6 border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href='/' className="flex items-center space-x-2">
              <Image src="/icon.png" alt="LookOut" className="w-6 h-6" width={24} height={24} />
              <span className="text-sm text-gray-400">
                © {currentYear} LookOut
              </span>
            </Link>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link href="/support" className="hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Default variant for landing/marketing pages
  return (
    <footer className="relative z-10 px-6 py-12 border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href='/' className="flex items-center space-x-3 mb-4">
              <Image src="/icon.png" alt="LookOut" className="w-8 h-8" width={32} height={32} />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LookOut
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm mb-4">
              Keep your side projects alive. Monitor uptime and performance 
              for applications hosted on free-tier platforms.
            </p>
            {showSocial && (
              <div className="flex items-center space-x-4">
                <a 
                  href="https://github.com/akm-xdd/lookout-client" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub Repository"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com/akm_glhf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:support@lookout.dev" 
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Email Support"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/akm-xdd/lookout-client/releases" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1"
                >
                  Changelog
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} LookOut. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Made with ❤️ for solo developers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;