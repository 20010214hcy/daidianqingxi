import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { requirePermission } from '~/server/utils/auth'

/**
 * 客服工作台：会话列表
 * 中间件对 GET 只校验登录，因此这里必须自己校验 chat 权限（editor 无权看客户信息）
 */
export default defineEventHandler(async (event) => {
  try {
    requirePermission(event, 'chat')

    const query = getQuery(event)
    const page = Math.max(1, Number(query.page) || 1)
    const pageSize = Math.min(50, Math.max(1, Number(query.pageSize) || 20))
    const status = typeof query.status === 'string' ? query.status : ''

    // 只显示「真实咨询」：至少有一条消息，或访客留了手机号/姓名（有效线索）
    // 仅点开聊天窗但没发消息的访客不进工作台列表
    const where: Record<string, unknown> = {
      OR: [{ chatmessage: { some: {} } }, { phone: { not: null } }, { name: { not: null } }],
    }
    if (status && status !== 'all') where.status = status

    const [total, sessions, unreadAgg] = await Promise.all([
      prisma.chatsession.count({ where }),
      prisma.chatsession.findMany({
        where,
        orderBy: { lastMessageAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          chatmessage: { orderBy: { id: 'desc' }, take: 1 },
        },
      }),
      prisma.chatsession.aggregate({ _sum: { unreadAdmin: true } }),
    ])

    const list = sessions.map((s) => ({
      id: s.id,
      visitorId: s.visitorId,
      name: s.name,
      phone: s.phone,
      pageUrl: s.pageUrl,
      status: s.status,
      unreadAdmin: s.unreadAdmin,
      lastMessageAt: s.lastMessageAt,
      createdAt: s.createdAt,
      lastMessage: s.chatmessage[0]
        ? {
            id: s.chatmessage[0].id,
            sender: s.chatmessage[0].sender,
            content: s.chatmessage[0].content,
            createdAt: s.chatmessage[0].createdAt,
          }
        : null,
    }))

    return successResponse({
      list,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      unreadTotal: unreadAgg._sum.unreadAdmin || 0,
    })
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('获取客服会话列表失败:', error)
    return errorResponse('获取会话列表失败')
  }
})
