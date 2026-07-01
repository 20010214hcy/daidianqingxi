import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { hashPassword } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // 生产环境禁止调用此接口
  if (process.env.NODE_ENV === 'production') {
    setResponseStatus(event, 403)
    return errorResponse('生产环境不允许初始化管理员', 403)
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { username: 'admin' }
    })

    if (existingUser) {
      return successResponse(null, '管理员已存在')
    }

    const hashedPassword = await hashPassword('admin123')
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        role: 'superadmin'
      }
    })

    return successResponse(null, '超管初始化成功！用户名：admin，密码：admin123')
  } catch {
    return errorResponse('初始化失败')
  }
})
