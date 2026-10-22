export function useApiError() {
  const logError = (context: string, error: unknown) => {
    if (import.meta.dev) {
      console.warn(`[${context}] 请求失败:`, error)
    }
  }

  return { logError }
}

/**
 * 从 $fetch / useFetch 抛出的错误中提取后端返回的用户可读信息。
 * 后端统一用 errorResponse(message, code, event) 返回 { success:false, message },
 * 对应 FetchError 的 data.message 字段。
 *
 * 用法：ElMessage.error(apiErrorMessage(error, '保存失败'))
 * - 能取到后端 message（如「文件内容不是有效的图片」）就显示它
 * - 取不到（网络断开、后端 500 无 body 等）回退到 fallback
 */
export function apiErrorMessage(error: unknown, fallback = '操作失败'): string {
  if (error && typeof error === 'object') {
    const data = (error as { data?: unknown }).data
    if (data && typeof data === 'object') {
      const message = (data as { message?: unknown }).message
      if (typeof message === 'string' && message.trim()) return message
    }
    // Nitro createError 未被 errorResponse 包装时，message 也可能直接挂在错误对象上
    const direct = (error as { message?: unknown }).message
    if (typeof direct === 'string' && direct.trim() && !/^fetcherror|failed to fetch/i.test(direct)) {
      return direct
    }
  }
  return fallback
}
