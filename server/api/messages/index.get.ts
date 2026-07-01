import { prisma } from '~/server/utils/db'
import { successResponse, paginatedResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 10
    const status = query.status as string
    
    const where: any = {}
    if (status) {
      where.status = status
    }
    
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.message.count({ where }),
    ])
    
    return paginatedResponse(messages, total, page, pageSize)
  } catch (error) {
    console.error('获取留言列表失败:', error)
    return errorResponse('获取留言列表失败')
  }
})
