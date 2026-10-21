// 百度统计 SPA 翻页跟踪
// hm.js 只会自动统计首次落地页，Nuxt 客户端路由跳转必须手动推送 _trackPageview，
// 否则用户在站内连看 5 页也只记 1 次访问。
// 用「上次已统计路径」去重：落地页交给 hm.js 自动统计，路径变化才推送，
// 避免落地页被重复计数（afterEach 在初始化阶段可能多次触发）。
export default defineNuxtPlugin((nuxtApp) => {
  let lastTracked = location.pathname + location.search
  nuxtApp.$router.afterEach((to) => {
    const p = to.fullPath
    if (p === lastTracked) return
    lastTracked = p
    const w = window as any
    if (w._hmt) w._hmt.push(['_trackPageview', p])
  })
})
