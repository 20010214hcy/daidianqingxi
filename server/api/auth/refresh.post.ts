import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { generateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // 从 token 中获取用户 ID
    const auth = event.context.auth
    if (!auth?.userId) {
      return errorResponse('未登录', 401)
    }

    // 验证用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: auth.userId }
    })

    if (!user) {
      return errorResponse('用户不存在', 404)
    }

    // 生成新 token
    const token = generateToken({ userId: user.id, username: user.username, role: user.role })

    const isProduction = process.env.NODE_ENV === 'production'

    // 更新 auth_token cookie
    setCookie(event, 'auth_token', token, {
      maxAge: 60 * 60 * 24 * 7, // 7 天
      path: '/',
      sameSite: 'lax' as const,
      httpOnly: true,
      secure: isProduction,
    })

    return successResponse({ message: 'Token 刷新成功' })
  } catch (error) {
    console.error('刷新 token 失败:', error)
    return errorResponse('刷新 token 失败')
  }
})
