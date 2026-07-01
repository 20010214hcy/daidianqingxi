import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return errorResponse('分类ID不能为空', 400)
    }

    const productCount = await prisma.product.count({
      where: { categoryId: id },
    })

    if (productCount > 0) {
      return errorResponse(`该分类下还有 ${productCount} 个产品，请先删除相关产品`, 400)
    }

    await prisma.productcategory.delete({
      where: { id },
    })

    return successResponse(null, '分类删除成功')
  } catch (error) {
    console.error('删除分类失败:', error)
    return errorResponse('删除分类失败')
  }
})