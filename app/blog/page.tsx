// app/blog/page.tsx
import { getAllBlogPosts } from '@/lib/blog';
import ClientBlogWrapper from '../_components/blog/ClientBlogWrapper';

export default async function BlogPage() {
  // Get posts from your MDX files
  const blogPosts = getAllBlogPosts();

  return <ClientBlogWrapper blogPosts={blogPosts} />;
}