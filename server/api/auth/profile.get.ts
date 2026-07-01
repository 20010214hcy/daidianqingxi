import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    // 从 token 中获取用户 ID
    const auth = event.context.auth
    if (!auth?.userId) {
      return errorResponse('未登录', 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId }
    })

    if (!user) {
      return errorResponse('用户不存在', 404)
    }

    return successResponse({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return errorResponse('获取用户信息失败')
  }
})