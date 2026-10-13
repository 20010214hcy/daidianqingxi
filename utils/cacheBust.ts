/** 后台预览用：给图片 URL 加时间戳，绕过浏览器缓存 */
export function cacheBust(url?: string | null): string {
  if (!url) return ''
  if (!/^https?:\/\//.test(url) && !url.startsWith('/')) return url
  if (url.includes('nocache=')) return url
  const join = url.includes('?') ? '&' : '?'
  return `${url}${join}nocache=${Date.now()}`
}
