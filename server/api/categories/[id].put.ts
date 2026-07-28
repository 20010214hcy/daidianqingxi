import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)

    if (!id) {
      return errorResponse('分类ID不能为空', 400)
    }

    const { name, sortOrder, businessUnitId } = body

    if (name !== undefined) {
      const existing = await prisma.productcategory.findFirst({
        where: {
          name: name.trim(),
          id: { not: id },
        },
      })

      if (existing) {
        return errorResponse('分类名称已存在', 400)
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder)
    if (businessUnitId !== undefined) updateData.businessUnitId = businessUnitId ? Number(businessUnitId) : null

    const category = await prisma.productcategory.update({
      where: { id },
      data: updateData,
    })

    return successResponse(category, '分类更新成功')
  } catch (error) {
    console.error('更新分类失败:', error)
    return errorResponse('更新分类失败')
  }
})
