import { prisma } from './db'

/**
 * 基于 MySQL 的跨进程限流（适配 PM2 cluster 多实例）。
 * 表不存在时会自动创建。
 */
let tableReady = false

async function ensureTable() {
  if (tableReady) return
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS rate_limit (
      k VARCHAR(191) NOT NULL PRIMARY KEY,
      cnt INT NOT NULL DEFAULT 1,
      reset_at DATETIME(3) NOT NULL,
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_reset_at (reset_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)
  tableReady = true
}

export async function checkRateLimit(key: string, maxRequests: number, windowMs: number): Promise<boolean> {
  await ensureTable()
  const now = new Date()
  const resetAt = new Date(now.getTime() + windowMs)

  await prisma.$executeRaw`
    INSERT INTO rate_limit (k, cnt, reset_at)
    VALUES (${key}, 1, ${resetAt})
    ON DUPLICATE KEY UPDATE
      cnt = IF(reset_at < NOW(), 1, cnt + 1),
      reset_at = IF(reset_at < NOW(), VALUES(reset_at), reset_at)
  `

  const rows = await prisma.$queryRaw<{ cnt: number; reset_at: Date }[]>`
    SELECT cnt, reset_at FROM rate_limit WHERE k = ${key}
  `
  const row = rows[0]
  if (!row) return true
  if (new Date(row.reset_at).getTime() < now.getTime()) return true
  return row.cnt <= maxRequests
}

/** 读取当前窗口内计数（未命中或已过期返回 0） */
export async function getRateLimitCount(key: string): Promise<number> {
  await ensureTable()
  const rows = await prisma.$queryRaw<{ cnt: number; reset_at: Date }[]>`
    SELECT cnt, reset_at FROM rate_limit WHERE k = ${key}
  `
  const row = rows[0]
  if (!row) return 0
  if (new Date(row.reset_at).getTime() < Date.now()) return 0
  return row.cnt
}

/** 递增计数并返回递增后的值（窗口过期则重置为 1） */
export async function incrementRateLimit(key: string, windowMs: number): Promise<number> {
  await ensureTable()
  const resetAt = new Date(Date.now() + windowMs)
  await prisma.$executeRaw`
    INSERT INTO rate_limit (k, cnt, reset_at)
    VALUES (${key}, 1, ${resetAt})
    ON DUPLICATE KEY UPDATE
      cnt = IF(reset_at < NOW(), 1, cnt + 1),
      reset_at = IF(reset_at < NOW(), VALUES(reset_at), reset_at)
  `
  return getRateLimitCount(key)
}

export async function clearRateLimit(key: string): Promise<void> {
  await ensureTable()
  await prisma.$executeRaw`DELETE FROM rate_limit WHERE k = ${key}`
}

/** 清理过期记录（可在任意实例调用，幂等） */
export async function cleanupRateLimit(): Promise<void> {
  await ensureTable()
  await prisma.$executeRaw`DELETE FROM rate_limit WHERE reset_at < NOW()`
}
