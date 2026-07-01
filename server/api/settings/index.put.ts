import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

// 允许更新的字段白名单
const ALLOWED_FIELDS = ['siteName', 'siteSlogan', 'siteLogo', 'siteIcon'] as const

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

    let setting = await prisma.sitesetting.findFirst()

    if (setting) {
      setting = await prisma.sitesetting.update({
        where: { id: setting.id },
        data
      })
    } else {
      setting = await prisma.sitesetting.create({ data })
    }

    return successResponse(setting, '更新成功')
  } catch (error) {
    console.error('更新网站设置失败:', error)
    return errorResponse('更新网站设置失败')
  }
})
