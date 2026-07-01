import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '0')
    const body = await readBody(event)
    const { title, image, sortOrder } = body

    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(image !== undefined && { image }),
        ...(sortOrder !== undefined && { sortOrder })
      }
    })

    return successResponse(certificate, '更新成功')
  } catch (error: any) {
    return errorResponse(error.message || '更新证书失败')
  }
})
