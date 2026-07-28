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
    const businessUnit = query.businessUnit as string

    const where: any = {}
    if (status !== 'all') {
      where.status = status
    }
    if (keyword) {
      where.name = { contains: keyword }
    }

    // 如果指定了业务板块，根据slug过滤分类
    if (businessUnit) {
      const unit = await prisma.businessunit.findUnique({
        where: { slug: businessUnit }
      })
      if (unit) {
        // 获取该板块下的所有分类ID
        const categoryRows = await prisma.productcategory.findMany({
          where: { businessUnitId: unit.id },
          select: { id: true }
        })
        const unitCategoryIds = categoryRows.map(c => c.id)

        if (unitCategoryIds.length === 0) {
          return paginatedResponse([], 0, page, pageSize)
        }

        // 如果同时指定了具体分类，取交集
        if (categoryId) {
          if (unitCategoryIds.includes(categoryId)) {
            where.categoryId = categoryId
          } else {
            // 指定的分类不属于该板块，返回空
            return paginatedResponse([], 0, page, pageSize)
          }
        } else {
          where.categoryId = { in: unitCategoryIds }
        }
      }
    } else if (categoryId) {
      where.categoryId = categoryId
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          productcategory: {
            select: {
              id: true,
              name: true,
              businessunit: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                }
              }
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
