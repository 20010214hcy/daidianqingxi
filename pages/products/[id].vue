<template>
  <div class="product-detail-page">
    <!-- 顶栏 -->
    <section class="detail-banner">
      <div class="detail-banner-bg" />
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 detail-banner-inner">
        <nav class="detail-crumb">
          <NuxtLink to="/">首页</NuxtLink>
          <span class="detail-crumb-sep">/</span>
          <NuxtLink to="/products">产品中心</NuxtLink>
          <span class="detail-crumb-sep">/</span>
          <span class="detail-crumb-current">{{ product.name || '...' }}</span>
        </nav>
        <div v-if="product.id" class="detail-banner-meta">
          <span v-if="product.category" class="detail-category-pill">{{ product.category.name }}</span>
          <h1 class="detail-title">{{ product.name }}</h1>
          <p v-if="product.description" class="detail-lead">{{ shortDesc }}</p>
          <ul v-if="highlights.length" class="detail-highlights">
            <li v-for="h in highlights" :key="h">{{ h }}</li>
          </ul>
        </div>
        <div v-else class="detail-banner-loading">加载中...</div>
      </div>
    </section>

    <!-- 主体 -->
    <section v-if="product.id" class="detail-body">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="detail-layout">
          <!-- 左：主图 + 缩略图条 -->
          <div class="detail-media">
            <div class="detail-image-frame">
              <NuxtImg
                v-if="currentImage"
                :src="currentImage"
                :alt="product.name"
                class="detail-image"
                width="720"
                height="720"
                sizes="(max-width: 900px) 100vw, 55vw"
                :img-attrs="{ fetchpriority: 'high' }"
              />
              <div v-else class="detail-image-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
            </div>

            <!-- 后台补 gallery 字段后自动出现，当前只有主图故不渲染 -->
            <div v-if="gallery.length > 1" class="detail-thumbs">
              <button
                v-for="(img, i) in gallery"
                :key="img"
                type="button"
                class="detail-thumb"
                :class="{ 'is-active': i === activeImage }"
                :aria-label="`查看第 ${i + 1} 张图`"
                @click="activeImage = i"
              >
                <NuxtImg :src="img" :alt="`${product.name} 图 ${i + 1}`" width="80" height="80" loading="lazy" />
              </button>
            </div>
          </div>

          <!-- 右：信息卡 -->
          <aside class="detail-side">
            <div class="detail-info-card">
              <h2 class="detail-info-title">产品信息</h2>
              <dl class="detail-info-list">
                <div v-if="product.category" class="detail-info-row">
                  <dt>分类</dt>
                  <dd>{{ product.category.name }}</dd>
                </div>
                <div v-if="unitName" class="detail-info-row">
                  <dt>业务板块</dt>
                  <dd>{{ unitName }}</dd>
                </div>
                <div class="detail-info-row">
                  <dt>价格</dt>
                  <dd>
                    <span v-if="showPrice && Number(product.price) > 0" class="detail-price">
                      ¥{{ formatPrice(product.price) }}
                    </span>
                    <span v-else class="detail-price-negotiable">面议</span>
                  </dd>
                </div>
              </dl>

              <!-- 后台补 specs 字段后自动出现技术参数，当前无字段故不渲染 -->
              <template v-if="specRows.length">
                <h3 class="detail-info-subtitle">技术参数</h3>
                <dl class="detail-info-list">
                  <div v-for="row in specRows" :key="row.label" class="detail-info-row">
                    <dt>{{ row.label }}</dt>
                    <dd>{{ row.value }}</dd>
                  </div>
                </dl>
              </template>

              <NuxtLink to="/contact" class="detail-cta">
                立即咨询
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </NuxtLink>
              <a v-if="contactTel" :href="`tel:${contactTel}`" class="detail-cta-line">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 0 1 2-2h2.6a1 1 0 0 1 .97.76l.9 3.6a1 1 0 0 1-.29.98l-1.2 1.2a14 14 0 0 0 5.3 5.3l1.2-1.2a1 1 0 0 1 .98-.29l3.6.9a1 1 0 0 1 .76.97V19a2 2 0 0 1-2 2h-1C9.7 21 3 14.3 3 6V5z"/>
                </svg>
                电话咨询 {{ contactPhone }}
              </a>
              <NuxtLink to="/products" class="detail-cta-ghost">返回产品列表</NuxtLink>
            </div>
          </aside>
        </div>

        <!-- 内容区：左正文 / 右联系卡 -->
        <div class="detail-content-grid">
          <div class="detail-content-main">
            <div class="detail-intro">
              <div class="detail-intro-accent" />
              <h2 class="detail-intro-title">产品介绍</h2>
              <p v-for="(para, i) in introParagraphs" :key="i" class="detail-intro-text">{{ para }}</p>
              <p v-if="!introParagraphs.length" class="detail-intro-text">
                暂无详细介绍，请联系客服获取产品资料。
              </p>
            </div>
          </div>

          <aside class="detail-content-side">
            <div class="detail-contact-card">
              <h3 class="detail-contact-title">需要技术支持？</h3>
              <p class="detail-contact-desc">可根据现场工况提供设备选型与配套方案。</p>
              <a v-if="contactTel" :href="`tel:${contactTel}`" class="detail-contact-phone">
                {{ contactPhone }}
              </a>
              <NuxtLink to="/contact" class="detail-contact-btn">留言获取产品资料</NuxtLink>
              <div v-if="contactHours || contact.address" class="detail-contact-meta">
                <p v-if="contactHours">{{ contactHours }}</p>
                <p v-if="contact.address">{{ contact.address }}</p>
              </div>
            </div>
          </aside>
        </div>

        <!-- 相关产品 -->
        <div v-if="related.length" class="detail-related">
          <div class="detail-related-head">
            <h2 class="detail-related-title">相关产品</h2>
            <NuxtLink to="/products" class="detail-related-more">
              查看全部
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
          <div class="detail-related-grid">
            <NuxtLink
              v-for="item in related"
              :key="item.id"
              :to="`/products/${item.id}`"
              class="related-card"
            >
              <div class="related-image-wrap">
                <NuxtImg
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  class="related-image"
                  width="360"
                  height="225"
                  loading="lazy"
                  sizes="(max-width: 900px) 100vw, 360px"
                />
                <div v-else class="related-image-placeholder" />
              </div>
              <div class="related-body">
                <h3 class="related-name">{{ item.name }}</h3>
                <span v-if="item.category" class="related-cat">{{ item.category.name }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 移动端吸底转化条：桌面端隐藏，避免遮挡内容 -->
    <div v-if="product.id" class="detail-mobile-bar">
      <a v-if="contactTel" :href="`tel:${contactTel}`" class="detail-mobile-btn detail-mobile-btn-ghost">
        电话咨询
      </a>
      <NuxtLink to="/contact" class="detail-mobile-btn detail-mobile-btn-primary">在线留言</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({ layout: 'default' })

const route = useRoute()
const productId = computed(() => Number(route.params.id))

const SITE_ORIGIN = 'https://ximingpower.com'
const FALLBACK_OG = SITE_ORIGIN + '/images/og-cover.png'

const { data: productData } = await useFetch(
  computed(() => `/api/products/${productId.value}`),
  {
    transform: (res: any) => (res?.success ? res.data : null) as Product | null,
    getCachedData: () => undefined,
  }
)
const product = computed(() => productData.value || ({} as Product))

const { data: priceData } = useFetch('/api/price-visibility', {
  transform: (res: any) => (res?.success && res.data ? res.data.visible : true),
})
const showPrice = computed(() => priceData.value !== false)

// 联系信息来自后台「联系信息」，后台改完前台自动同步
const { data: contactRaw } = useFetch('/api/contact', {
  transform: (res: any) => (res?.success ? res.data : null),
  default: () => null,
})
const contact = computed<any>(() => contactRaw.value || {})
// 注意：contactinfo 表的字段名是 phone1 / phone2 / workHours1，不是 phone
const contactPhone = computed(() =>
  String(contact.value.phone1 || contact.value.phone2 || '').trim()
)
const contactTel = computed(() => contactPhone.value.replace(/[^\d+]/g, ''))
const contactHours = computed(() => String(contact.value.workHours1 || '').trim())

// ---- 以下三项依赖 product 表目前还没有的字段（features / specs / gallery）----
// 后端补上字段后自动生效；字段缺失时返回空数组，页面上完全不留空位
const toList = (raw: any): string[] => {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw
      .map((it) => (typeof it === 'string' ? it : String(it?.value ?? it?.label ?? '')))
      .map((s) => s.trim())
      .filter(Boolean)
  }
  try {
    const parsed = JSON.parse(String(raw))
    return Array.isArray(parsed) ? toList(parsed) : []
  } catch {
    return String(raw)
      .split(/[,，;；\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
}

const toPairs = (raw: any): { label: string; value: string }[] => {
  if (!raw) return []
  let arr: any[] = []
  if (Array.isArray(raw)) {
    arr = raw
  } else {
    try {
      const parsed = JSON.parse(String(raw))
      if (!Array.isArray(parsed)) return []
      arr = parsed
    } catch {
      return []
    }
  }
  return arr
    .map((it) => {
      if (typeof it === 'string') {
        const [label, ...rest] = it.split(/[:：]/)
        return { label: (label || '').trim(), value: rest.join(':').trim() }
      }
      return {
        label: String(it?.label ?? it?.name ?? '').trim(),
        value: String(it?.value ?? it?.text ?? '').trim(),
      }
    })
    .filter((r) => r.label && r.value)
}

const highlights = computed<string[]>(() => toList((product.value as any)?.features).slice(0, 3))
const specRows = computed(() => toPairs((product.value as any)?.specs).slice(0, 8))

// 图集：始终包含主图，后端有 gallery 字段时追加更多图
const activeImage = ref(0)
const gallery = computed<string[]>(() => {
  const main = product.value.image ? [product.value.image] : []
  return [...main, ...toList((product.value as any)?.gallery)].filter(Boolean)
})
const currentImage = computed(
  () => gallery.value[activeImage.value] || product.value.image || ''
)

// 介绍按空行/换行拆段，长文本不再挤成一整块
const introParagraphs = computed(() => {
  const text = String(product.value.description || '').trim()
  if (!text) return []
  return text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
})

// 同分类相关产品
const { data: relatedData } = useFetch('/api/products', {
  query: computed(() => ({
    page: 1,
    pageSize: 4,
    ...(product.value.category?.businessunit?.slug
      ? { businessUnit: product.value.category.businessunit.slug }
      : {}),
    ...(product.value.categoryId ? { categoryId: product.value.categoryId } : {}),
  })),
  transform: (res: any) => {
    const list = res?.success ? res.data?.list || [] : []
    return list.filter((p: Product) => p.id !== Number(route.params.id)).slice(0, 3)
  },
})
const related = computed<Product[]>(() => relatedData.value || [])

const unitName = computed(
  () => product.value.category?.businessunit?.name || ''
)

const shortDesc = computed(() => {
  const text = (product.value.description || '').replace(/\s+/g, ' ').trim()
  return text.length > 80 ? text.slice(0, 80) + '…' : text
})

const formatPrice = (price: number | string | null | undefined) => Number(price || 0).toFixed(2)

const productJsonLd = computed(() => {
  if (!product.value.id) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.value.name,
    description: product.value.description || product.value.name,
    image: product.value.image
      ? [product.value.image.startsWith('http') ? product.value.image : SITE_ORIGIN + product.value.image]
      : undefined,
    category: product.value.category?.name,
    brand: {
      '@type': 'Brand',
      name: '玺铭电力',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_ORIGIN}/products/${product.value.id}`,
      priceCurrency: 'CNY',
      price: Number(product.value.price) > 0 ? Number(product.value.price) : undefined,
      availability: 'https://schema.org/InStock',
    },
  }
})

// og:image：位图直接用产品图；SVG 分享平台不识别，回退到通用分享图
const ogImage = computed(() => {
  const img = product.value.image || ''
  if (!img || /\.svg($|\?)/i.test(img)) return FALLBACK_OG
  if (/^https?:\/\//i.test(img)) return img
  return SITE_ORIGIN + img
})

const metaDescription = computed(() => {
  const text = String(product.value.description || product.value.name || '玺铭电力产品详情')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > 150 ? text.slice(0, 150) + '…' : text
})

// 面包屑结构化数据（对应页面顶部的 首页 / 产品中心 / 产品名）
const breadcrumbJsonLd = computed(() => {
  if (!product.value.id) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: SITE_ORIGIN + '/' },
      { '@type': 'ListItem', position: 2, name: '产品中心', item: SITE_ORIGIN + '/products' },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.value.name,
        item: `${SITE_ORIGIN}/products/${product.value.id}`,
      },
    ],
  }
})

useHead({
  // 站点名后缀由 nuxt.config.ts 的 titleTemplate 统一追加，这里不再重复
  title: computed(() =>
    product.value.name ? `${product.value.name} - 产品中心` : '产品详情'
  ),
  meta: [
    { name: 'description', content: metaDescription },
    { property: 'og:title', content: computed(() => product.value.name || '产品详情') },
    { property: 'og:type', content: 'product' },
    { property: 'og:description', content: computed(() => shortDesc.value || metaDescription.value) },
    { property: 'og:image', content: ogImage },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: ogImage },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => (productJsonLd.value ? JSON.stringify(productJsonLd.value) : '')),
    },
    {
      type: 'application/ld+json',
      innerHTML: computed(() => (breadcrumbJsonLd.value ? JSON.stringify(breadcrumbJsonLd.value) : '')),
    },
  ] as any,
})
</script>

<style scoped>
/* 主题色：primary-600 #2563eb / industrial-dark #0f172a */
.detail-banner {
  position: relative;
  color: #fff;
  overflow: hidden;
}

.detail-banner-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 64, 175, 0.9) 55%, rgba(37, 99, 235, 0.82) 100%);
}

.detail-banner-inner {
  position: relative;
  z-index: 1;
  padding: 36px 0 40px;
}

.detail-crumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 20px;
}

.detail-crumb a {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: color 0.2s ease;
}

.detail-crumb a:hover {
  color: #fff;
}

.detail-crumb-sep {
  opacity: 0.4;
}

.detail-crumb-current {
  color: #fff;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-category-pill {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(147, 197, 253, 0.2);
  border: 1px solid rgba(147, 197, 253, 0.35);
  color: #dbeafe;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
}

.detail-title {
  margin: 0 0 12px;
  font-size: clamp(24px, 2.4vw, 30px);
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 1.25;
}

.detail-lead {
  margin: 0;
  max-width: 640px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
  line-height: 1.7;
}

/* 卖点徽章：后端补 features 字段后自动出现，无字段时不渲染 */
.detail-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.detail-highlights li {
  padding: 5px 13px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.24);
  color: #fff;
  font-size: 12.5px;
  font-weight: 600;
}

.detail-banner-loading {
  padding: 24px 0;
  color: rgba(255, 255, 255, 0.7);
}

.detail-body {
  padding: 40px 0 72px;
  background: #f8fafc;
}

/* 原先 1.4:1 —— 右侧信息卡只有三行内容，与左侧大图高度严重失衡。
   注意不要加 align-items:start：那会让侧栏收缩到内容高度，sticky 随之失效 */
.detail-layout {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 28px;
  margin-bottom: 32px;
}

.detail-image-frame {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  overflow: hidden;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
}

.detail-image {
  width: 100%;
  height: auto;
  max-height: 520px;
  object-fit: contain;
  background: #fff;
}

.detail-image-empty {
  width: 100%;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: linear-gradient(145deg, #f8fafc, #e2e8f0);
}

.detail-image-empty svg {
  width: 64px;
  height: 64px;
}

/* 缩略图条：后端补 gallery 字段后自动出现，无字段时不渲染 */
.detail-thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.detail-thumb {
  width: 64px;
  height: 64px;
  padding: 0;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.detail-thumb.is-active {
  border-color: #2563eb;
}

.detail-thumb :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.detail-side {
  min-width: 0;
}

.detail-info-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 28px 24px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
  position: sticky;
  top: 96px;
}

.detail-info-title {
  margin: 0 0 18px;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  padding-left: 12px;
  border-left: 3px solid #2563eb;
}

.detail-info-subtitle {
  margin: 22px 0 14px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  padding-left: 12px;
  border-left: 3px solid #cbd5e1;
}

.detail-info-list {
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.detail-info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-info-row dt {
  color: #94a3b8;
  font-size: 13px;
  flex-shrink: 0;
}

.detail-info-row dd {
  margin: 0;
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
  text-align: right;
}

.detail-price {
  font-size: 20px;
  font-weight: 800;
  color: #2563eb;
}

.detail-price-negotiable {
  font-size: 15px;
  font-weight: 700;
  color: #475569;
}

.detail-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 20px;
  border-radius: 12px;
  background: #2563eb;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
}

.detail-cta:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.32);
}

.detail-cta-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.detail-cta-ghost:hover {
  border-color: #93c5fd;
  color: #1d4ed8;
  background: #eff6ff;
}

/* 电话直拨：号码取自后台「联系信息」，改后台自动同步 */
.detail-cta-line {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 10px;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.detail-cta-line:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}

/* 内容区两栏：左正文 / 右联系卡（滚动时跟随）。
   同样不加 align-items:start，否则侧栏收缩后联系卡无法 sticky */
.detail-content-grid {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 24px;
  margin-bottom: 36px;
}

.detail-content-main,
.detail-content-side {
  min-width: 0;
}

.detail-contact-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 24px 22px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
  position: sticky;
  top: 96px;
}

.detail-contact-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
}

.detail-contact-desc {
  margin: 0 0 16px;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.detail-contact-phone {
  display: block;
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 800;
  color: #2563eb;
  text-decoration: none;
}

.detail-contact-phone:hover {
  color: #1d4ed8;
}

.detail-contact-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 11px 16px;
  border-radius: 11px;
  background: #2563eb;
  color: #fff;
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease;
}

.detail-contact-btn:hover {
  background: #1d4ed8;
}

.detail-contact-meta {
  margin: 14px 0 0;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
  font-size: 12.5px;
  line-height: 1.7;
  color: #64748b;
}

.detail-contact-meta p {
  margin: 0;
}

.detail-contact-meta p + p {
  margin-top: 4px;
}

.detail-intro {
  position: relative;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 32px 28px 28px 32px;
}

.detail-intro-accent {
  position: absolute;
  left: 0;
  top: 28px;
  bottom: 28px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(180deg, #2563eb, #60a5fa);
}

.detail-intro-title {
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.detail-intro-text {
  margin: 0;
  color: #475569;
  font-size: 15px;
  line-height: 1.85;
  white-space: pre-wrap;
}

/* 多段落之间留出间距，长描述不再挤成一整块 */
.detail-intro-text + .detail-intro-text {
  margin-top: 12px;
}

.detail-related-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.detail-related-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.detail-related-more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.detail-related-more:hover {
  color: #1d4ed8;
}

.detail-related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.related-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.related-card:hover {
  transform: translateY(-3px);
  border-color: #93c5fd;
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.08);
}

.related-image-wrap {
  aspect-ratio: 16 / 10;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  overflow: hidden;
}

/* 与列表页统一：产品图实为近正方形位图，cover 会把设备上下裁掉一部分 */
.related-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.related-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #eff6ff, #dbeafe);
}

.related-body {
  padding: 14px 14px 16px;
}

.related-name {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-cat {
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
}

/* 移动端吸底转化条：桌面隐藏 */
.detail-mobile-bar {
  display: none;
}

@media (max-width: 800px) {
  .detail-mobile-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 40;
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
    background: rgba(255, 255, 255, 0.96);
    border-top: 1px solid #e2e8f0;
    box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.06);
  }

  /* 给吸底条留出空间，避免遮住页尾内容 */
  .detail-body {
    padding-bottom: 88px;
  }

  .detail-mobile-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 8px;
    border-radius: 11px;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
  }

  .detail-mobile-btn-ghost {
    border: 1px solid #bfdbfe;
    background: #eff6ff;
    color: #1d4ed8;
  }

  .detail-mobile-btn-primary {
    background: #2563eb;
    color: #fff;
  }
}

@media (max-width: 900px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .detail-info-card,
  .detail-contact-card {
    position: static;
  }

  .detail-content-grid {
    grid-template-columns: 1fr;
    margin-bottom: 28px;
  }

  .detail-related-grid {
    grid-template-columns: 1fr;
  }

  .detail-title {
    font-size: 26px;
  }
}

@media (max-width: 640px) {
  .detail-banner-inner {
    padding: 22px 0 24px;
  }

  .detail-title {
    font-size: 22px;
    margin-bottom: 8px;
  }

  .detail-lead {
    font-size: 13px;
  }

  .detail-crumb {
    margin-bottom: 14px;
  }

  /* 88px 是给吸底转化条留的位置，不要改回 40px，否则条会盖住页尾 */
  .detail-body {
    padding: 16px 0 88px;
  }

  .detail-layout {
    gap: 14px;
  }

  .detail-image-frame {
    min-height: 200px;
    border-radius: 12px;
  }

  .detail-info-card {
    padding: 18px 16px;
    border-radius: 12px;
  }

  .detail-info-title {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .detail-price {
    font-size: 20px;
  }

  .detail-cta,
  .detail-cta-line,
  .detail-cta-ghost {
    padding: 12px 16px;
    border-radius: 10px;
  }

  .detail-intro {
    padding: 18px 14px 16px 18px;
    border-radius: 12px;
  }

  .detail-contact-card {
    padding: 18px 16px;
    border-radius: 12px;
  }

  .detail-contact-phone {
    font-size: 18px;
  }

  .detail-intro-title {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .detail-intro-text {
    font-size: 14px;
    line-height: 1.7;
  }

  .detail-related-title {
    font-size: 16px;
  }

  .detail-related-grid {
    gap: 10px;
  }

  .related-card {
    border-radius: 12px;
  }

  .related-body {
    padding: 10px 10px 12px;
  }

  .related-name {
    font-size: 13px;
  }
}
</style>
