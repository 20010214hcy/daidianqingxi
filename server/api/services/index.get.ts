import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const status = (query.status as string) || 'published'
    const businessUnit = query.businessUnit as string

    // 构建查询条件
    const where: any = status === 'all' ? {} : { status }

    // 如果指定了业务板块，根据slug过滤
    if (businessUnit) {
      const unit = await prisma.businessunit.findUnique({
        where: { slug: businessUnit }
      })
      if (unit) {
        where.businessUnitId = unit.id
      }
    }

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
        businessunit: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
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
