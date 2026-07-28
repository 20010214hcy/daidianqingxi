import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const businessUnit = query.businessUnit as string

    // 构建查询条件
    const where: any = {}

    // 如果指定了业务板块，根据slug过滤
    if (businessUnit) {
      const unit = await prisma.businessunit.findUnique({
        where: { slug: businessUnit }
      })
      if (unit) {
        where.businessUnitId = unit.id
      }
    }

    const categories = await prisma.productcategory.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        _count: {
          select: { product: true },
        },
        businessunit: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      },
    })

    return successResponse(categories)
  } catch (error) {
    console.error('获取分类列表失败:', error)
    return errorResponse('获取分类列表失败')
  }
})
