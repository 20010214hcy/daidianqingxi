import { PrismaClient } from '@prisma/client'

// 全局缓存 PrismaClient 实例，避免重复创建连接池
const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
})

// 在所有环境下都缓存到全局
globalThis.prisma = prisma

export { prisma }
