/**
 * 图片加载失败自动重试（仅一次，带 cache-busting）。
 *
 * 背景：浏览器对 /uploads/、/_ipx/ 用了长强缓存（max-age）。一旦某次传输
 * 被截断/损坏并被写入浏览器缓存，之后缓存有效期内浏览器不再回源，图片一直
 * 裂图，只能 F5 强刷恢复。本插件让失败图片自动追加唯一参数重试一次，
 * 绕过损坏缓存，用户无感自愈。
 *
 * 两个触点（缺一不可）：
 * 1. window error 捕获阶段（img error 不冒泡）—— 接住插件挂载之后发生的失败。
 * 2. 挂载后主动补扫 document.images —— SSR 页面的图片在 HTML 解析期就开始
 *    加载，解析期的失败早于本插件挂载，error 事件接不住，必须补扫。
 */
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const retry = (el: HTMLImageElement) => {
    if (el.dataset.imgRetried === '1') return // 防循环：只重试一次
    const raw = el.currentSrc || el.src
    if (!raw) return
    let url: URL
    try {
      url = new URL(raw, location.href)
    } catch {
      return
    }
    // 仅处理同源图片，避免外链图床的流量被放大
    if (url.origin !== location.origin) return

    el.dataset.imgRetried = '1'
    url.searchParams.set('_r', String(Date.now()))
    // srcset 存在时浏览器优先用 srcset，必须清掉才能让新 src 生效
    if (el.srcset) el.srcset = ''
    el.src = url.toString()
  }

  window.addEventListener(
    'error',
    (e) => {
      const el = e.target as HTMLImageElement | null
      if (!el || el.tagName !== 'IMG') return
      retry(el)
    },
    true // 捕获阶段
  )

  // 补扫：解析期已失败的图（complete 且 naturalWidth=0 = 加载/解码失败）
  const sweep = () => {
    for (const img of Array.from(document.images)) {
      if (img.complete && img.naturalWidth === 0) retry(img)
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sweep)
  } else {
    sweep()
  }
  // 水合后 Vue 可能重渲染出新的失败图，延迟再扫一次兜底
  setTimeout(sweep, 3000)
})
