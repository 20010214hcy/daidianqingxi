import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '0')

    await prisma.certificate.delete({
      where: { id }
    })

    return successResponse(null, '证书已删除')
  } catch (error: any) {
    return errorResponse(error.message || '删除证书失败')
  }
})
