import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { requirePermission, hashPassword, isValidRole } from '~/server/utils/auth'
import { cache } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
  try {
    requirePermission(event, 'users')

    const body = await readBody(event)
    const { username, password, name, email, role } = body

    if (!username || !password) {
      return errorResponse('用户名和密码不能为空', 400)
    }

    if (!isValidRole(role)) {
      return errorResponse('无效的角色', 400)
    }

    // 检查用户名是否已存在
    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) {
      return errorResponse('用户名已存在', 400)
    }

    const hashedPwd = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPwd,
        name: name || username,
        email: email || null,
        role,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    cache.delete('users:list')
    return successResponse(user, '用户创建成功')
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('创建用户失败:', error)
    return errorResponse('创建用户失败')
  }
})
