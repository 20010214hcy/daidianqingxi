import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

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

    // 隐藏敏感信息
    const safeSetting = {
      ...setting,
      smtpPass: setting.smtpPass ? '***' : null
    }

    return successResponse(safeSetting)
  } catch (error) {
    console.error('获取网站设置失败:', error)
    return errorResponse('获取网站设置失败')
  }
})
