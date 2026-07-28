import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const units = await prisma.businessunit.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            productcategory: true,
            service: true,
            projectcase: true,
          }
        }
      }
    })

    return successResponse(units)
  } catch (error) {
    console.error('获取业务板块列表失败:', error)
    return errorResponse('获取业务板块列表失败')
  }
})
