import { verifyToken } from '~/server/utils/auth'

const protectedPaths = [
  '/api/articles', '/api/cases', '/api/services',
  '/api/messages', '/api/settings', '/api/upload',
  '/api/products', '/api/categories', '/api/certificates',
  '/api/contact', '/api/price-visibility', '/api/dashboard',
  '/api/auth', '/api/users',
]

const publicReadPaths = [
  '/api/articles', '/api/cases', '/api/services', '/api/certificates',
  '/api/products', '/api/categories', '/api/settings', '/api/contact',
  '/api/price-visibility',  // 价格可见性允许公开读取
]

// 公开的写入路径（允许未登录用户提交）
const publicWritePaths = [
  '/api/messages',  // 允许未登录用户提交留言
]

export default defineEventHandler(async (event) => {
  const path = event.path
  const isProtected = protectedPaths.some(p => path.startsWith(p))
  if (!isProtected) return

  // 允许公开的GET请求
  if (event.method === 'GET' && publicReadPaths.some(p => path.startsWith(p))) return

  // 允许公开的写入请求（如提交留言）
  if (event.method === "POST" && publicWritePaths.some(p => path.startsWith(p))) return

  // 允许登录和初始化请求
  if (path === '/api/auth/login' || path === '/api/auth/init') return

  const cookies = parseCookies(event)
  let token: string | null = cookies.auth_token || null

  if (!token) {
    const authorization = getHeader(event, 'authorization')
    if (authorization?.startsWith('Bearer ')) {
      token = authorization.slice(7)
    }
  }

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: '未登录，请先登录' })
  }

  const payload = verifyToken(token)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: '登录已过期，请重新登录' })
  }

  event.context.auth = payload
})
