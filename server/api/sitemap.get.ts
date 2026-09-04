import { prisma } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const routes: string[] = ['/', '/about', '/services', '/cases', '/news', '/contact', '/products', '/solutions']

  try {
    // 动态服务页面
    const services = await prisma.service.findMany({
      where: { status: 'published' },
      select: { id: true, updatedAt: true }
    })
    services.forEach(s => routes.push(`/services/${s.id}`))

    // 动态案例页面
    const cases = await prisma.projectcase.findMany({
      where: { status: 'published' },
      select: { id: true, updatedAt: true }
    })
    cases.forEach(c => routes.push(`/cases/${c.id}`))

    // 动态文章页面
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      select: { id: true, updatedAt: true }
    })
    articles.forEach(a => routes.push(`/news/${a.id}`))

    // 动态产品页面
    const products = await prisma.product.findMany({
      where: { status: 'published' },
      select: { id: true, updatedAt: true }
    })
    products.forEach(p => routes.push(`/products/${p.id}`))

    // 动态解决方案页面
    const solutionServices = await prisma.service.findMany({
      where: { status: 'published' },
      select: { id: true }
    })
    solutionServices.forEach(s => routes.push(`/solutions/${s.id}`))

  } catch (error) {
    console.error('Sitemap 数据获取失败:', error)
  }

  return routes
})
