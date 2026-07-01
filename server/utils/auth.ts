import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { hasPermission, type PermissionModule } from '~/types/permissions'

// 重新导出供其他服务端文件使用
export { hasPermission, getRolePermissions, isValidRole, type Role, type PermissionModule } from '~/types/permissions'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production')
}

if (!JWT_SECRET) {
  console.warn('[auth] ⚠️ JWT_SECRET 未配置，使用随机生成的开发密钥（重启后 token 失效）')
}

const SECRET = JWT_SECRET || crypto.randomBytes(32).toString('hex')

// ===== 密码与 Token =====

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: { userId: number; username: string; role: string }): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: number; username: string; role: string } | null {
  try {
    return jwt.verify(token, SECRET) as { userId: number; username: string; role: string }
  } catch {
    return null
  }
}

/**
 * 要求当前用户具有指定角色（用于 API 路由）
 * 在 defineEventHandler 内调用：
 *   const auth = requireRole(event, 'superadmin', 'admin')
 */
export function requireRole(event: any, ...roles: string[]) {
  const auth = event.context.auth
  if (!auth) {
    throw createError({ statusCode: 401, message: '未登录' })
  }
  if (!roles.includes(auth.role)) {
    throw createError({ statusCode: 403, message: '权限不足' })
  }
  return auth
}

/**
 * 要求当前用户具有指定模块权限（用于 API 路由）
 * 在 defineEventHandler 内调用：
 *   requirePermission(event, 'users')
 */
export function requirePermission(event: any, module: PermissionModule) {
  const auth = event.context.auth
  if (!auth) {
    throw createError({ statusCode: 401, message: '未登录' })
  }
  if (!hasPermission(auth.role, module)) {
    throw createError({ statusCode: 403, message: '权限不足' })
  }
  return auth
}
