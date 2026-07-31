import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)

    if (!id) return errorResponse('媒体ID不能为空', 400)

    const updateData: any = {}
    if (body.filename !== undefined) updateData.filename = body.filename
    if (body.alt !== undefined) updateData.alt = body.alt

    const media = await prisma.media.update({
      where: { id },
      data: updateData,
    })

    return successResponse(media, '媒体信息更新成功')
  } catch (error) {
    console.error('更新媒体失败:', error)
    return errorResponse('更新媒体失败')
  }
})
