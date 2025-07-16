interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Get data from cache if valid, otherwise execute fetcher and cache result
   */
  async get<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const entry = this.cache.get(key)
    const now = Date.now()

    // Return cached data if valid
    if (entry && (now - entry.timestamp) < entry.ttl) {
      console.log(`🎯 Cache HIT: ${key}`)
      return entry.data
    }

    // Cache miss or expired - fetch fresh data
    console.log(`📡 Cache MISS: ${key}`)
    try {
      const data = await fetcher()
      
      // Cache the result
      this.cache.set(key, {
        data,
        timestamp: now,
        ttl
      })

      return data
    } catch (error) {
      // If we have stale data and the API fails, return stale data
      if (entry) {
        console.log(`⚠️ Cache STALE (API failed): ${key}`)
        return entry.data
      }
      throw error
    }
  }

  /**
   * Invalidate specific cache key
   */
  invalidate(key: string): void {
    console.log(`🗑️ Cache INVALIDATE: ${key}`)
    this.cache.delete(key)
  }

  /**
   * Invalidate all cache keys matching pattern
   */
  invalidatePattern(pattern: string): void {
    const keys = Array.from(this.cache.keys())
    const regex = new RegExp(pattern.replace('*', '.*'))
    
    keys.forEach(key => {
      if (regex.test(key)) {
        console.log(`🗑️ Cache INVALIDATE (pattern): ${key}`)
        this.cache.delete(key)
      }
    })
  }

  /**
   * Clear all cache
   */
  clear(): void {
    console.log(`🧹 Cache CLEAR ALL`)
    this.cache.clear()
  }

  /**
   * Get cache stats for debugging
   */
  getStats(): { size: number, keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    const now = Date.now()
    return (now - entry.timestamp) < entry.ttl
  }
}

// Export singleton instance
export const cacheManager = new CacheManager()

// Convenience functions
export const invalidateCache = (key: string) => cacheManager.invalidate(key)
export const invalidateCachePattern = (pattern: string) => cacheManager.invalidatePattern(pattern)
export const clearCache = () => cacheManager.clear()

// Cache key generators
export const cacheKeys = {
  dashboard: () => 'dashboard',
  workspace: (workspaceId: string) => `workspace:${workspaceId}`,
  workspaceEndpoints: (workspaceId: string) => `workspace:${workspaceId}:endpoints`,
  workspacePattern: (workspaceId: string) => `workspace:${workspaceId}*`
} as const