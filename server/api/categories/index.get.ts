import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const categories = await prisma.productcategory.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        _count: {
          select: { product: true },
        },
      },
    })

    return successResponse(categories)
  } catch (error) {
    console.error('获取分类列表失败:', error)
    return errorResponse('获取分类列表失败')
  }
})