export function useApiError() {
  const logError = (context: string, error: unknown) => {
    if (import.meta.dev) {
      console.warn(`[${context}] 请求失败:`, error)
    }
  }

  return { logError }
}
