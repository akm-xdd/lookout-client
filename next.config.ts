import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import rehypeHighlight from 'rehype-highlight'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['ts', 'js', 'tsx', 'jsx', 'mdx'],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [rehypeHighlight],
  },
})

export default withMDX(nextConfig);