export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@element-plus/nuxt', '@nuxt/image', '@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css', '~/assets/css/tiptap-render.css', '~/assets/css/prose.css', '~/assets/css/section-header.css'],

  // 图片优化
  image: {
    quality: 80,
    format: ['webp', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    // 预设
    presets: {
      cover: {
        modifiers: {
          fit: 'cover',
          format: 'webp',
          quality: 80,
        },
      },
      avatar: {
        modifiers: {
          fit: 'cover',
          format: 'webp',
          quality: 70,
          width: 100,
          height: 100,
        },
      },
    },
  },

  // Nitro 配置（服务端渲染优化）
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  // 实验性功能
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    keepalive: false,
    head: {
      titleTemplate: (title) => title ? title + " - 河南玺铭电力科技有限公司" : "河南玺铭电力科技有限公司 - 带电清洗与储能系统集成服务商",
      // 移除 Google Fonts，使用系统字体
      link: [
        // Canonical URL（使用模板会在运行时替换）
        { rel: 'canonical', href: 'https://www.ximingpower.com' },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: "专业带电清洗服务、储能系统集成，电力设备清洗，工业清洗工程" },
        { name: 'keywords', content: "带电清洗,电力设备清洗,工业清洗,高压清洗,玺铭电力,化学清洗,储能系统,储能设备,储能集成" },
        // Open Graph
        { property: 'og:image', content: '/images/og-cover.svg' },
        { property: "og:site_name", content: "河南玺铭电力科技有限公司" },
        { property: 'og:locale', content: 'zh_CN' },
        // 性能提示
        { 'http-equiv': 'x-dns-prefetch-control', content: 'on' },
      ],
      script: [
        {
          innerHTML: `(function(){var _odp=Object.defineProperty;var _safe=['navigator','screen','location','localStorage','sessionStorage'];Object.defineProperty=function(o,p,d){if(o===window&&_safe.indexOf(p)>-1){return o}return _odp.call(Object,o,p,d)}})()`,
          type: 'text/javascript',
        }
      ],
    }
  },

  devServer: {
    port: 3000,
    host: '::'
  },

  // 构建优化
  build: {
    transpile: ['element-plus'],
  },

  // Vite 优化
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
          }
        }
      },
      cssCodeSplit: true,
    },
    css: {
      devSourcemap: false,
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  // Sitemap 配置
  sitemap: {
    hostname: 'https://www.ximingpower.com',
    gzip: true,
    exclude: ['/admin/**', '/api/**', '/login'],
    routes: [
      '/',
      '/about',
      '/services',
      '/cases',
      '/news',
      '/contact',
      '/products',
    ],
  },

  // 路由规则（缓存、重定向等）
  routeRules: {
    // 静态页面缓存
    '/': { swr: 60 },
    '/about': { swr: 60 },
    '/contact': { swr: 60 },
    '/services': { swr: 60 },
    '/cases': { swr: 60 },
    '/news': { swr: false },
    // API 缓存（开发环境禁用）
    '/api/**': { swr: false },
  },
})
