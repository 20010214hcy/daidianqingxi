import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { filterText } from '~/server/utils/xss'
import { checkRateLimit } from '~/server/utils/rateLimit'

export default defineEventHandler(async (event) => {
  try {
    // 速率限制：同一 IP 每小时最多 10 条留言
    const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
    if (!checkRateLimit(`msg:${ip}`, 10, 60 * 60 * 1000)) {
      return errorResponse('提交过于频繁，请稍后再试', 429)
    }

    const body = await readBody(event)

    const { name, phone, email, company, subject, content } = body

    if (!name || !phone || !content) {
      return errorResponse('姓名、电话和留言内容不能为空', 400)
    }

    // XSS 过滤：留言字段为纯文本，过滤所有 HTML
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
