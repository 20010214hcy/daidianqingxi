import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { deleteImageFile } from '~/server/utils/file'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return errorResponse('服务ID不能为空', 400)
    }

    const service = await prisma.service.findUnique({
      where: { id }
    })

    if (service?.coverImage) {
      deleteImageFile(service.coverImage)
    }

    await prisma.service.delete({
      where: { id },
    })

    return successResponse(null, '服务删除成功')
  } catch (error) {
    console.error('删除服务失败:', error)
    return errorResponse('删除服务失败')
  }
})
