/**
 * 图片加载失败自动重试（仅一次，带 cache-busting）。
 *
 * 背景：浏览器对 /uploads/、/_ipx/ 用了长强缓存（max-age）。一旦某次传输
 * 被截断/损坏并被写入浏览器缓存，之后 7 天内浏览器不再回源，图片一直裂图，
 * 只能 F5 强刷恢复。本插件在 error 事件（捕获阶段，img error 不冒泡）里
 * 给失败图片追加唯一参数重试一次，绕过损坏缓存，用户无感自愈。
 */
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  window.addEventListener(
    'error',
    (e) => {
      const el = e.target as HTMLImageElement | null
      if (!el || el.tagName !== 'IMG') return
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
    },
    true // 捕获阶段：img 的 error 事件不冒泡
  )
})
