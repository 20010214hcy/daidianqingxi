import type { User } from '~/composables/useAuth'
import { ROLE_PERMISSIONS, type PermissionModule } from '~/types/permissions'

// 路由 → 所需权限模块的映射
const ROUTE_PERMISSIONS: Record<string, PermissionModule> = {
  '/admin': 'dashboard',
  '/admin/articles': 'articles',
  '/admin/cases': 'cases',
  '/admin/services': 'services',
  '/admin/products': 'products',
  '/admin/categories': 'categories',
  '/admin/certificates': 'certificates',
  '/admin/contact': 'contact',
  '/admin/messages': 'messages',
  '/admin/settings': 'settings',
  '/admin/users': 'users',
  '/admin/profile': 'profile',
}

export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith('/@') || to.path.startsWith('/_')) {
    return
  }

  const userState = useState<User | null>('auth_user')
  const cookieUser = useCookie('auth_user').value

  // 从 auth_user cookie 恢复用户状态
  if (!userState.value && cookieUser) {
    try {
      userState.value = JSON.parse(decodeURIComponent(cookieUser))
    } catch {
      // cookie 中 JSON 解析失败，忽略
    }
  }

  const isAuthenticated = !!userState.value

  // 未登录 → 跳转登录页
  if (to.path.startsWith('/admin') && !isAuthenticated) {
    return navigateTo('/login')
  }

  // 已登录访问登录页 → 跳转后台
  if (to.path === '/login' && isAuthenticated) {
    return navigateTo('/admin')
  }

  // 权限检查：匹配路由所需的权限模块
  if (isAuthenticated && to.path.startsWith('/admin')) {
    const userRole = userState.value?.role || ''
    const userPerms = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS] || []

    // 找到最精确匹配的路由权限
    let requiredPerm: PermissionModule | undefined
    let bestMatch = 0
    for (const [routePath, perm] of Object.entries(ROUTE_PERMISSIONS)) {
      if (to.path.startsWith(routePath) && routePath.length > bestMatch) {
        requiredPerm = perm
        bestMatch = routePath.length
      }
    }

    // 如果有权限要求且用户没有该权限，重定向到仪表盘
    if (requiredPerm && !userPerms.includes(requiredPerm)) {
      return navigateTo('/admin')
    }
  }
})
