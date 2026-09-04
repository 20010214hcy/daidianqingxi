import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { filterXss } from '~/server/utils/xss'
import { sendEmail, generateReplyEmailHtml } from '~/server/utils/email'

const VALID_STATUSES = ['pending', 'replied', 'closed'] as const

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)

    if (!id) {
      return errorResponse('留言ID不能为空', 400)
    }

    // 获取原留言信息
    const originalMessage = await prisma.message.findUnique({
      where: { id }
    })

    if (!originalMessage) {
      return errorResponse('留言不存在', 404)
    }

    const updateData: Record<string, unknown> = {}

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return errorResponse('无效的状态值', 400)
      }
      updateData.status = body.status
    }

    let emailSent = false

    if (body.reply !== undefined && body.reply.trim()) {
      updateData.reply = filterXss(body.reply)
      updateData.repliedAt = new Date()
      updateData.status = 'replied'

      // 发送邮件通知
      if (originalMessage.email && body.sendEmail !== false) {
        try {
          const html = generateReplyEmailHtml({
            name: originalMessage.name,
            originalMessage: originalMessage.content,
            replyContent: body.reply
          })

          emailSent = await sendEmail(
            originalMessage.email,
            `【玺铭电力】您留言的回复 - ${originalMessage.subject || '留言咨询'}`,
            html
          )
        } catch (emailError) {
          console.error('发送回复邮件失败:', emailError)
          // 邮件发送失败不影响回复保存
        }
      }
    }

    const message = await prisma.message.update({
      where: { id },
      data: updateData,
    })

    const responseMessage = emailSent
      ? '回复成功，已发送邮件通知用户'
      : body.reply
        ? '回复成功'
        : '状态更新成功'

    return successResponse({
      ...message,
      emailSent
    }, responseMessage)
  } catch (error) {
    console.error('处理留言失败:', error)
    return errorResponse('处理留言失败')
  }
})
