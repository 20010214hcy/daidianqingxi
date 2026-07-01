import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const isProduction = process.env.NODE_ENV === 'production'
  const baseOptions = {
    maxAge: 0,
    path: '/',
    sameSite: 'lax' as const,
    secure: isProduction,
  }

  setCookie(event, 'auth_token', '', { ...baseOptions, httpOnly: true })
  setCookie(event, 'auth_user', '', baseOptions)

  return successResponse(null, '已退出登录')
})