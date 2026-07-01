import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { requirePermission } from '~/server/utils/auth'
import { cache } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
  try {
    const auth = requirePermission(event, 'users')

    // 根据当前用户角色决定缓存 key
    const cacheKey = `users:list:${auth.role}`
    const cached = cache.get<any[]>(cacheKey)
    if (cached) {
      return successResponse(cached)
    }

    // 构建查询条件：非超级管理员看不到超级管理员
    const where: any = {}
    if (auth.role !== 'superadmin') {
      where.role = { not: 'superadmin' }
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    cache.set(cacheKey, users, 30 * 1000)

    return successResponse(users)
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('获取用户列表失败:', error)
    return errorResponse('获取用户列表失败')
  }
})
