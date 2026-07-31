import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { filename, url, alt, size, mimeType } = body

    if (!url) {
      return errorResponse('图片URL不能为空', 400)
    }

    const media = await prisma.media.create({
      data: {
        filename: filename || '未命名',
        url,
        alt: alt || '',
        size: size ? Number(size) : null,
        mimeType: mimeType || null,
      },
    })

    return successResponse(media, '媒体添加成功')
  } catch (error) {
    console.error('添加媒体失败:', error)
    return errorResponse('添加媒体失败')
  }
})
