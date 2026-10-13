import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    // readBody 在请求体缺失或无法解析时返回 undefined，
    // 此前直接取 body.companyName 会抛 TypeError，导致后台保存失败（已复现两次）
    const body = (await readBody(event)) || {}

    if (!body.companyName || !body.address || !body.phone1) {
      return errorResponse('公司名称、公司地址、客服热线为必填项，请检查后重试')
    }

    let contact = await prisma.contactinfo.findFirst()

    if (contact) {
      contact = await prisma.contactinfo.update({
        where: { id: contact.id },
        data: {
          companyName: body.companyName,
          address: body.address,
          phone1: body.phone1,
          phone2: body.phone2,
          email1: body.email1,
          email2: body.email2,
          workHours1: body.workHours1,
          workHours2: body.workHours2,
          latitude: body.latitude != null && body.latitude !== '' ? Number(body.latitude) : null,
          longitude: body.longitude != null && body.longitude !== '' ? Number(body.longitude) : null,
          updatedAt: new Date(),
        }
      })
    } else {
      contact = await prisma.contactinfo.create({
        data: {
          companyName: body.companyName || '玺铭电力',
          address: body.address || '',
          phone1: body.phone1 || '',
          phone2: body.phone2 || '',
          email1: body.email1 || '',
          email2: body.email2 || '',
          workHours1: body.workHours1 || '',
          workHours2: body.workHours2 || '',
          latitude: body.latitude != null && body.latitude !== '' ? Number(body.latitude) : 33.714605,
          longitude: body.longitude != null && body.longitude !== '' ? Number(body.longitude) : 113.401646,
        }
      })
    }

    return successResponse(contact)
  } catch (error) {
    console.error('更新联系信息失败:', error)
    return errorResponse('更新联系信息失败')
  }
})