// app/blog/components/BlogPostLayout.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark } from 'lucide-react';

interface BlogPostMeta {
  title: string;
  date: string;
  readTime: number;
  category: string;
  tags: string[];
  excerpt: string;
}

interface BlogPostLayoutProps {
  meta: BlogPostMeta;
  children: React.ReactNode;
}

export default function BlogPostLayout({ meta, children }: BlogPostLayoutProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link 
          href="/blog" 
          className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
            {meta.category}
          </span>
          <div className="flex items-center space-x-4 text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{meta.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{meta.readTime} min read</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
          {meta.title}
        </h1>

        <p className="text-xl text-gray-400 leading-relaxed mb-6">
          {meta.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white/5 text-gray-400 text-sm rounded-full hover:bg-white/10 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
            <Bookmark className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </header>

      {/* Article Content */}
      <article className="prose prose-invert prose-lg max-w-none">
        <div className="blog-content">
          {children}
        </div>
      </article>

      {/* Article Footer */}
      <footer className="mt-16 pt-8 border-t border-white/10">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Enjoyed this post?</h3>
          <p className="text-gray-400 mb-6">
            Try LookOut for free and keep your apps monitored and awake
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Try LookOut Free
            </Link>
            <Link 
              href="/blog"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              Read More Posts
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}