import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { name, sortOrder } = body

    if (!name || !name.trim()) {
      return errorResponse('分类名称不能为空', 400)
    }

    const existing = await prisma.productcategory.findUnique({
      where: { name: name.trim() },
    })

    if (existing) {
      return errorResponse('分类名称已存在', 400)
    }

    const category = await prisma.productcategory.create({
      data: {
        updatedAt: new Date(),
        name: name.trim(),
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
      },
    })

    return successResponse(category, '分类创建成功')
  } catch (error) {
    console.error('创建分类失败:', error)
    return errorResponse('创建分类失败')
  }
})