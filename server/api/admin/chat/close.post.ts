import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { requirePermission } from '~/server/utils/auth'

/**
 * 关闭 / 重新打开会话
 * 关闭只是标记状态，访客再次发言会自动恢复 open
 */
export default defineEventHandler(async (event) => {
  try {
    requirePermission(event, 'chat')

    const body = await readBody(event)
    const sessionId = Number(body?.sessionId)
    const status = body?.status === 'open' ? 'open' : 'closed'

    if (!sessionId || sessionId <= 0) {
      return errorResponse('会话 ID 无效', 400, event)
    }

    const session = await prisma.chatsession.findUnique({ where: { id: sessionId } })
    if (!session) {
      return errorResponse('会话不存在', 404, event)
    }

    const updated = await prisma.chatsession.update({
      where: { id: sessionId },
      data: { status, unreadAdmin: status === 'closed' ? 0 : session.unreadAdmin },
    })

    return successResponse({ id: updated.id, status: updated.status })
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('更新会话状态失败:', error)
    return errorResponse('操作失败，请稍后再试')
  }
})
