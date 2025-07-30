import type { MDXComponents } from 'mdx/types'
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

// Simple callout component
const Callout = ({ type, children }: { type: 'info' | 'warning' | 'success' | 'error', children: React.ReactNode }) => {
  const icons = {
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />
  }
  
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-200',
    warning: 'bg-orange-500/10 border-orange-500/30 text-orange-200',
    success: 'bg-green-500/10 border-green-500/30 text-green-200',
    error: 'bg-red-500/10 border-red-500/30 text-red-200'
  }
  
  return (
    <div className={`rounded-lg p-4 border ${styles[type]} my-6`}>
      <div className="flex items-start space-x-3">
        {icons[type]}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Basic styling
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-8 mt-12 text-white">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mb-6 mt-10 text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold mb-4 mt-8 text-gray-100">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-300 leading-relaxed mb-6">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a 
        href={href} 
        className="text-blue-400 hover:text-blue-300 transition-colors underline"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-6 ml-4 text-gray-300 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-6 ml-4 text-gray-300 space-y-2">
        {children}
      </ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-500/5 rounded-r-lg mb-6 italic text-blue-200">
        {children}
      </blockquote>
    ),
    
    // Simple code handling - let rehype-highlight do the work
    code: ({ children, className }) => {
      // Inline code
      if (!className) {
        return (
          <code className="bg-gray-800 text-gray-200 px-2 py-1 rounded text-sm font-mono">
            {children}
          </code>
        )
      }
      // Block code - rehype-highlight will handle syntax highlighting
      return <code className={className}>{children}</code>
    },
    
    pre: ({ children }) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6 border border-gray-700 font-mono text-sm">
        {children}
      </pre>
    ),
    
    img: ({ src, alt }) => (
      <img 
        src={src} 
        alt={alt} 
        className="rounded-lg mb-6 w-full" 
      />
    ),
    
    hr: () => (
      <hr className="border-white/10 my-12" />
    ),
    
    // Custom components
    Callout,
    
    ...components,
  }
}