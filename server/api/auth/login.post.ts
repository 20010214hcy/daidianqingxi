import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { verifyPassword, generateToken } from '~/server/utils/auth'

// 简易内存限流：IP -> 失败记录
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 5 * 60 * 1000 // 5 分钟

function getClientIP(event: any): string {
  return getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    || getHeader(event, 'x-real-ip')
    || event.node?.req?.socket?.remoteAddress
    || 'unknown'
}

function checkRateLimit(ip: string): { blocked: boolean; remainingMs?: number } {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record) return { blocked: false }

  // 窗口过期，重置
  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(ip)
    return { blocked: false }
  }

  if (record.count >= MAX_ATTEMPTS) {
    const remainingMs = WINDOW_MS - (now - record.firstAttempt)
    return { blocked: true, remainingMs }
  }

  return { blocked: false }
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

  // 检查限流
  const rateLimit = checkRateLimit(ip)
  if (rateLimit.blocked) {
    const seconds = Math.ceil((rateLimit.remainingMs || 0) / 1000)
    setResponseStatus(event, 429)
    return errorResponse(`登录尝试过于频繁，请 ${seconds} 秒后再试`, 429)
  }

  try {
    const body = await readBody(event)
    const { username, password } = body

    if (!username || !password) {
      return errorResponse('用户名和密码不能为空', 400)
    }

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

    // 登录成功，清除限流记录
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

    // auth_token: httpOnly 防 XSS 窃取
    setCookie(event, 'auth_token', token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax' as const,
      httpOnly: true,
      secure: false,
    })

    // auth_user: 非 httpOnly（前端需要读取用户信息）
    setCookie(event, 'auth_user', encodeURIComponent(JSON.stringify(userData)), {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax' as const,
      secure: false,
    })

    // token 只通过 httpOnly cookie 传递，不在响应体中返回（安全最佳实践）
    return successResponse({ user: userData }, '登录成功')
  } catch (err) {
    return errorResponse('登录失败')
  }
})
