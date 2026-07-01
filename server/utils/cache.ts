/**
 * 简单的内存缓存实现
 */
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private maxSize = 1000

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, ttl: number = 60 * 1000): void {
    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * 删除缓存
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * 清除匹配前缀的缓存
   */
  clearByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 获取或设置缓存
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = 60 * 1000
  ): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await factory()
    this.set(key, data, ttl)
    return data
  }
}

// 全局缓存实例
export const cache = new MemoryCache()

/**
 * 缓存装饰器 - 用于 API 路由
 */
export function withCache<T>(
  key: string,
  factory: () => Promise<T>,
  ttl: number = 60 * 1000
): Promise<T> {
  return cache.getOrSet(key, factory, ttl)
}

/**
 * 生成缓存 key
 */
export function createCacheKey(...parts: (string | number | undefined)[]): string {
  return parts.filter(p => p !== undefined).join(':')
}
