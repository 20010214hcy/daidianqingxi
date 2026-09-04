import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { encrypt } from '~/server/utils/crypto'

// 允许更新的字段白名单
const ALLOWED_FIELDS = [
  'siteName', 'siteSlogan', 'siteLogo', 'siteIcon',
  'smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'smtpFrom', 'enableEmailReply'
] as const

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // 只保留允许的字段
    const data: Record<string, unknown> = {}
    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) {
        data[field] = body[field]
      }
    }

    if (Object.keys(data).length === 0) {
      return errorResponse('没有有效的更新字段', 400)
    }

    // 加密 SMTP 密码
    if (data.smtpPass && data.smtpPass !== '***') {
      data.smtpPass = encrypt(data.smtpPass as string)
    } else if (data.smtpPass === '***') {
      // 用户未修改密码，不更新此字段
      delete data.smtpPass
    }

    let setting = await prisma.sitesetting.findFirst()

    if (setting) {
      setting = await prisma.sitesetting.update({
        where: { id: setting.id },
        data
      })
    } else {
      setting = await prisma.sitesetting.create({ data })
    }

    // 返回时隐藏密码
    const safeSetting = { ...setting, smtpPass: setting.smtpPass ? '***' : null }
    return successResponse(safeSetting, '更新成功')
  } catch (error) {
    console.error('更新网站设置失败:', error)
    return errorResponse('更新网站设置失败')
  }
})
