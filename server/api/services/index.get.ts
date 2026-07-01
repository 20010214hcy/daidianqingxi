import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const status = (query.status as string) || 'published'

    // 构建查询条件
    const where = status === 'all' ? {} : { status }

    const services = await prisma.service.findMany({
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
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return successResponse(services)
  } catch (error) {
    console.error('获取服务列表失败:', error)
    return errorResponse('获取服务列表失败')
  }
})
