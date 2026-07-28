<template>
  <div>
    <section class="bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">产品展示</h1>
        <p class="text-xl text-slate-300">高品质工业清洗设备与解决方案</p>
      </div>
    </section>

    <section class="py-8 bg-white border-b border-slate-200 sticky top-20 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="switchCategory(cat.id)"
            class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
            :class="activeCategory === cat.id
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'"
          >
            {{ cat.name }}
          </button>
          <button
            @click="switchCategory(null)"
            class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
            :class="activeCategory === null
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'"
          >
            全部产品
          </button>
        </div>
      </div>
    </section>

    <section class="py-16 bg-slate-50 min-h-[60vh]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="products.length === 0" class="text-center py-20">
          <div class="text-6xl mb-4">📦</div>
          <p class="text-xl text-slate-500">暂无产品</p>
        </div>

        <div v-else>
          <div class="flex items-center justify-between mb-6">
            <p class="text-sm text-slate-500">
              共 <span class="font-semibold text-slate-700">{{ total }}</span> 件产品
            </p>
          </div>

          <div class="product-grid-fade" :key="currentPage">
            <div ref="gridRef" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div
                v-for="product in products"
                :key="product.id"
                class="product-card group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm stagger-reveal-item"
              >
                <NuxtLink :to="`/products/${product.id}`" class="block">
                <div class="product-image-wrapper relative overflow-hidden aspect-[4/3]">
                  <img
                    v-if="product.image"
                    :src="product.image"
                    :alt="product.name"
                    class="product-image w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                    <span class="text-5xl">📦</span>
                  </div>
                  <div class="product-overlay absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div class="p-5">
                  <span
                    v-if="product.category"
                    class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mb-3"
                  >
                    {{ product.category.name }}
                  </span>
                  <h3 class="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {{ product.name }}
                  </h3>
                  <p class="text-slate-500 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                    {{ product.description || '暂无描述' }}
                  </p>
                </div>
                </NuxtLink>
                <div class="px-5 pb-5">
                  <div class="flex items-center justify-between">
                    <span v-if="showPrice" class="text-xl font-bold text-red-600">
                      ¥{{ formatPrice(product.price) }}
                    </span>
                    <span v-else class="text-xl font-bold text-red-600 opacity-0 pointer-events-none select-none" aria-hidden="true">
                      ¥00.00
                    </span>
                    <NuxtLink
                      to="/contact"
                      class="inline-flex items-center px-4 py-3 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                      咨询
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!loading && products.length === 0" class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
            <svg class="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <p class="text-lg">暂无产品</p>
            <p class="text-sm mt-1">请稍后查看或联系管理员</p>
          </div>

          <div v-if="totalPages > 1" class="pagination-wrapper">
            <button
              class="pagination-btn pagination-nav"
              :disabled="currentPage === 1"
              @click="goToPage(1)"
              aria-label="首页"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
            </button>

            <button
              class="pagination-btn pagination-nav"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
              aria-label="上一页"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <button
              class="pagination-btn pagination-nav"
              :disabled="currentPage === totalPages"
              @click="goToPage(totalPages)"
              aria-label="末页"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-slate-800 mb-4">需要定制化产品方案？</h2>
        <p class="text-lg text-slate-600 mb-8">
          我们的专业团队可以根据您的具体需求，提供量身定制的产品解决方案
        </p>
        <NuxtLink to="/contact" class="btn-primary">
          联系我们
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: '产品中心 - 玺铭电力',
  meta: [
    { name: 'description', content: '玺铭电力产品中心，涵盖高压清洗设备、智能控制系统、安全防护装备及多系列专业工业清洗产品。' },
    { property: 'og:title', content: '产品中心 - 玺铭电力' },
    { property: 'og:description', content: '高压清洗设备、智能控制系统、安全防护装备及多系列专业工业清洗产品。' },
  ]
})

import type { Product, ProductCategory } from '~/types'

const PAGE_SIZE = 12

const activeCategory = ref<number | null>(null)
const currentPage = ref(1)
const gridRef = ref<HTMLElement | null>(null)

const { refresh: refreshStagger } = useStaggerReveal(gridRef, { delay: 60 })

// SSR 数据获取 - 分类
const { data: categoriesData } = useFetch('/api/categories', {
  transform: (res: any) => res?.success ? (res.data || []) : []
})
const categories = computed<ProductCategory[]>(() => categoriesData.value || [])

// SSR 数据获取 - 价格显示
const { data: priceData } = useFetch('/api/price-visibility', {
  transform: (res: any) => res?.success && res.data ? res.data.visible : true
})
const showPrice = computed(() => priceData.value !== false)

// SSR 数据获取 - 产品列表（响应式参数，变化时自动重新获取）
const productParams = computed(() => ({
  page: currentPage.value,
  pageSize: PAGE_SIZE,
  ...(activeCategory.value !== null ? { categoryId: activeCategory.value } : {})
}))
const { data: productsResponse, pending: loading } = useFetch('/api/products', {
  params: productParams,
  transform: (res: any) => {
    if (res?.success && res.data) {
      return {
        list: res.data.list || [],
        total: res.data.pagination?.total || 0,
        totalPages: res.data.pagination?.totalPages || 1,
        page: res.data.pagination?.page || 1
      }
    }
    return { list: [], total: 0, totalPages: 1, page: 1 }
  }
})
const products = computed<Product[]>(() => productsResponse.value?.list || [])
const total = computed(() => productsResponse.value?.total || 0)
const totalPages = computed(() => productsResponse.value?.totalPages || 1)

// 产品变化时触发 stagger 动画
onMounted(() => {
  watch(products, () => {
    nextTick(() => refreshStagger())
  }, { immediate: true })
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

const switchCategory = (categoryId: number | null) => {
  if (activeCategory.value === categoryId) return
  activeCategory.value = categoryId
  currentPage.value = 1
}

const formatPrice = (price: number | string | null | undefined) => {
  const num = Number(price)
  if (isNaN(num) || num === 0) return '面议'
  return num.toFixed(2)
}
</script>

<style scoped>
.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: #93c5fd;
}

.product-image {
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.product-grid-fade {
  animation: gridFadeIn 0.35s ease;
}

@keyframes gridFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 48px;
  flex-wrap: wrap;
}

.pagination-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.pagination-btn:hover:not(:disabled):not(.pagination-active):not(.pagination-ellipsis) {
  border-color: #93c5fd;
  color: #2563eb;
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
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.pagination-ellipsis {
  cursor: default;
  border-color: transparent;
  background: transparent;
  color: #94a3b8;
}

.pagination-nav svg {
  width: 20px;
  height: 20px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 12px 32px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

@media (max-width: 768px) {
  .product-card {
    border-radius: 16px;
  }
  .pagination-wrapper {
    gap: 4px;
    margin-top: 36px;
  }
  .pagination-btn {
    min-width: 40px;
    height: 40px;
    padding: 0 10px;
    font-size: 14px;
    border-radius: 8px;
  }
  .pagination-nav svg {
    width: 18px;
    height: 18px;
  }
}
@media (max-width: 640px) {
  section.py-20 {
    padding: 48px 0;
  }
  section.py-16 {
    padding: 40px 0;
  }
  section.py-8 {
    padding: 20px 0;
  }
  h2.text-3xl {
    font-size: 22px;
  }
  p.text-lg {
    font-size: 15px;
  }
  p.text-xl {
    font-size: 16px;
  }
  .btn-primary {
    padding: 12px 28px;
    font-size: 15px;
  }
  .pagination-wrapper {
    gap: 3px;
    margin-top: 32px;
  }
  .pagination-btn {
    min-width: 36px;
    height: 36px;
    padding: 0 8px;
    font-size: 13px;
  }
  .pagination-nav svg {
    width: 16px;
    height: 16px;
  }
}
@media (max-width: 480px) {
  .product-card .p-5 {
    padding: 16px;
  }
  .product-card h3 {
    font-size: 16px;
  }
}
</style>