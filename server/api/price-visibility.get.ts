import { prisma } from '~/server/utils/db'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async () => {
  try {
    let setting = await prisma.pricevisibility.findFirst()

    if (!setting) {
      setting = await prisma.pricevisibility.create({
        data: { visible: true, updatedBy: '系统初始化' }
      })
    }

    return successResponse(setting)
  } catch (error) {
    console.error('获取价格显示状态失败:', error)
    return successResponse({ visible: true })
  }
})