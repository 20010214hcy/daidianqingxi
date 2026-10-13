import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { verifyToken } from '~/server/utils/auth'

// 仅在已登录时返回的敏感字段（SMTP 发件配置）
const SECRET_FIELDS = ['smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'smtpFrom'] as const

export default defineEventHandler(async (event) => {
  try {
    let setting = await prisma.sitesetting.findFirst()

    if (!setting) {
      setting = await prisma.sitesetting.create({
        data: {
          siteName: '带电清洗',
          siteSlogan: '专业工业清洗服务'
        }
      })
    }

    // 公开 GET 请求不经过鉴权中间件，此处自行校验登录态
    let isAuthed = false
    try {
      const cookies = parseCookies(event)
      let token: string | null = cookies.auth_token || null
      if (!token) {
        const authorization = getHeader(event, 'authorization')
        if (authorization?.startsWith('Bearer ')) {
          token = authorization.slice(7)
        }
      }
      if (token && verifyToken(token)) {
        isAuthed = true
      }
    } catch {
      isAuthed = false
    }

    const safeSetting: Record<string, unknown> = { ...setting }

    if (isAuthed) {
      // 已登录：仅掩码密码
      safeSetting.smtpPass = setting.smtpPass ? '***' : null
    } else {
      // 未登录：完全剔除 SMTP 配置
      for (const field of SECRET_FIELDS) {
        delete safeSetting[field]
      }
    }

    return successResponse(safeSetting)
  } catch (error) {
    console.error('获取网站设置失败:', error)
    return errorResponse('获取网站设置失败')
  }
})
