import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { verifyPassword, generateToken } from '~/server/utils/auth'
import { getRateLimitCount, incrementRateLimit, clearRateLimit } from '~/server/utils/rateLimit'

// 渐进式速率限制：失败次数越多，等待越久
const BASE_DELAY_MS = 2000
const MAX_DELAY_MS = 60000
const WINDOW_MS = 15 * 60 * 1000

function getClientIP(event: any): string {
  return getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    || getHeader(event, 'x-real-ip')
    || event.node?.req?.socket?.remoteAddress
    || 'unknown'
}

export default defineEventHandler(async (event) => {
  const ip = getClientIP(event)
  const failKey = `login_fail:${ip}`

  // 渐进式延迟（跨 PM2 实例共享计数）
  const failCount = await getRateLimitCount(failKey)
  if (failCount > 0) {
    const delayMs = Math.min(BASE_DELAY_MS * Math.pow(2, failCount - 1), MAX_DELAY_MS)
    await new Promise(resolve => setTimeout(resolve, delayMs))
  }

  try {
    const body = await readBody(event)

    if (!body || !body.username || !body.password) {
      return errorResponse('用户名和密码不能为空', 400)
    }

    const { username, password } = body

    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      await incrementRateLimit(failKey, WINDOW_MS)
      return errorResponse('用户名或密码错误', 401)
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      await incrementRateLimit(failKey, WINDOW_MS)
      return errorResponse('用户名或密码错误', 401)
    }

    await clearRateLimit(failKey)

    const token = generateToken({ userId: user.id, username: user.username, role: user.role })

    const userData = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    }

    const isProduction = process.env.NODE_ENV === 'production'

    setCookie(event, 'auth_token', token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax' as const,
      httpOnly: true,
      secure: isProduction,
    })

    setCookie(event, 'auth_user', encodeURIComponent(JSON.stringify(userData)), {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax' as const,
      secure: isProduction,
    })

    return successResponse({ user: userData }, '登录成功')
  } catch (err) {
    console.error('[login] 登录失败:', err)
    return errorResponse('登录失败')
  }
})
