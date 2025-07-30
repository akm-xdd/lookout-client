// app/blog/layout.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AnimatedBackground from '@/app/_components/layout/AnimatedBackground';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background - only render on client */}
      {mounted && <AnimatedBackground particleCount={40} />}
      
      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to LookOut</span>
            </Link>
            
            <Link 
              href="/blog" 
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              LookOut Blog
            </Link>
            
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>Part of the LookOut ecosystem - Simple monitoring for developers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}