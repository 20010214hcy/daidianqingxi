// Host Header 注入漏洞防护中间件
// 验证请求的 Host header 是否在白名单中

const ALLOWED_HOSTS = [
  'ximingpower.com',
  'www.ximingpower.com',
  'localhost',
  'localhost:3000',
  '127.0.0.1',
  '127.0.0.1:3000',
]

export default defineEventHandler((event) => {
  const host = getHeader(event, 'host')
  
  // 如果没有 host header，允许通过（可能是内部请求）
  if (!host) return
  
  // 提取主机名（去除端口）
  const hostname = host.split(':')[0]
  
  // 检查是否在白名单中
  if (!ALLOWED_HOSTS.includes(host) && !ALLOWED_HOSTS.includes(hostname)) {
    console.warn('[安全] 拒绝非法 Host header: ' + host)
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Invalid Host header'
    })
  }
})
