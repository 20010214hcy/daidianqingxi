import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { filterText } from '~/server/utils/xss'
import { checkRateLimit } from '~/server/utils/rateLimit'
import { realIP } from '~/server/utils/ip'

export default defineEventHandler(async (event) => {
  try {
    // 速率限制：同一 IP 每小时最多 10 条留言（跨 PM2 实例共享）
    // 用真实客户端 IP（XFF 第一段可伪造，见 utils/ip.ts）
    const ip = realIP(event)
    if (!(await checkRateLimit(`msg:${ip}`, 10, 60 * 60 * 1000))) {
      return errorResponse('提交过于频繁，请稍后再试', 429, event)
    }

    const body = await readBody(event)

    const { name, phone, email, company, subject, content } = body

    if (!name || !phone || !content) {
      return errorResponse('姓名、电话和留言内容不能为空', 400, event)
    }

    const message = await prisma.message.create({
      data: {
        updatedAt: new Date(),
        name: filterText(name),
        phone: filterText(phone),
        email: email ? filterText(email) : null,
        company: company ? filterText(company) : null,
        subject: subject ? filterText(subject) : null,
        content: filterText(content),
        status: 'pending',
      },
    })

    return successResponse(message, '留言提交成功，我们会尽快与您联系')
  } catch (error) {
    console.error('提交留言失败:', error)
    return errorResponse('提交留言失败')
  }
})
