import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

// 兜底数据只保留公司名，不留假地址 / 假电话 / 假邮箱。
// 此前这里是「北京市朝阳区工业大道123号…」「400-888-8888」这类占位信息，
// 一旦数据库读取失败，前台页脚、详情页联系卡和结构化数据就会展示
// 与真实情况完全不符的联系方式（真实为河南平顶山 / 0375-3633369）。
const FALLBACK = {
  companyName: '玺铭电力',
  address: '',
  phone1: '',
  phone2: '',
  email1: '',
  email2: '',
  workHours1: '',
  workHours2: '',
}

export default defineEventHandler(async () => {
  try {
    let contact = await prisma.contactinfo.findFirst()

    if (!contact) {
      contact = await prisma.contactinfo.create({
        data: {
          companyName: FALLBACK.companyName,
          address: '',
          phone1: '',
          phone2: '',
          email1: '',
          email2: '',
          workHours1: '',
          workHours2: '',
        }
      })
    }

    return successResponse(contact)
  } catch (error) {
    console.error('获取联系信息失败:', error)
    return successResponse(FALLBACK)
  }
})
