import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

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
        }
      })
    }

    return successResponse(contact)
  } catch (error) {
    console.error('更新联系信息失败:', error)
    return errorResponse('更新联系信息失败')
  }
})