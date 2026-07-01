export function useFormatDate() {
  const formatDate = (date: string, options?: { includeDay?: boolean }) => {
    const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit' }
    if (options?.includeDay !== false) {
      opts.day = '2-digit'
    }
    return new Date(date).toLocaleDateString('zh-CN', opts)
  }

  const formatDay = (date: string) => new Date(date).getDate().toString().padStart(2, '0')
  const formatMonth = (date: string) => (new Date(date).getMonth() + 1) + '月'
  const formatYear = (date: string) => new Date(date).getFullYear().toString()

  return { formatDate, formatDay, formatMonth, formatYear }
}
