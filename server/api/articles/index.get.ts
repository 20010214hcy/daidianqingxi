import { prisma } from '~/server/utils/db'
import { successResponse, paginatedResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 10
    const category = query.category as string
    const status = (query.status as string) || 'published'
    const keyword = query.keyword as string

    const where: any = {}
    if (status !== 'all') {
      where.status = status
    }
    if (category) {
      where.category = category
    }
    // 关键词搜索
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { summary: { contains: keyword } },
      ]
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
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
        },
        orderBy: [
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.article.count({ where }),
    ])

    return paginatedResponse(articles, total, page, pageSize)
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return errorResponse('获取文章列表失败')
  }
})
