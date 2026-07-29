import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { filterXss } from '~/server/utils/xss'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    
    if (!id) {
      return errorResponse('文章ID不能为空', 400)
    }
    
    const { title, content, summary, coverImage, category, status, publishedAt } = body
    
    const updateData: any = {}
    
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = filterXss(content)
    if (summary !== undefined) updateData.summary = summary ? filterXss(summary) : summary
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (category !== undefined) updateData.category = category
    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null
    } else if (status !== undefined) {
      updateData.status = status
      if (status === 'published') {
        updateData.publishedAt = new Date()
      }
    }
    
    const article = await prisma.article.update({
      where: { id },
      data: updateData,
    })
    
    return successResponse(article, '文章更新成功')
  } catch (error) {
    console.error('更新文章失败:', error)
    return errorResponse('更新文章失败')
  }
})
