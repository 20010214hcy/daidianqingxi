import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { filterXss } from '~/server/utils/xss'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    
    if (!id) {
      return errorResponse('案例ID不能为空', 400)
    }
    
    const updateData: any = {}
    const fields = ['title', 'description', 'coverImage', 'images', 'clientName', 'location', 'status']
    
    fields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    })
    
    if (body.content !== undefined) {
      updateData.content = filterXss(body.content)
    }
    
    if (body.startDate !== undefined) {
      updateData.startDate = body.startDate ? new Date(body.startDate) : null
    }
    
    if (body.endDate !== undefined) {
      updateData.endDate = body.endDate ? new Date(body.endDate) : null
    }
    
    const projectCase = await prisma.projectcase.update({
      where: { id },
      data: updateData,
    })
    
    return successResponse(projectCase, '案例更新成功')
  } catch (error) {
    console.error('更新案例失败:', error)
    return errorResponse('更新案例失败')
  }
})
