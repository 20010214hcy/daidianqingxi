import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    if (!id) return errorResponse('媒体ID不能为空', 400)

    await prisma.media.delete({ where: { id } })
    return successResponse(null, '媒体删除成功')
  } catch (error) {
    console.error('删除媒体失败:', error)
    return errorResponse('删除媒体失败')
  }
})
