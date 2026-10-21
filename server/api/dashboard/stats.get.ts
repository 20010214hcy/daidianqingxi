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

    const monthStart = new Date(now)
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const [
      articleCount,
      productCount,
      caseCount,
      serviceCount,
      messageCount,
      pendingMessageCount,
      newArticles,
      newProducts,
      newCases,
      newServices,
      categories,
      recentArticles,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.product.count(),
      prisma.projectcase.count(),
      prisma.service.count(),
      prisma.message.count(),
      prisma.message.count({ where: { status: 'pending' } }),
      prisma.article.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.product.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.projectcase.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.service.count({ where: { createdAt: { gte: monthStart } } }),
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

    // 真实环比：本月新增 / 月初存量。base=0 且有新增时 pct=null（前端显示「新增」）
    const trend = (newCount: number, total: number) => {
      const base = total - newCount
      return {
        new: newCount,
        pct: newCount === 0 ? 0 : base > 0 ? Math.round((newCount / base) * 100) : null,
      }
    }

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
      trends: {
        articles: trend(newArticles, articleCount),
        products: trend(newProducts, productCount),
        cases: trend(newCases, caseCount),
        services: trend(newServices, serviceCount),
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