<template>
  <div>
    <section class="products-banner">
      <div class="products-banner-bg" />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 products-banner-inner">
        <h1 class="products-banner-title">产品中心</h1>
        <p class="products-banner-desc">带电清洗设备 · 储能系统产品，按业务与分类快速筛选</p>
      </div>
    </section>

    <!-- 统一筛选条：业务 + 分类，滚动后保持 sticky -->
    <section class="filter-sticky" :class="{ 'filter-sticky-scrolled': scrolled }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="filter-panel">
          <div class="filter-row">
            <span class="filter-label">业务</span>
            <div class="filter-chips">
              <button
                v-for="tab in unitTabs"
                :key="tab.value"
                type="button"
                class="filter-chip filter-chip-unit"
                :class="{ 'is-active': activeUnit === tab.value }"
                @click="switchUnit(tab.value)"
              >
                <span class="filter-chip-icon" v-html="tab.icon" />
                {{ tab.label }}
              </button>
            </div>
          </div>

          <div class="filter-divider" />

          <div class="filter-row">
            <span class="filter-label">分类</span>
            <div class="filter-chips">
              <button
                type="button"
                class="filter-chip"
                :class="{ 'is-active': activeCategory === null }"
                @click="switchCategory(null)"
              >
                全部产品
              </button>
              <button
                v-for="cat in categories"
                :key="cat.id"
                type="button"
                class="filter-chip"
                :class="{ 'is-active': activeCategory === cat.id }"
                @click="switchCategory(cat.id)"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="products-list-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="loading" class="products-loading">
          <div v-for="n in 8" :key="n" class="product-skeleton" />
        </div>

        <div v-else-if="products.length === 0" class="products-empty">
          <div class="products-empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <p class="products-empty-title">该分类暂无产品</p>
          <p class="products-empty-desc">可切换业务板块或查看全部产品</p>
          <button type="button" class="products-empty-btn" @click="resetFilters">
            查看全部产品
          </button>
        </div>

        <div v-else>
          <div class="products-meta">
            <p class="products-count">
              <template v-if="activeCategoryName">{{ activeCategoryName }} · </template>
              共 <strong>{{ total }}</strong> 件产品
            </p>
          </div>

          <div class="product-grid-fade" :key="`${activeUnit}-${activeCategory}-${currentPage}`">
            <div ref="gridRef" class="product-grid">
              <article
                v-for="product in products"
                :key="product.id"
                class="product-card group"
              >
                <NuxtLink :to="`/products/${product.id}`" class="product-card-link">
                  <div class="product-image-wrapper">
                    <NuxtImg
                      v-if="product.image"
                      :src="product.image"
                      :alt="product.name"
                      class="product-image"
                      width="400"
                      height="300"
                      loading="lazy"
                      sizes="(max-width: 800px) 50vw, (max-width: 1440px) 33vw, 25vw"
                    />
                    <div v-else class="product-image-placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      </svg>
                    </div>
                  </div>

                  <div class="product-card-body">
                    <span v-if="product.category" class="product-cat-line">
                      {{ product.category.name }}
                    </span>
                    <h3 class="product-name">{{ product.name }}</h3>
                    <div v-if="specTags(product).length" class="product-spec-tags">
                      <span v-for="tag in specTags(product)" :key="tag" class="product-spec-tag">
                        {{ tag }}
                      </span>
                    </div>
                    <p class="product-desc">{{ product.description || '暂无描述' }}</p>
                  </div>
                </NuxtLink>

                <div class="product-card-foot">
                  <span v-if="showPrice && Number(product.price) > 0" class="product-price">
                    ¥{{ formatPrice(product.price) }}
                  </span>
                  <span v-else class="product-price product-price-negotiable">面议</span>
                  <NuxtLink to="/contact" class="product-cta">
                    咨询报价
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                  </NuxtLink>
                </div>
              </article>
            </div>
          </div>

          <div v-if="totalPages > 1" class="pagination-wrapper">
            <button
              class="pagination-btn pagination-nav"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
              aria-label="上一页"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button
              v-for="page in visiblePages"
              :key="String(page)"
              class="pagination-btn"
              :class="{ 'pagination-active': page === currentPage, 'pagination-ellipsis': page === '...' }"
              :disabled="page === '...'"
              @click="typeof page === 'number' && goToPage(page)"
            >
              {{ page }}
            </button>
            <button
              class="pagination-btn pagination-nav"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
              aria-label="下一页"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="products-cta">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="products-cta-title">需要定制化产品方案？</h2>
        <p class="products-cta-desc">专业团队可根据现场工况提供设备选型与系统方案</p>
        <NuxtLink to="/contact" class="products-cta-btn">联系我们</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductCategory } from '~/types'

definePageMeta({ layout: 'default' })

// 面包屑 + 当前页产品清单的结构化数据
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首页', item: SITE_ORIGIN + '/' },
    { '@type': 'ListItem', position: 2, name: '产品中心', item: SITE_ORIGIN + '/products' },
  ],
}

const itemListJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  numberOfItems: products.value.length,
  itemListElement: products.value.map((p: Product, i: number) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${SITE_ORIGIN}/products/${p.id}`,
    name: p.name,
  })),
}))

useHead({
  title: '产品中心',
  meta: [
    { name: 'description', content: '玺铭电力产品中心：带电清洗设备、工商业储能、台区储能等专业电力运维产品与解决方案。' },
    { property: 'og:title', content: '产品中心 - 河南玺铭电力科技有限公司' },
    { property: 'og:description', content: '带电清洗设备与储能系统产品，按业务分类快速筛选。' },
    { name: 'keywords', content: '带电清洗设备,高压清洗机,工商业储能,台区储能,清洗剂,检测仪器,安全防护' },
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
    { type: 'application/ld+json', innerHTML: itemListJsonLd },
  ] as any,
})

const PAGE_SIZE = 12
const route = useRoute()
const router = useRouter()

const unitTabs = [
  {
    label: '带电清洗',
    value: 'daidianqingxi',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  },
  {
    label: '储能',
    value: 'chuneng',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="7" width="12" height="14" rx="2"/><path d="M10 7V4h4v3"/><line x1="10" y1="14" x2="14" y2="14"/></svg>',
  },
]

const SITE_ORIGIN = 'https://ximingpower.com'

const activeUnit = ref((route.query.unit as string) || 'daidianqingxi')
// 筛选状态支持从网址直达（如 /products?unit=chuneng&category=7&page=2）
const activeCategory = ref<number | null>(
  route.query.category ? Number(route.query.category) : null
)
const currentPage = ref(Math.max(1, Number(route.query.page) || 1))
const gridRef = ref<HTMLElement | null>(null)
const scrolled = ref(false)

const { refresh: refreshStagger } = useStaggerReveal(gridRef, { delay: 50 })

// 切换业务板块时重置分类与页码
watch(activeUnit, () => {
  activeCategory.value = null
  currentPage.value = 1
})

// 业务 + 分类 + 页码 完整同步到网址：可分享、可后退、刷新不丢
watch([activeUnit, activeCategory, currentPage], () => {
  const query: Record<string, string> = {}
  if (activeUnit.value && activeUnit.value !== 'daidianqingxi') {
    query.unit = activeUnit.value
  }
  if (activeCategory.value !== null) query.category = String(activeCategory.value)
  if (currentPage.value > 1) query.page = String(currentPage.value)
  router.replace({ query })
})

const { data: categoriesData } = useFetch('/api/categories', {
  query: computed(() => ({ businessUnit: activeUnit.value })),
  transform: (res: any) => (res?.success ? res.data || [] : []),
})
// 只展示含有已发布产品的分类，空分类（如「检测仪器」「安全防护」）不再误导点击
const categories = computed<ProductCategory[]>(() =>
  (categoriesData.value || []).filter(
    (c: any) => Number(c?._count?.product ?? 0) > 0
  )
)

const { data: priceData } = useFetch('/api/price-visibility', {
  transform: (res: any) => (res?.success && res.data ? res.data.visible : true),
})
const showPrice = computed(() => priceData.value !== false)

// 计数行给出筛选上下文，避免只剩一个孤零零的数字
const activeCategoryName = computed(() => {
  if (activeCategory.value === null) return ''
  return categories.value.find((c) => c.id === activeCategory.value)?.name || ''
})

// 参数标签：product 表当前没有 specs 字段，后端补上后前端自动生效；
// 无字段时返回空数组，卡片不会留出空行
const specTags = (p: any): string[] => {
  const raw = p?.specs
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
    .slice(0, 3)
    .map((it) => (typeof it === 'string' ? it : String(it?.value ?? it?.label ?? '')))
    .filter((s) => s.trim().length > 0)
}

const productParams = computed(() => ({
  page: currentPage.value,
  pageSize: PAGE_SIZE,
  businessUnit: activeUnit.value,
  ...(activeCategory.value !== null ? { categoryId: activeCategory.value } : {}),
}))

const { data: productsResponse, pending: loading } = useFetch('/api/products', {
  params: productParams,
  getCachedData: () => undefined,
  transform: (res: any) => {
    if (res?.success && res.data) {
      return {
        list: res.data.list || [],
        total: res.data.pagination?.total || 0,
        totalPages: res.data.pagination?.totalPages || 1,
      }
    }
    return { list: [], total: 0, totalPages: 1 }
  },
})

const products = computed<Product[]>(() => productsResponse.value?.list || [])
const total = computed(() => productsResponse.value?.total || 0)
const totalPages = computed(() => productsResponse.value?.totalPages || 1)

onMounted(() => {
  watch(
    products,
    () => {
      nextTick(() => refreshStagger())
    },
    { immediate: true }
  )

  const onScroll = () => {
    scrolled.value = window.scrollY > 120
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const tp = totalPages.value
  const cp = currentPage.value
  if (tp <= 7) {
    for (let i = 1; i <= tp; i++) pages.push(i)
    return pages
  }
  pages.push(1)
  if (cp > 3) pages.push('...')
  const start = Math.max(2, cp - 1)
  const end = Math.min(tp - 1, cp + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (cp < tp - 2) pages.push('...')
  pages.push(tp)
  return pages
})

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const switchUnit = (value: string) => {
  if (activeUnit.value === value) return
  activeUnit.value = value
}

const switchCategory = (categoryId: number | null) => {
  if (activeCategory.value === categoryId) return
  activeCategory.value = categoryId
  currentPage.value = 1
}

const resetFilters = () => {
  activeCategory.value = null
  currentPage.value = 1
}

const formatPrice = (price: number | string | null | undefined) => {
  const num = Number(price)
  if (isNaN(num) || num === 0) return '面议'
  return num.toFixed(2)
}
</script>

<style scoped>
.products-banner {
  position: relative;
  overflow: hidden;
  color: #fff;
}

.products-banner-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 58, 138, 0.88) 100%),
    url('/uploads/hero-bg.webp') center/cover no-repeat;
}

.products-banner-inner {
  position: relative;
  z-index: 1;
  padding: 64px 0 56px;
  text-align: center;
}

.products-banner-title {
  font-size: clamp(26px, 2.6vw, 34px);
  font-weight: 800;
  margin: 0 0 12px;
  letter-spacing: 0.04em;
}

.products-banner-desc {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14.5px;
}

.filter-sticky {
  position: sticky;
  top: 72px;
  z-index: 40;
  background: rgba(248, 250, 252, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
  transition: box-shadow 0.25s ease;
}

.filter-sticky-scrolled {
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.filter-panel {
  padding: 14px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.filter-label {
  flex-shrink: 0;
  width: 36px;
  padding-top: 8px;
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-chip:hover {
  border-color: #93c5fd;
  color: #1d4ed8;
}

.filter-chip.is-active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

.filter-chip-icon {
  display: inline-flex;
  line-height: 0;
}

.filter-divider {
  height: 1px;
  background: #e2e8f0;
}

.products-list-section {
  padding: 40px 0 72px;
  background: #f8fafc;
  min-height: 55vh;
}

.products-meta {
  margin-bottom: 18px;
}

.products-count {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.products-count strong {
  color: #0f172a;
  font-weight: 700;
}

.products-loading {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.product-skeleton {
  height: 340px;
  border-radius: 16px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.products-empty {
  text-align: center;
  padding: 72px 16px;
}

.products-empty-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 18px;
  border-radius: 20px;
  background: #e2e8f0;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.products-empty-icon svg {
  width: 36px;
  height: 36px;
}

.products-empty-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.products-empty-desc {
  margin: 0 0 20px;
  color: #64748b;
  font-size: 14px;
}

.products-empty-btn {
  display: inline-flex;
  padding: 10px 22px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

/* 基础 = 3 列。4 列只在 ≥1441px 生效，避免中间区间出现超窄卡片 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.product-grid-fade {
  animation: gridFadeIn 0.3s ease;
}

@keyframes gridFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.product-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
  border-color: #cbd5e1;
}

.product-card-link {
  display: flex;
  flex-direction: column;
  flex: 1;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}

.product-image-wrapper {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
}

/* contain：产品图实为 632×632 近正方形的位图，用 cover 会上下各裁掉 12.5%
   详情页一直是 contain，此处统一，避免同一张图两个页面显示不一致 */
.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.45s ease;
}

.product-card:hover .product-image {
  transform: scale(1.03);
}

.product-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: linear-gradient(145deg, #f1f5f9, #e2e8f0);
}

.product-image-placeholder svg {
  width: 48px;
  height: 48px;
}

/* 分类从图上浮层移到正文首行。产品名多为「XMDK-G01」这类型号，
   分类是访客判断「这是什么」的首要线索，压在图上不稳且易被图片干扰 */
.product-cat-line {
  display: block;
  margin-bottom: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: #2563eb;
  letter-spacing: 0.02em;
}

.product-card-body {
  padding: 16px 16px 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  margin: 0 0 8px;
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 参数标签行：product 表当前没有 specs 字段，后端返回后才渲染，无数据不留空位 */
.product-spec-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 0 0 8px;
}

.product-spec-tag {
  padding: 2px 7px;
  border-radius: 5px;
  background: #f1f5f9;
  color: #475569;
  font-size: 11px;
  font-weight: 600;
}

.product-desc {
  margin: 0;
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.product-price {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
}

.product-price-negotiable {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

/* 底部：价格 + 单一转化入口。
   原先整卡链接 / 「了解详情」/「咨询」共 3 个入口且前两者目标相同，移动端已自行隐藏其中一个 */
.product-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding: 12px 16px 15px;
  border-top: 1px solid #f1f5f9;
}

.product-cta {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 7px 14px;
  border-radius: 9px;
  background: #2563eb;
  color: #fff;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s ease;
}

.product-cta:hover {
  background: #1d4ed8;
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.pagination-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled):not(.pagination-active):not(.pagination-ellipsis) {
  border-color: #93c5fd;
  color: #1d4ed8;
  background: #eff6ff;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
  font-weight: 700;
}

.pagination-ellipsis {
  cursor: default;
  border-color: transparent;
  background: transparent;
}

.pagination-nav svg {
  width: 18px;
  height: 18px;
}

.products-cta {
  padding: 72px 0;
  background: #fff;
  border-top: 1px solid #e2e8f0;
}

.products-cta-title {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
}

.products-cta-desc {
  margin: 0 0 28px;
  color: #64748b;
  font-size: 15px;
}

.products-cta-btn {
  display: inline-flex;
  padding: 12px 32px;
  border-radius: 12px;
  background: #2563eb;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease;
}

.products-cta-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

/* 4 列只在超大屏出现 */
@media (min-width: 1441px) {
  .product-grid,
  .products-loading {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

/* md-desktop-density */
@media (min-width: 960px) and (max-width: 1440px) {
  .products-banner-inner {
    padding: 52px 0 44px;
  }

  .products-list-section {
    padding: 32px 0 64px;
  }

  .product-card-body {
    padding: 14px 14px 12px;
  }
}

/* 801–1280 统一 3 列 + 紧凑间距。
   原先基础 4 列、媒体查询却从 960px 起跳，801–959px 无规则接手 → 落成 4 列超窄卡 */
@media (max-width: 1280px) {
  .product-grid,
  .products-loading {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

@media (max-width: 800px) {
  .product-grid,
  .products-loading {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .products-banner-inner {
    padding: 40px 0 32px;
  }

  .products-banner-title {
    font-size: 28px;
  }

  .products-banner-desc {
    font-size: 14px;
  }

  .filter-sticky {
    top: 64px;
  }

  .filter-panel {
    padding: 10px 0;
  }

  .filter-chip {
    padding: 6px 12px;
    font-size: 12px;
  }

  .products-list-section {
    padding: 24px 0 48px;
  }

  /* 容器统一 4:3，不再单独改成 1:1 —— 让桌面与移动对同一张图的显示保持一致 */
  .product-card-body {
    padding: 10px 10px 12px;
  }

  .product-name {
    font-size: 13.5px;
    margin-bottom: 6px;
  }

  .product-desc {
    font-size: 12px;
  }

  .product-cat-line {
    font-size: 11px;
    margin-bottom: 5px;
  }

  .product-price {
    font-size: 15px;
  }

  .product-price-negotiable {
    font-size: 12px;
  }

  .product-card-foot {
    padding: 10px 10px 12px;
  }

  .product-cta {
    padding: 6px 12px;
    font-size: 12px;
  }

  .product-card {
    border-radius: 12px;
  }

  .product-skeleton {
    height: 240px;
    border-radius: 12px;
  }

  .pagination-wrapper {
    margin-top: 24px;
  }

  .pagination-btn {
    min-width: 36px;
    height: 36px;
    font-size: 13px;
  }

  .products-cta {
    padding: 48px 0;
  }
}

@media (max-width: 520px) {
  .product-grid,
  .products-loading {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .filter-row {
    flex-direction: column;
    gap: 8px;
  }

  .filter-label {
    width: auto;
    padding-top: 0;
  }

  .products-banner-title {
    font-size: 24px;
  }

  /* 原先直接 display:none，卡片只剩型号与价格；保留两行更能说明这是什么产品 */
  .product-desc {
    font-size: 11.5px;
    -webkit-line-clamp: 2;
  }

  .product-card-foot {
    padding: 9px 9px 11px;
    gap: 6px;
  }

  .product-cta {
    padding: 6px 10px;
  }

  .products-cta-title {
    font-size: 22px;
  }

  .products-empty {
    padding: 48px 12px;
  }
}
</style>
