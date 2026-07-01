export interface User {
  id: number
  username: string
  name?: string
  avatar?: string
  email?: string
  role: string
}

export const useAuth = () => {
  const { logError } = useApiError()

  // 用户信息从 auth_user cookie 读取（非 httpOnly，客户端可访问）
  const user = useState<User | null>('auth_user', () => {
    try {
      const storedUser = useCookie('auth_user').value
      if (storedUser) {
        return JSON.parse(decodeURIComponent(storedUser))
      }
    } catch (error) {
      logError('useAuth:init', error)
    }
    return null
  })

  // auth_token 为 httpOnly cookie，客户端无法读取，仅用于标识会话是否活跃
  // 服务端 API 中间件通过 cookie header 自动验证 token
  const isAuthenticated = computed(() => !!user.value)

  // 记录登录时间，用于判断是否需要刷新 token
  const loginTime = useState<number>('auth_login_time', () => 0)

  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'strict' as const,
  }

  // Token 刷新间隔（5天，token 有效期为 7天）
  const REFRESH_INTERVAL = 5 * 24 * 60 * 60 * 1000

  const login = async (username: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { username, password }
      })

      if (response.success) {
        user.value = response.data.user
        loginTime.value = Date.now()
        // auth_token 由服务端通过 httpOnly cookie 设置
        // 仅在客户端设置 auth_user cookie（用于 UI 状态判断）
        useCookie('auth_user', cookieOptions).value = encodeURIComponent(JSON.stringify(response.data.user))
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error: unknown) {
      const message = error instanceof Error && 'data' in error
        ? (error as { data?: { message?: string } }).data?.message
        : '登录失败'
      return { success: false, message: message || '登录失败' }
    }
  }

  const logout = async () => {
    user.value = null
    loginTime.value = 0
    // 清除客户端 auth_user cookie
    useCookie('auth_user').value = null
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      logError('logout', error)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      const updatedUser = { ...user.value, ...userData }
      user.value = updatedUser
      useCookie('auth_user', cookieOptions).value = encodeURIComponent(JSON.stringify(updatedUser))
    }
  }

  // 刷新 token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await $fetch('/api/auth/refresh', { method: 'POST' })
      if (response.success) {
        loginTime.value = Date.now()
        return true
      }
      return false
    } catch (error) {
      logError('refreshToken', error)
      return false
    }
  }

  // 检查是否需要刷新 token
  const checkAndRefreshToken = async (): Promise<void> => {
    if (!user.value || !loginTime.value) return

    const now = Date.now()
    const timeSinceLogin = now - loginTime.value

    // 如果距离登录时间超过刷新间隔，刷新 token
    if (timeSinceLogin >= REFRESH_INTERVAL) {
      const refreshed = await refreshToken()
      if (!refreshed) {
        // 刷新失败，可能 token 已经过期
        logError('checkAndRefreshToken', new Error('Token 刷新失败'))
      }
    }
  }

  // 验证 token 是否有效（通过调用 profile API）
  const validateAuth = async (): Promise<boolean> => {
    try {
      const response = await $fetch('/api/auth/profile')
      if (response.success && response.data) {
        // 更新本地用户信息
        user.value = response.data
        useCookie('auth_user', cookieOptions).value = encodeURIComponent(JSON.stringify(response.data))
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const initAuth = async () => {
    const storedUser = useCookie('auth_user').value
    if (storedUser) {
      try {
        user.value = JSON.parse(decodeURIComponent(storedUser))
        // 验证 token 是否有效
        const isValid = await validateAuth()
        if (!isValid) {
          // token 无效，清除登录状态
          user.value = null
          useCookie('auth_user').value = null
          loginTime.value = 0
        } else {
          // token 有效，检查是否需要刷新
          await checkAndRefreshToken()
        }
      } catch (error) {
        logError('initAuth', error)
        await logout()
      }
    }
  }

  // 设置定期检查 token 的定时器
  let refreshTimer: ReturnType<typeof setInterval> | null = null

  const startRefreshTimer = () => {
    if (refreshTimer) return
    // 每小时检查一次是否需要刷新 token
    refreshTimer = setInterval(() => {
      checkAndRefreshToken().catch((error) => {
        logError('refreshTimer', error)
      })
    }, 60 * 60 * 1000)
  }

  const stopRefreshTimer = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  if (typeof window !== 'undefined') {
    if (!user.value) {
      initAuth().catch((error) => {
        logError('useAuth:autoInit', error)
      })
    }
    // 启动定时器
    startRefreshTimer()

    // 页面卸载时停止定时器
    window.addEventListener('beforeunload', stopRefreshTimer)
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initAuth,
    updateUser,
    validateAuth,
    refreshToken
  }
}
