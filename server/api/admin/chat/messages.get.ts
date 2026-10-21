import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { requirePermission } from '~/server/utils/auth'

/**
 * 客服工作台：拉取某个会话的消息
 * after > 0 时只取增量；after = 0 表示首次打开，随后清空未读
 */
export default defineEventHandler(async (event) => {
  try {
    requirePermission(event, 'chat')

    const query = getQuery(event)
    const sessionId = Number(query.sessionId)
    const after = Number(query.after) || 0

    if (!sessionId || sessionId <= 0) {
      return errorResponse('会话 ID 无效', 400, event)
    }

    const session = await prisma.chatsession.findUnique({ where: { id: sessionId } })
    if (!session) {
      return errorResponse('会话不存在', 404, event)
    }

    const messages = await prisma.chatmessage.findMany({
      where: {
        sessionId,
        ...(after > 0 ? { id: { gt: after } } : {}),
      },
      orderBy: { id: 'asc' },
      take: 200,
    })

    if (session.unreadAdmin > 0) {
      await prisma.chatsession.update({ where: { id: sessionId }, data: { unreadAdmin: 0 } })
    }

    return successResponse({
      session: {
        id: session.id,
        visitorId: session.visitorId,
        name: session.name,
        phone: session.phone,
        pageUrl: session.pageUrl,
        referrer: session.referrer,
        ip: session.ip,
        userAgent: session.userAgent,
        status: session.status,
        createdAt: session.createdAt,
      },
      messages,
    })
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('获取会话消息失败:', error)
    return errorResponse('获取消息失败')
  }
})
