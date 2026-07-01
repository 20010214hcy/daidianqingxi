/**
 * 角色与权限共享常量
 * 服务端和客户端共用，避免重复定义
 */

/** 角色类型 */
export type Role = 'superadmin' | 'admin' | 'editor'

/** 权限模块标识 */
export type PermissionModule =
  | 'dashboard'
  | 'articles' | 'cases' | 'services'
  | 'products' | 'categories' | 'certificates'
  | 'contact' | 'messages'
  | 'settings' | 'users'
  | 'profile'

/** 角色 → 允许的模块映射 */
export const ROLE_PERMISSIONS: Record<Role, PermissionModule[]> = {
  superadmin: [
    'dashboard',
    'articles', 'cases', 'services',
    'products', 'categories', 'certificates',
    'contact', 'messages',
    'settings', 'users',
    'profile',
  ],
  admin: [
    'dashboard',
    'articles', 'cases', 'services',
    'products', 'categories', 'certificates',
    'contact', 'messages',
    'profile',
  ],
  editor: [
    'dashboard',
    'articles', 'cases', 'services',
    'profile',
  ],
}

/** 检查角色是否有某模块权限 */
export function hasPermission(role: string, module: PermissionModule): boolean {
  const perms = ROLE_PERMISSIONS[role as Role]
  return perms ? perms.includes(module) : false
}

/** 获取角色的所有权限模块 */
export function getRolePermissions(role: string): PermissionModule[] {
  return ROLE_PERMISSIONS[role as Role] || []
}

/** 验证是否为合法角色 */
export function isValidRole(role: string): role is Role {
  return role in ROLE_PERMISSIONS
}
