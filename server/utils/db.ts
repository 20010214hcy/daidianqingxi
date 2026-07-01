import { PrismaClient } from '@prisma/client'

// 全局缓存 PrismaClient 实例，避免在开发时热重载创建多个实例
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export { prisma }
