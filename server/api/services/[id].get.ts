import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    
    if (!id) {
      return errorResponse('服务ID不能为空', 400)
    }
    
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })
    
    if (!service) {
      return errorResponse('服务不存在', 404)
    }
    
    return successResponse(service)
  } catch (error) {
    console.error('获取服务详情失败:', error)
    return errorResponse('获取服务详情失败')
  }
})
