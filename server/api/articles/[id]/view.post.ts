import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { cache } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return errorResponse('文章ID不能为空', 400)
    }

    // 增加浏览量
    await prisma.article.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    // 清除文章缓存
    cache.delete(`article:${id}`)

    return successResponse(null, '浏览量已更新')
  } catch (error) {
    console.error('更新浏览量失败:', error)
    return errorResponse('更新浏览量失败')
  }
})
