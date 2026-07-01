export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@element-plus/nuxt', '@nuxt/image', '@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css'],

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
      title: '带电清洗 - 专业工业清洗服务',
      // 移除 Google Fonts，使用系统字体
      link: [
        // Canonical URL（使用模板会在运行时替换）
        { rel: 'canonical', href: 'https://www.daidianqingxi.com' },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '专业带电清洗服务，电力设备清洗，工业清洗工程' },
        // Open Graph
        { property: 'og:image', content: '/images/og-cover.svg' },
        { property: 'og:site_name', content: '玺铭电力' },
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
    hostname: 'https://www.daidianqingxi.com',
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
    '/news': { swr: 60 },
    // API 缓存（开发环境禁用）
    '/api/**': { swr: false },
  },
})
