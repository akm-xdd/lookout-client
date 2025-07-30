// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getBlogPost, getAllBlogPosts } from '@/lib/blog';
import BlogPostLayout from '@/app/_components/blog/BlogPostLayout';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '../../../mdx-components';
import rehypeHighlight from 'rehype-highlight';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | LookOut Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const components = useMDXComponents({});

  return (
    <BlogPostLayout meta={post}>
      <MDXRemote 
        source={post.content} 
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [rehypeHighlight],
          },
        }}
      />
    </BlogPostLayout>
  );
}