import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, avatar, username, oldPassword, newPassword } = body
    
    const authContext = event.context.auth
    if (!authContext || !authContext.userId) {
      return errorResponse('未登录，请先登录')
    }
    const userId = authContext.userId
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      return errorResponse('用户不存在')
    }
    
    // 更新数据准备
    const updateData: Record<string, string> = {
      name: name !== undefined ? name : user.name,
      email: email !== undefined ? email : user.email,
      avatar: avatar !== undefined ? avatar : user.avatar
    }
    
    // 检查用户名是否被占用（如果修改了用户名）
    if (username && username !== user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username }
      })
      if (existingUser) {
        return errorResponse('用户名已被占用')
      }
      updateData.username = username
    }
    
    // 检查密码修改
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse('请输入旧密码')
      }
      
      // 验证旧密码
      const passwordValid = await bcrypt.compare(oldPassword, user.password)
      if (!passwordValid) {
        return errorResponse('旧密码错误')
      }
      
      // 加密新密码
      updateData.password = await bcrypt.hash(newPassword, 10)
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })
    
    return successResponse({
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      role: updatedUser.role
    }, '更新成功')
  } catch {
    return errorResponse('更新用户信息失败')
  }
})