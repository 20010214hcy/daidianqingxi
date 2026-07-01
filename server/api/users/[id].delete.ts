import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { requirePermission } from '~/server/utils/auth'
import { cache } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
  try {
    const auth = requirePermission(event, 'users')
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return errorResponse('用户ID不能为空', 400)
    }

    // 不能删除自己
    if (id === auth.userId) {
      return errorResponse('不能删除自己的账号', 400)
    }

    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) {
      return errorResponse('用户不存在', 404)
    }

    // 不能删除超管
    if (targetUser.role === 'superadmin') {
      return errorResponse('不能删除超级管理员', 403)
    }

    await prisma.user.delete({ where: { id } })

    cache.delete('users:list')
    return successResponse(null, '用户已删除')
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('删除用户失败:', error)
    return errorResponse('删除用户失败')
  }
})
