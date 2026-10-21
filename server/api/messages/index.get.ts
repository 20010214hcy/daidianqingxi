import { prisma } from '~/server/utils/db'
import { successResponse, paginatedResponse, errorResponse } from '~/server/utils/response'
import { requirePermission } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // 留言含客户姓名/手机号等个人信息，读取也按权限模块校验
    //（中间件只对写操作校验权限，读操作需处理器自行校验）
    requirePermission(event, 'messages')

    const query = getQuery(event)
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 10
    const status = query.status as string
    
    const where: any = {}
    if (status) {
      where.status = status
    }
    
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.message.count({ where }),
    ])
    
    return paginatedResponse(messages, total, page, pageSize)
  } catch (error: any) {
    // 权限/鉴权错误（带 statusCode）原样抛出，别吞成 500
    if (error?.statusCode) throw error
    console.error('获取留言列表失败:', error)
    return errorResponse('获取留言列表失败')
  }
})
