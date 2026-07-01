import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async () => {
  try {
    let contact = await prisma.contactinfo.findFirst()

    if (!contact) {
      contact = await prisma.contactinfo.create({
        data: {
          companyName: '玺铭电力',
          address: '北京市朝阳区工业大道123号科技大厦A座18层',
          phone1: '400-888-8888',
          phone2: '010-12345678',
          email1: 'contact@daidianqingxi.com',
          email2: 'service@daidianqingxi.com',
          workHours1: '周一至周五：9:00 - 18:00',
          workHours2: '周六：9:00 - 12:00',
        }
      })
    }

    return successResponse(contact)
  } catch (error) {
    console.error('获取联系信息失败:', error)
    return successResponse({
      companyName: '玺铭电力',
      address: '北京市朝阳区工业大道123号科技大厦A座18层',
      phone1: '400-888-8888',
      phone2: '010-12345678',
      email1: 'contact@daidianqingxi.com',
      email2: 'service@daidianqingxi.com',
      workHours1: '周一至周五：9:00 - 18:00',
      workHours2: '周六：9:00 - 12:00',
    })
  }
})