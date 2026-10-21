import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { checkRateLimit } from '~/server/utils/rateLimit'
import { filterText } from '~/server/utils/xss'
import { realIP } from '~/server/utils/ip'

const VISITOR_RE = /^[A-Za-z0-9_-]{16,64}$/
const MAX_LEN = 1000

/**
 * 访客发送消息
 * 限流两道：单 IP 每 5 分钟 40 条（防脚本刷爆），内容长度 1-1000 字
 */
export default defineEventHandler(async (event) => {
  try {
    const ip = realIP(event)
    if (!(await checkRateLimit(`chat:send:${ip}`, 40, 5 * 60 * 1000))) {
      return errorResponse('发送过于频繁，请稍后再试', 429, event)
    }

    const body = await readBody(event)
    const visitorId = String(body?.visitorId || '')
    if (!VISITOR_RE.test(visitorId)) {
      return errorResponse('访客标识无效', 400, event)
    }

    const raw = String(body?.content || '').trim()
    if (!raw) {
      return errorResponse('消息内容不能为空', 400, event)
    }
    if (raw.length > MAX_LEN) {
      return errorResponse(`消息不能超过 ${MAX_LEN} 字`, 400, event)
    }

    const session = await prisma.chatsession.findUnique({ where: { visitorId } })
    if (!session) {
      return errorResponse('会话不存在，请刷新页面重试', 404, event)
    }

    const message = await prisma.chatmessage.create({
      data: {
        sessionId: session.id,
        sender: 'visitor',
        content: filterText(raw),
      },
    })

    await prisma.chatsession.update({
      where: { id: session.id },
      data: {
        lastMessageAt: message.createdAt,
        unreadAdmin: { increment: 1 },
        status: 'open',
      },
    })

    return successResponse(message)
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('访客发送消息失败:', error)
    return errorResponse('发送失败，请稍后再试')
  }
})
