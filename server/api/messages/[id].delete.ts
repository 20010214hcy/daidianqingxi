import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    
    if (!id) {
      return errorResponse('留言ID不能为空', 400)
    }
    
    await prisma.message.delete({
      where: { id },
    })
    
    return successResponse(null, '留言删除成功')
  } catch (error) {
    console.error('删除留言失败:', error)
    return errorResponse('删除留言失败')
  }
})
