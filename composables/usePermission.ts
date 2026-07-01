import type { User } from './useAuth'
import { ROLE_PERMISSIONS, type PermissionModule } from '~/types/permissions'

export function usePermission() {
  const user = useState<User | null>('auth_user')

  /** 当前用户角色 */
  const role = computed(() => user.value?.role || '')

  /** 是否超级管理员 */
  const isSuperAdmin = computed(() => role.value === 'superadmin')

  /** 是否管理员或以上 */
  const isAdminOrAbove = computed(() => ['superadmin', 'admin'].includes(role.value))

  /** 检查是否有某模块权限 */
  const can = (module: PermissionModule): boolean => {
    const perms = ROLE_PERMISSIONS[role.value as keyof typeof ROLE_PERMISSIONS]
    return perms ? perms.includes(module) : false
  }

  /** 获取角色显示名称 */
  const roleName = computed(() => {
    const names: Record<string, string> = {
      superadmin: '超级管理员',
      admin: '管理员',
      editor: '编辑',
    }
    return names[role.value] || role.value
  })

  return { user, role, isSuperAdmin, isAdminOrAbove, can, roleName }
}
