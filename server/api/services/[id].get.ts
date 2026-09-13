import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return errorResponse('服务ID不能为空', 400)
    }

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        businessunit: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
      },
    })

    if (!service) {
      return errorResponse('服务不存在', 404)
    }

    let relatedProducts: any[] = []
    let relatedCases: any[] = []

    if (service.businessUnitId) {
      const categoryIds = await prisma.productcategory.findMany({
        where: { businessUnitId: service.businessUnitId },
        select: { id: true }
      })
      const catIds = categoryIds.map(c => c.id)

      if (catIds.length > 0) {
        relatedProducts = await prisma.product.findMany({
          where: { categoryId: { in: catIds }, status: 'published' },
          include: { productcategory: { select: { id: true, name: true } } },
          take: 6,
          orderBy: { sortOrder: 'asc' }
        })
        relatedProducts = relatedProducts.map(p => {
          const { productcategory, ...rest } = p as any
          return { ...rest, category: productcategory }
        })
      }

      relatedCases = await prisma.projectcase.findMany({
        where: { businessUnitId: service.businessUnitId, status: 'published' },
        take: 6,
        orderBy: { createdAt: 'desc' }
      })
    }

    return successResponse({
      ...service,
      relatedProducts,
      relatedCases
    })
  } catch (error) {
    console.error('获取服务详情失败:', error)
    return errorResponse('获取服务详情失败')
  }
})
