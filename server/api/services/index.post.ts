import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { filterXss } from '~/server/utils/xss'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const { title, description, content, coverImage, icon, price, sortOrder, status, authorId } = body
    
    if (!title || !content || !authorId) {
      return errorResponse('标题、内容和作者ID不能为空', 400)
    }
    
    const service = await prisma.service.create({
      data: {
        title,
        description,
        content: filterXss(content),
        coverImage,
        icon,
        price,
        sortOrder: sortOrder || 0,
        status: status || 'published',
        authorId: Number(authorId),
        updatedAt: new Date(),
      },
    })
    
    return successResponse(service, '服务创建成功')
  } catch (error) {
    console.error('创建服务失败:', error)
    return errorResponse('创建服务失败')
  }
})
