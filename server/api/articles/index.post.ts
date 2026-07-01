import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { filterXss } from '~/server/utils/xss'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const { title, content, summary, coverImage, category, status, authorId } = body
    
    if (!title || !content || !authorId) {
      return errorResponse('标题、内容和作者ID不能为空', 400)
    }
    
    // XSS 过滤富文本内容
    const safeContent = filterXss(content)
    const safeSummary = summary ? filterXss(summary) : summary
    
    const article = await prisma.article.create({
      data: {
        title,
        content: safeContent,
        summary: safeSummary,
        coverImage,
        category: category || 'news',
        status: status || 'published',
        authorId: Number(authorId),
        publishedAt: status === "published" ? new Date() : null,
        updatedAt: new Date(),
      },
    })
    
    return successResponse(article, '文章创建成功')
  } catch (error) {
    console.error('创建文章失败:', error)
    return errorResponse('创建文章失败')
  }
})
