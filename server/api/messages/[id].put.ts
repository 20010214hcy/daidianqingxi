import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { filterXss } from '~/server/utils/xss'

const VALID_STATUSES = ['pending', 'replied', 'closed'] as const

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)

    if (!id) {
      return errorResponse('留言ID不能为空', 400)
    }

    const updateData: Record<string, unknown> = {}

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return errorResponse('无效的状态值', 400)
      }
      updateData.status = body.status
    }

    if (body.reply !== undefined) {
      updateData.reply = filterXss(body.reply)
      updateData.repliedAt = new Date()
    }

    const message = await prisma.message.update({
      where: { id },
      data: updateData,
    })

    return successResponse(message, '留言处理成功')
  } catch (error) {
    console.error('处理留言失败:', error)
    return errorResponse('处理留言失败')
  }
})
