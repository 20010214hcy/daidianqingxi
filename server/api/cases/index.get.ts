import { prisma } from '~/server/utils/db'
import { successResponse, paginatedResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 10
    const status = (query.status as string) || 'published'
    const businessUnit = query.businessUnit as string

    // 构建查询条件
    const where: any = {}
    if (status !== 'all') {
      where.status = status
    }

    // 如果指定了业务板块，根据slug过滤
    if (businessUnit) {
      const unit = await prisma.businessunit.findUnique({
        where: { slug: businessUnit }
      })
      if (unit) {
        where.businessUnitId = unit.id
      }
    }

    const [cases, total] = await Promise.all([
      prisma.projectcase.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true,
            },
          },
          businessunit: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.projectcase.count({ where }),
    ])

    const result = { cases, total }

    return paginatedResponse(result.cases, result.total, page, pageSize)
  } catch (error) {
    console.error('获取案例列表失败:', error)
    return errorResponse('获取案例列表失败')
  }
})
