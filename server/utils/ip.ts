/**
 * 真实客户端 IP 提取（防限流绕过）。
 *
 * 部署形态：nginx 与应用同机，正常流量都从本机回环（127.0.0.1）进来：
 *   - X-Real-IP 由 nginx 用 $remote_addr「覆盖」写入，客户端无法伪造 → 可信
 *   - X-Forwarded-For 是 $proxy_add_x_forwarded_for「追加」式，
 *     第一段是攻击者可控的，只有 nginx 补的最后一段可信
 * 直连 :3000 的请求（非回环来源）一律不认代理头，防止伪造 XFF/X-Real-IP
 * 绕过登录渐进延迟和留言频率限制。
 */
export function realIP(event: any): string {
  const remote: string = event.node?.req?.socket?.remoteAddress || ''
  const viaLocalProxy =
    remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1'

  if (viaLocalProxy) {
    const xri = getHeader(event, 'x-real-ip')
    if (xri) return xri.trim()
    const xff = getHeader(event, 'x-forwarded-for')
    if (xff) {
      const parts = xff.split(',')
      return parts[parts.length - 1].trim()
    }
  }
  return remote || 'unknown'
}
