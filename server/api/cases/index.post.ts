import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { filterXss } from '~/server/utils/xss'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const { title, description, content, coverImage, images, clientName, location, startDate, endDate, status, authorId } = body
    
    if (!title || !content || !authorId) {
      return errorResponse('标题、内容和作者ID不能为空', 400)
    }
    
    const projectCase = await prisma.projectcase.create({
      data: {
        title,
        description,
        content: filterXss(content),
        coverImage,
        images,
        clientName,
        location,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'published',
        authorId: Number(authorId),
        updatedAt: new Date(),
      },
    })
    
    return successResponse(projectCase, '案例创建成功')
  } catch (error) {
    console.error('创建案例失败:', error)
    return errorResponse('创建案例失败')
  }
})
