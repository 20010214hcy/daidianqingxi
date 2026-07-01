import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { requirePermission, hashPassword, isValidRole } from '~/server/utils/auth'
import { cache } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
  try {
    const auth = requirePermission(event, 'users')
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return errorResponse('用户ID不能为空', 400)
    }

    // 不能修改自己
    if (id === auth.userId) {
      return errorResponse('不能修改自己的账号，请到个人资料页面修改', 400)
    }

    const body = await readBody(event)
    const { name, email, role, password } = body

    // 检查用户是否存在
    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) {
      return errorResponse('用户不存在', 404)
    }

    // 不能修改其他超管（除非自己是超管且目标也是超管，但一般不允许）
    if (targetUser.role === 'superadmin' && auth.role !== 'superadmin') {
      return errorResponse('无权修改超级管理员', 403)
    }

    const updateData: Record<string, unknown> = {}

    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email || null
    if (role !== undefined) {
      if (!isValidRole(role)) {
        return errorResponse('无效的角色', 400)
      }
      // 不能把别人提升为超管
      if (role === 'superadmin' && auth.role !== 'superadmin') {
        return errorResponse('无权设置超级管理员角色', 403)
      }
      updateData.role = role
    }
    if (password) {
      updateData.password = await hashPassword(password)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    })

    cache.delete('users:list')
    return successResponse(user, '用户更新成功')
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('更新用户失败:', error)
    return errorResponse('更新用户失败')
  }
})
