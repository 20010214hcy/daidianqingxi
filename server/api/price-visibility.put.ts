import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { visible, operatorName } = body

    let setting = await prisma.pricevisibility.findFirst()
    const previousVisible = setting?.visible ?? true
    const newVisible = visible ?? true

    if (setting) {
      setting = await prisma.pricevisibility.update({
        where: { id: setting.id },
        data: {
          visible: newVisible,
          updatedBy: operatorName || '管理员',
        }
      })
    } else {
      setting = await prisma.pricevisibility.create({
        data: {
          visible: newVisible,
          updatedBy: operatorName || '管理员',
        }
      })
    }

    const previousState = previousVisible ? '显示' : '隐藏'
    const newState = newVisible ? '显示' : '隐藏'
    const action = newVisible ? '开启价格显示' : '关闭价格显示'

    await prisma.pricechangelog.create({
      data: {
        action,
        previousState,
        newState,
        operatorName: operatorName || '管理员',
      }
    })

    return successResponse(setting)
  } catch (error) {
    console.error('更新价格显示状态失败:', error)
    return errorResponse('更新价格显示状态失败')
  }
})