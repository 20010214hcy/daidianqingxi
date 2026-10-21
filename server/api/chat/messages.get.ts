import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

const VISITOR_RE = /^[A-Za-z0-9_-]{16,64}$/

/**
 * 访客拉取新消息（轮询）
 * after = 客户端已知的最大消息 id，只返回比它新的
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const visitorId = String(query.visitorId || '')
    if (!VISITOR_RE.test(visitorId)) {
      return errorResponse('访客标识无效', 400, event)
    }

    const after = Number(query.after) || 0

    const session = await prisma.chatsession.findUnique({ where: { visitorId } })
    if (!session) {
      return errorResponse('会话不存在', 404, event)
    }

    const messages = await prisma.chatmessage.findMany({
      where: {
        sessionId: session.id,
        ...(after > 0 ? { id: { gt: after } } : {}),
      },
      orderBy: { id: 'asc' },
      take: 100,
    })

    // 访客已读到消息，清掉未读标记
    if (session.unreadVisitor > 0) {
      await prisma.chatsession.update({ where: { id: session.id }, data: { unreadVisitor: 0 } })
    }

    return successResponse({
      messages,
      status: session.status,
      sessionId: session.id,
    })
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('拉取客服消息失败:', error)
    return errorResponse('消息拉取失败')
  }
})
