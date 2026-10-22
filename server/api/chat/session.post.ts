import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { checkRateLimit } from '~/server/utils/rateLimit'
import { filterText } from '~/server/utils/xss'
import { realIP } from '~/server/utils/ip'

// 访客标识：浏览器端生成的随机串（UUID 或 32 位随机十六进制）
const VISITOR_RE = /^[A-Za-z0-9_-]{16,64}$/
const PHONE_RE = /^1[3-9]\d{9}$/

/**
 * 创建或恢复会话
 * 访客首次打开聊天窗时调用；之后每次打开也调用，可顺带补充姓名/手机号
 */
export default defineEventHandler(async (event) => {
  try {
    const ip = realIP(event)
    // 单 IP 每小时最多 60 次会话请求（正常访客远低于此，防脚本刷表）
    if (!(await checkRateLimit(`chat:session:${ip}`, 60, 60 * 60 * 1000))) {
      return errorResponse('请求过于频繁，请稍后再试', 429, event)
    }

    const body = await readBody(event)
    const visitorId = String(body?.visitorId || '')
    if (!VISITOR_RE.test(visitorId)) {
      return errorResponse('访客标识无效', 400, event)
    }

    const pageUrl = body?.pageUrl ? String(body.pageUrl).slice(0, 500) : null
    const referrer = body?.referrer ? String(body.referrer).slice(0, 500) : null
    const name = body?.name ? filterText(String(body.name)).slice(0, 32) : ''
    const phone = body?.phone ? String(body.phone).replace(/\s|-/g, '') : ''

    if (phone && !PHONE_RE.test(phone)) {
      return errorResponse('手机号格式不正确', 400, event)
    }

    // lookup=true：只恢复已有会话（页面加载/点开聊天窗时），不创建新会话
    const lookup = body?.lookup === true

    const userAgent = getHeader(event, 'user-agent')?.slice(0, 500) || null

    const existing = await prisma.chatsession.findUnique({ where: { visitorId } })
    let session

    if (existing) {
      if (lookup) {
        // 纯恢复模式：不做任何写操作（不更新页面路径、不重开已关闭会话、不清未读）
        session = existing
      } else {
        // 只补充信息，不覆盖已有值；关闭的会话重新打开
        const data: Record<string, unknown> = {}
        if (pageUrl && pageUrl !== existing.pageUrl) data.pageUrl = pageUrl
        if (name && name !== existing.name) data.name = name
        if (phone && phone !== existing.phone) data.phone = phone
        if (existing.status === 'closed') data.status = 'open'
        session = Object.keys(data).length
          ? await prisma.chatsession.update({ where: { visitorId }, data })
          : existing
      }
    } else if (lookup) {
      // 从未有过会话：返回空壳，绝不创建（访客没发消息就不进后台工作台）
      return successResponse({ sessionId: 0, status: 'open', name: null, phone: null, messages: [] })
    } else {
      session = await prisma.chatsession.create({
        data: {
          visitorId,
          pageUrl,
          referrer,
          ip,
          userAgent,
          name: name || null,
          phone: phone || null,
          lastMessageAt: new Date(),
        },
      })
    }

    // 最近 50 条历史（倒序取再翻转，兼容 Prisma 的 take 语义）
    const recent = await prisma.chatmessage.findMany({
      where: { sessionId: session.id },
      orderBy: { id: 'desc' },
      take: 50,
    })
    const messages = recent.reverse()

    if (!lookup && session.unreadVisitor > 0) {
      await prisma.chatsession.update({ where: { id: session.id }, data: { unreadVisitor: 0 } })
    }

    return successResponse({
      sessionId: session.id,
      status: session.status,
      name: session.name,
      phone: session.phone,
      messages,
    })
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('创建客服会话失败:', error)
    return errorResponse('会话创建失败，请稍后再试')
  }
})
