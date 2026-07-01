import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async () => {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    return successResponse(certificates)
  } catch (error: any) {
    return errorResponse(error.message || '获取证书列表失败')
  }
})
