import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { title, image, sortOrder } = body

    if (!title || !image) {
      return errorResponse('证书名称和图片不能为空', 400)
    }

    const certificate = await prisma.certificate.create({
      data: {
        updatedAt: new Date(),
        title,
        image,
        sortOrder: sortOrder || 0
      }
    })

    return successResponse(certificate, '创建成功')
  } catch (error: any) {
    return errorResponse(error.message || '创建证书失败')
  }
})
