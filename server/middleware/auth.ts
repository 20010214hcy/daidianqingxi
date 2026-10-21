import { verifyToken, hasPermission, type PermissionModule } from '~/server/utils/auth'

const protectedPaths = [
  '/api/articles', '/api/cases', '/api/services',
  '/api/messages', '/api/settings', '/api/upload',
  '/api/products', '/api/categories', '/api/certificates',
  '/api/contact', '/api/price-visibility', '/api/dashboard',
  '/api/auth', '/api/users',
  '/api/media', '/api/email',
  '/api/chat', '/api/admin',
]

const publicReadPaths = [
  '/api/articles', '/api/cases', '/api/services', '/api/certificates',
  '/api/products', '/api/categories', '/api/settings', '/api/contact',
  '/api/price-visibility',  // 价格可见性允许公开读取
  '/api/chat',              // 访客轮询自己的会话消息（凭 visitorId）
]

// 公开的写入路径（允许未登录用户提交）
// 注意：messages 只放行「精确路径 POST /api/messages」（提交留言），
//       带 id 的 PUT/DELETE（管理操作）仍需登录并校验角色权限
// chat：访客创建会话 / 发送消息，凭浏览器生成的 visitorId
const publicWritePaths = [
  '/api/messages',  // 允许未登录用户提交留言
  '/api/chat',      // 允许未登录访客发起咨询
]

// 路径前缀 -> 所需权限模块（写操作才校验；读操作走 publicReadPaths 放行）
// 与前端 layouts/admin.vue 的菜单 permission、types/permissions.ts 的 ROLE_PERMISSIONS 一一对应
const writePermissionMap: Array<{ prefix: string; module: PermissionModule }> = [
  { prefix: '/api/articles', module: 'articles' },
  { prefix: '/api/cases', module: 'cases' },
  { prefix: '/api/services', module: 'services' },
  { prefix: '/api/products', module: 'products' },
  { prefix: '/api/categories', module: 'categories' },
  { prefix: '/api/certificates', module: 'certificates' },
  { prefix: '/api/messages', module: 'messages' },
  { prefix: '/api/admin/chat', module: 'chat' },
  { prefix: '/api/contact', module: 'contact' },
  { prefix: '/api/settings', module: 'settings' },
  { prefix: '/api/dashboard', module: 'dashboard' },
  { prefix: '/api/users', module: 'users' },
  // 价格可见性开关属于产品管理；邮件测试/清缓存属于网站设置
  { prefix: '/api/price-visibility', module: 'products' },
  { prefix: '/api/email', module: 'settings' },
  // 媒体资源：上传/管理归属于内容编辑（articles 权限）
  { prefix: '/api/upload', module: 'articles' },
  { prefix: '/api/media', module: 'articles' },
]

export default defineEventHandler(async (event) => {
  const path = event.path
  const isProtected = protectedPaths.some(p => path.startsWith(p))
  if (!isProtected) return

  // 允许公开的GET请求
  if (event.method === 'GET' && publicReadPaths.some(p => path.startsWith(p))) return

  // 允许公开的写入请求（如提交留言）
  // messages 仅精确路径 POST /api/messages 公开；带 id 的管理操作需登录
  const isPublicWrite = publicWritePaths.some(p => {
    if (p === '/api/messages') return path === '/api/messages'
    return path.startsWith(p)
  })
  if (event.method === "POST" && isPublicWrite) return

  // 精确放行：文章阅读计数（只把 viewCount 加 1，不读取也不修改内容）
  // 前端每次打开新闻详情页会 POST 到这里；若不放行会返回 401，导致浏览量永远为 0
  if (event.method === 'POST' && /^\/api\/articles\/\d+\/view$/.test(path)) return

  // 允许登录和初始化请求
  if (path === '/api/auth/login' || path === '/api/auth/init') return

  const cookies = parseCookies(event)
  let token: string | null = cookies.auth_token || null

  if (!token) {
    const authorization = getHeader(event, 'authorization')
    if (authorization?.startsWith('Bearer ')) {
      token = authorization.slice(7)
    }
  }

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: '未登录，请先登录' })
  }

  const payload = verifyToken(token)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: '登录已过期，请重新登录' })
  }

  event.context.auth = payload

  // 写操作（POST/PUT/DELETE）做角色权限校验：防止 editor 绕过前端直接调 API 越权
  if (event.method === 'POST' || event.method === 'PUT' || event.method === 'DELETE') {
    const rule = writePermissionMap.find((r) => path.startsWith(r.prefix))
    if (rule && !hasPermission(payload.role, rule.module)) {
      throw createError({ statusCode: 403, statusMessage: '权限不足：当前角色无权执行此操作' })
    }
  }
})
