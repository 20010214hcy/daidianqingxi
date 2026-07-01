import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)

    if (!id) {
      return errorResponse('产品ID不能为空', 400)
    }

    const { name, description, price, categoryId, image, status, sortOrder } = body

    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = Number(price)
    if (categoryId !== undefined) updateData.categoryId = Number(categoryId)
    if (image !== undefined) updateData.image = image
    if (status !== undefined) updateData.status = status
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder)

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    })

    return successResponse(product, '产品更新成功')
  } catch (error) {
    console.error('更新产品失败:', error)
    return errorResponse('更新产品失败')
  }
})