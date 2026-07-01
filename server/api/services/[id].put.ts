import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { filterXss } from '~/server/utils/xss'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    
    if (!id) {
      return errorResponse('服务ID不能为空', 400)
    }
    
    const updateData: any = {}
    const fields = ['title', 'description', 'coverImage', 'icon', 'price', 'sortOrder', 'status']
    
    fields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    })
    
    if (body.content !== undefined) {
      updateData.content = filterXss(body.content)
    }
    
    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    })
    
    return successResponse(service, '服务更新成功')
  } catch (error) {
    console.error('更新服务失败:', error)
    return errorResponse('更新服务失败')
  }
})
