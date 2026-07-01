import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return errorResponse('文章ID不能为空', 400)
    }

    const article = await prisma.article.findUnique({
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

    if (!article) {
      return errorResponse('文章不存在', 404)
    }

    return successResponse(article)
  } catch (error) {
    console.error('获取文章详情失败:', error)
    return errorResponse('获取文章详情失败')
  }
})
