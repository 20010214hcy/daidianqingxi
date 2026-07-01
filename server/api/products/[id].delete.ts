import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { deleteImageFile } from '~/server/utils/file'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return errorResponse('产品ID不能为空', 400)
    }

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (product?.image) {
      deleteImageFile(product.image)
    }

    await prisma.product.delete({
      where: { id },
    })

    return successResponse(null, '产品删除成功')
  } catch (error) {
    console.error('删除产品失败:', error)
    return errorResponse('删除产品失败')
  }
})
