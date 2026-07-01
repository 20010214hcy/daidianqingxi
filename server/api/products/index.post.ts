import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { name, description, price, categoryId, image, status, sortOrder } = body

    if (!name) {
      return errorResponse('产品名称不能为空', 400)
    }
    if (!categoryId) {
      return errorResponse('产品分类不能为空', 400)
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: price !== undefined ? Number(price) : 0,
        categoryId: Number(categoryId),
        image: image || '',
        status: status || 'published',
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
        updatedAt: new Date(),
      },
    })

    return successResponse(product, '产品创建成功')
  } catch (error) {
    console.error('创建产品失败:', error)
    return errorResponse('创建产品失败')
  }
})