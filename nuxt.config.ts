export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@element-plus/nuxt', '@nuxt/image', '@nuxtjs/sitemap'],
  css: ['~/assets/css/main.css', '~/assets/css/tiptap-render.css', '~/assets/css/prose.css', '~/assets/css/section-header.css'],
  image: {
    provider: 'ipx',
    quality: 80,
    format: ['webp', 'jpg'],
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 },
    presets: {
      cover: { modifiers: { fit: 'cover', format: 'webp', quality: 80 } },
      avatar: { modifiers: { fit: 'cover', format: 'webp', quality: 70, width: 100, height: 100 } },
    },
  },
  nitro: { compressPublicAssets: true, minify: true, routeRules: { '/api/**': {} } },
  experimental: { payloadExtraction: true, renderJsonPayloads: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    keepalive: false,
    head: {
      // titleTemplate 统一在 app.vue 里定义（config 内的函数模板在 SSR 不生效）
      link: [
        // 注意：canonical 已移除硬编码，改由 app.vue 按当前路径动态生成
        // 页面级如需覆盖，自行 useHead({ link: [{ rel: 'canonical', href }] })
        { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'LLM Site Information' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'alternate', type: 'text/plain', href: '/ai.txt', title: 'AI Discovery' },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '专业带电清洗服务、储能系统集成，电力设备清洗，工业清洗工程' },
        { name: 'keywords', content: '带电清洗,电力设备清洗,工业清洗,高压清洗,玺铭电力,化学清洗,储能系统,储能设备,储能集成' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: '河南玺铭电力科技有限公司 - 带电清洗与储能系统集成' },
        { property: 'og:description', content: '专业带电清洗服务、储能系统集成，电力设备清洗，工业清洗工程' },
        // og:url 已移除硬编码，改由 app.vue 按当前路径动态生成
        { property: 'og:image', content: 'https://ximingpower.com/images/og-cover.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:site_name', content: '河南玺铭电力科技有限公司' },
        { property: 'og:locale', content: 'zh_CN' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '河南玺铭电力科技有限公司 - 带电清洗与储能系统集成' },
        { name: 'twitter:description', content: '专业带电清洗服务、储能系统集成，电力设备清洗，工业清洗工程' },
        { 'http-equiv': 'x-dns-prefetch-control', content: 'on' },
      ],
      script: [
        { innerHTML: '(function(){var _odp=Object.defineProperty;var _safe=["navigator","screen","location","localStorage","sessionStorage"];Object.defineProperty=function(o,p,d){if(o===window&&_safe.indexOf(p)>-1){return o}return _odp.call(Object,o,p,d)}})()', type: 'text/javascript' },
      ],
    }
  },
  devServer: { port: 3000, host: '::' },
  build: { transpile: ['element-plus'] },
  vite: { build: { rollupOptions: { output: { manualChunks: { 'element-plus': ['element-plus'] } } }, cssCodeSplit: true }, css: { devSourcemap: false } },
  typescript: { strict: true, typeCheck: false },
  sitemap: { hostname: 'https://ximingpower.com', gzip: true, exclude: ['/admin/**', '/api/**', '/login'], sources: ['/api/sitemap'] },
  routeRules: {
    '/': { swr: 30 },
    '/about': { swr: 600 },
    '/contact': { swr: 30 },
    '/services': { swr: 600 },
    '/services/**': { swr: 600 },
    '/cases': { swr: 600 },
    '/cases/**': { swr: 600 },
    '/news': { swr: 30 },
    '/news/**': { swr: 30 },
    '/products': { swr: 30 },
    '/products/**': { swr: 30 },
    '/solutions': { swr: 600 },
    '/solutions/**': { swr: 600 },
    // ⚠️ 以下 API 一律不缓存。
    // Nitro 的 routeRules 只按路径匹配、不区分请求方法：一旦给带写操作的 API 开 swr，
    // 后台的 POST/PUT/DELETE 会直接读到上一次 GET 的缓存响应，
    // 表现为「提示保存成功、但前台毫无变化」。此前 /api/settings 配了 swr:600，
    // 后台改一次设置前台最长要等 10 分钟才生效。/api/products 早就禁过，漏了其余几个。
    '/api/articles': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/articles/**': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/services': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/services/**': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/products': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/products/**': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/cases': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/cases/**': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/categories': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/certificates': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/contact': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/settings': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/dashboard': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/dashboard/**': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/users': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/users/**': { swr: false, headers: { 'Cache-Control': 'no-store' } },
    '/api/auth/**': { noswr: true },
    '/api/media': { noswr: true, headers: { 'Cache-Control': 'no-store' } },
    '/api/media/**': { noswr: true, headers: { 'Cache-Control': 'no-store' } },
    '/api/upload': { noswr: true },
    '/api/upload/**': { noswr: true },
    '/api/messages': { noswr: true },
    '/api/messages/**': { noswr: true },
    '/api/email/**': { noswr: true },
  },
})
