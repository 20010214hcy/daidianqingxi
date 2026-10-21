import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { requirePermission } from '~/server/utils/auth'
import { filterText } from '~/server/utils/xss'

const MAX_LEN = 1000

/**
 * 客服回复消息
 * senderName 记录回复人用户名，便于多人协作时区分
 */
export default defineEventHandler(async (event) => {
  try {
    requirePermission(event, 'chat')

    const body = await readBody(event)
    const sessionId = Number(body?.sessionId)
    const raw = String(body?.content || '').trim()

    if (!sessionId || sessionId <= 0) {
      return errorResponse('会话 ID 无效', 400, event)
    }
    if (!raw) {
      return errorResponse('回复内容不能为空', 400, event)
    }
    if (raw.length > MAX_LEN) {
      return errorResponse(`回复不能超过 ${MAX_LEN} 字`, 400, event)
    }

    const session = await prisma.chatsession.findUnique({ where: { id: sessionId } })
    if (!session) {
      return errorResponse('会话不存在', 404, event)
    }

    const auth = event.context.auth || {}
    const message = await prisma.chatmessage.create({
      data: {
        sessionId,
        sender: 'admin',
        senderName: auth.username || '客服',
        content: filterText(raw),
      },
    })

    await prisma.chatsession.update({
      where: { id: sessionId },
      data: {
        lastMessageAt: message.createdAt,
        unreadVisitor: { increment: 1 },
        status: 'open',
      },
    })

    return successResponse(message)
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('客服回复失败:', error)
    return errorResponse('回复失败，请稍后再试')
  }
})
