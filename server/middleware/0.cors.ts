export default defineEventHandler((event) => {
  const allowedOrigins = [
    'https://ximingpower.com',
    'https://www.ximingpower.com',
  ]

  const origin = getHeader(event, 'origin')

  if (origin && allowedOrigins.includes(origin)) {
    setResponseHeader(event, 'Access-Control-Allow-Origin', origin)
    setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')
    setResponseHeader(event, 'Access-Control-Allow-Credentials', 'true')
    setResponseHeader(event, 'Access-Control-Max-Age', '86400')
  }

  // 处理预检请求
  if (event.method === 'OPTIONS') {
    setResponseStatus(event, 204)
    return ''
  }
})
