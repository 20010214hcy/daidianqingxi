import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return errorResponse('产品ID不能为空', 400)
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        productcategory: true,
      },
    })

    if (!product) {
      return errorResponse('产品不存在', 404)
    }

    return successResponse(product)
  } catch (error) {
    console.error('获取产品详情失败:', error)
    return errorResponse('获取产品详情失败')
  }
})