import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { deleteImageFile } from '~/server/utils/file'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return errorResponse('文章ID不能为空', 400)
    }

    const article = await prisma.article.findUnique({
      where: { id }
    })

    if (article?.coverImage) {
      deleteImageFile(article.coverImage)
    }

    await prisma.article.delete({
      where: { id },
    })

    return successResponse(null, '文章删除成功')
  } catch (error) {
    console.error('删除文章失败:', error)
    return errorResponse('删除文章失败')
  }
})
