// lib/blog.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  tags: string[]
  readTime: number
  content: string
}

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  tags: string[]
  readTime: number
}

// Get all blog posts metadata
export function getAllBlogPosts(): BlogPostMeta[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const stats = readingTime(content)

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        category: data.category,
        tags: data.tags || [],
        readTime: Math.ceil(stats.minutes),
      }
    })
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1))

  return allPostsData
}

// Get a specific blog post
export function getBlogPost(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const stats = readingTime(content)

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      category: data.category,
      tags: data.tags || [],
      readTime: Math.ceil(stats.minutes),
      content,
    }
  } catch {
    return null
  }
}

// Get posts by category
export function getPostsByCategory(category: string): BlogPostMeta[] {
  const allPosts = getAllBlogPosts()
  return allPosts.filter(post => post.category === category)
}

// Get posts by tag
export function getPostsByTag(tag: string): BlogPostMeta[] {
  const allPosts = getAllBlogPosts()
  return allPosts.filter(post => post.tags.includes(tag))
}

// Get all categories
export function getAllCategories(): string[] {
  const allPosts = getAllBlogPosts()
  const categories = new Set(allPosts.map(post => post.category))
  return Array.from(categories).sort()
}

// Get all tags
export function getAllTags(): string[] {
  const allPosts = getAllBlogPosts()
  const tags = new Set(allPosts.flatMap(post => post.tags))
  return Array.from(tags).sort()
}

// Get related posts (same category or tags)
export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPostMeta[] {
  const currentPost = getBlogPost(currentSlug)
  if (!currentPost) return []

  const allPosts = getAllBlogPosts().filter(post => post.slug !== currentSlug)
  
  // Score posts based on shared category and tags
  const scoredPosts = allPosts.map(post => {
    let score = 0
    
    // Same category gets higher score
    if (post.category === currentPost.category) {
      score += 3
    }
    
    // Shared tags get points
    const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag))
    score += sharedTags.length
    
    return { ...post, score }
  })
  
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}