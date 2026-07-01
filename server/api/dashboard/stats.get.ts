import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

let cache: { data: any; timestamp: number } | null = null
const CACHE_TTL = 30 * 1000

export default defineEventHandler(async (event) => {
  try {
    const now = Date.now()
    if (cache && now - cache.timestamp < CACHE_TTL) {
      return successResponse(cache.data)
    }

    const [
      articleCount,
      productCount,
      caseCount,
      serviceCount,
      messageCount,
      pendingMessageCount,
      categories,
      recentArticles,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.product.count(),
      prisma.projectcase.count(),
      prisma.service.count(),
      prisma.message.count(),
      prisma.message.count({ where: { status: 'pending' } }),
      prisma.productcategory.findMany({
        include: { _count: { select: { product: true } } },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, createdAt: true },
      }),
    ])

    const chartData = categories.map((c) => ({
      label: c.name,
      value: c._count.product,
    }))

    const systemInfo = {
      uptime: `${Math.floor(process.uptime() / 3600)}小时${Math.floor((process.uptime() % 3600) / 60)}分钟`,
      memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      nodeVersion: process.version,
      status: 'healthy' as const,
    }

    const data = {
      counts: {
        articles: articleCount,
        products: productCount,
        cases: caseCount,
        services: serviceCount,
        messages: messageCount,
        pendingMessages: pendingMessageCount,
      },
      chart: chartData,
      recentArticles,
      system: systemInfo,
    }

    cache = { data, timestamp: now }
    return successResponse(data)
  } catch {
    return errorResponse('获取仪表盘数据失败')
  }
})