import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { requirePermission } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const auth = requirePermission(event, 'users')

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

    return successResponse(users)
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('获取用户列表失败:', error)
    return errorResponse('获取用户列表失败')
  }
})
