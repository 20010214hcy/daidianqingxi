import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 24
    const keyword = query.keyword as string

    const where: any = {}
    if (keyword) {
      where.OR = [
        { filename: { contains: keyword } },
        { alt: { contains: keyword } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.media.count({ where }),
    ])

    return successResponse({
      list: items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('获取媒体列表失败:', error)
    return errorResponse('获取媒体列表失败')
  }
})
