import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    
    if (!id) {
      return errorResponse('案例ID不能为空', 400)
    }
    
    const projectCase = await prisma.projectcase.findUnique({
      where: { id },
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
    })
    
    if (!projectCase) {
      return errorResponse('案例不存在', 404)
    }
    
    return successResponse(projectCase)
  } catch (error) {
    console.error('获取案例详情失败:', error)
    return errorResponse('获取案例详情失败')
  }
})
