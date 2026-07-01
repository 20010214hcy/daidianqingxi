import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { deleteImageFile } from '~/server/utils/file'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return errorResponse('案例ID不能为空', 400)
    }

    const projectCase = await prisma.projectcase.findUnique({
      where: { id }
    })

    if (projectCase?.coverImage) {
      deleteImageFile(projectCase.coverImage)
    }
    if (projectCase?.images) {
      deleteImageFile(projectCase.images)
    }

    await prisma.projectcase.delete({
      where: { id },
    })

    return successResponse(null, '案例删除成功')
  } catch (error) {
    console.error('删除案例失败:', error)
    return errorResponse('删除案例失败')
  }
})
