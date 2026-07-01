import { prisma } from '~/server/utils/db'
import { successResponse, paginatedResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 10
    const status = (query.status as string) || 'published'

    // 如果 status 是 'all'，不应用状态筛选
    const whereCondition = status === 'all' ? {} : { status }

    const [cases, total] = await Promise.all([
      prisma.projectcase.findMany({
        where: whereCondition,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.projectcase.count({ where: whereCondition }),
    ])

    const result = { cases, total }

    return paginatedResponse(result.cases, result.total, page, pageSize)
  } catch (error) {
    console.error('获取案例列表失败:', error)
    return errorResponse('获取案例列表失败')
  }
})
