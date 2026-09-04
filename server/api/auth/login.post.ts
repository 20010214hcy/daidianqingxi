import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { verifyPassword, generateToken } from '~/server/utils/auth'

// 渐进式速率限制：每次失败增加等待时间
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>()
const BASE_DELAY_MS = 2000  // 基础延迟2秒
const MAX_DELAY_MS = 60000  // 最大延迟60秒
const WINDOW_MS = 15 * 60 * 1000  // 15分钟窗口

function getClientIP(event: any): string {
  return getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    || getHeader(event, 'x-real-ip')
    || event.node?.req?.socket?.remoteAddress
    || 'unknown'
}

function getRateLimit(ip: string): { blocked: boolean; delayMs: number } {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  if (!record || now - record.firstAttempt > WINDOW_MS) {
    return { blocked: false, delayMs: 0 }
  }
  // 渐进式延迟：每次失败增加延迟
  const delayMs = Math.min(BASE_DELAY_MS * Math.pow(2, record.count - 1), MAX_DELAY_MS)
  return { blocked: false, delayMs }
}

function recordFailure(ip: string) {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  if (!record || now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now })
  } else {
    record.count++
  }
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip)
}

export default defineEventHandler(async (event) => {
  const ip = getClientIP(event)

  // 渐进式速率限制
  const rateLimit = getRateLimit(ip)
  if (rateLimit.delayMs > 0) {
    await new Promise(resolve => setTimeout(resolve, rateLimit.delayMs))
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
      recordFailure(ip)
      return errorResponse('用户名或密码错误', 401)
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      recordFailure(ip)
      return errorResponse('用户名或密码错误', 401)
    }

    clearAttempts(ip)

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

    // auth_token: HttpOnly + Secure（防 XSS 和中间人攻击）
    setCookie(event, 'auth_token', token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax' as const,
      httpOnly: true,
      secure: isProduction,
    })

    // auth_user: Secure（客户端可读，用于显示用户信息）
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
