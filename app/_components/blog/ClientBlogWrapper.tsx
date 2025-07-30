"use client";
import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Bookmark } from 'lucide-react';
import { BlogPostMeta } from '@/lib/blog';

interface ClientBlogWrapperProps {
  blogPosts: BlogPostMeta[];
}

export default function ClientBlogWrapper({ blogPosts }: ClientBlogWrapperProps) {
  // Add safety check
  const safeBlogPosts = blogPosts || [];
  
  const categories = ['All', ...new Set(safeBlogPosts.map(post => post?.category).filter(Boolean))];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredPosts = selectedCategory === 'All' 
    ? safeBlogPosts 
    : safeBlogPosts.filter(post => post?.category === selectedCategory);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          LookOut Blog
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Stories, updates, and insights from the world of simple monitoring
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid gap-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No posts found in this category.</p>
          </div>
        ) : (
          filteredPosts.map((post, index) => {
            // Add safety checks for post properties
            if (!post) return null;
            
            return (
              <article
                key={post.slug || index}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-2 md:mb-0">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                      {post.category || 'Uncategorized'}
                    </span>
                    <div className="flex items-center space-x-4 text-gray-400 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date || 'No date'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime || 0} min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Link href={`/blog/${post.slug}`} className="block">
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                    {post.title || 'Untitled'}
                  </h2>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {post.excerpt || 'No excerpt available'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {(post.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                      <span className="text-sm">Read more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </article>
            );
          })
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
        <Bookmark className="w-8 h-8 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
        <p className="text-gray-400 mb-4">
          New posts about monitoring, development, and building simple tools
        </p>
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          <span>Try LookOut</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}