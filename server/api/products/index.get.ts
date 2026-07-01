import { prisma } from '~/server/utils/db'
import { successResponse, paginatedResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 10
    const categoryId = query.categoryId ? Number(query.categoryId) : undefined
    const status = (query.status as string) || 'published'
    const keyword = query.keyword as string

    const where: any = {}
    if (status !== 'all') {
      where.status = status
    }
    if (categoryId) {
      where.categoryId = categoryId
    }
    if (keyword) {
      where.name = { contains: keyword }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          productcategory: {
            select: {
              id: true,
              name: true
            }
          },
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ])

    return paginatedResponse(products, total, page, pageSize)
  } catch (error) {
    console.error('获取产品列表失败:', error)
    return errorResponse('获取产品列表失败')
  }
})
