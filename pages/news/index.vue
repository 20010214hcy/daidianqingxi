<template>
  <div>
    <!-- Banner 区 -->
    <section class="news-banner">
      <div class="news-banner-bg">
        <div class="news-banner-overlay" />
      </div>
      <div class="news-banner-content">
        <nav class="breadcrumb">
          <NuxtLink to="/" class="breadcrumb-link">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </NuxtLink>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">新闻中心</span>
        </nav>
        <h1 class="news-banner-title">新闻中心</h1>
      </div>
    </section>

    <!-- 分类筛选 -->
    <section class="sticky top-20 z-30 bg-white border-b border-slate-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2 py-4 overflow-x-auto">
          <button v-for="cat in categories" :key="cat.value"
            @click="switchCategory(cat.value)"
            class="px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200"
            :class="activeCategory === cat.value
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'">
            {{ cat.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- 新闻列表 -->
    <section class="news-list-section">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- 骨架屏 -->
        <div v-if="loading" class="news-list">
          <div v-for="n in 4" :key="n" class="news-item-skeleton">
            <div class="skeleton-img animate-pulse" />
            <div class="skeleton-body">
              <div class="h-5 w-3/4 bg-slate-200 rounded animate-pulse mb-3" />
              <div class="h-4 w-20 bg-slate-200 rounded animate-pulse mb-4" />
              <div class="h-4 w-full bg-slate-200 rounded animate-pulse mb-2" />
              <div class="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <!-- 新闻列表 -->
        <div v-else-if="newsList.length" class="news-list">
          <NuxtLink v-for="item in newsList" :key="item.id"
            :to="`/news/${item.id}`" class="news-item group">
            <div class="news-item-img">
              <img v-if="item.coverImage" :src="item.coverImage" :alt="item.title" />
              <div v-else class="news-item-img-placeholder" />
            </div>
            <div class="news-item-body">
              <h3 class="news-item-title">{{ item.title }}</h3>
              <div class="news-item-date">{{ formatDate(item.publishedAt || item.createdAt) }}</div>
              <p class="news-item-summary">{{ stripHtml(item.content) }}</p>
              <span class="news-item-link">
                查看更多
                <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-20">
          <p class="text-slate-400 text-lg">暂无相关新闻</p>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="news-pagination">
          <button :disabled="currentPage <= 1" @click="changePage(currentPage - 1)" class="page-btn">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button v-for="page in displayPages" :key="page" @click="changePage(page)"
            class="page-btn" :class="{ 'page-btn-active': page === currentPage }">
            {{ page }}
          </button>
          <button :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)" class="page-btn">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types'

definePageMeta({ layout: 'default' })

const { formatDate } = useFormatDate()

const categories = [
  { label: '全部', value: '' },
  { label: '行业动态', value: 'news' },
  { label: '公司新闻', value: 'company' },
  { label: '技术分享', value: 'tech' },
]

const activeCategory = ref('')
const currentPage = ref(1)
const pageSize = 10

// 去掉 HTML 标签，截取指定长度
const stripHtml = (html: string | undefined): string => {
  if (!html) return ''
  const text = html
    .replace(/<[^>]+>/g, '')       // 去掉所有HTML标签
    .replace(/&nbsp;/g, ' ')       // &nbsp; 转空格
    .replace(/&amp;/g, '&')        // &amp; 转 &
    .replace(/&lt;/g, '<')         // &lt; 转 <
    .replace(/&gt;/g, '>')         // &gt; 转 >
    .replace(/&quot;/g, '"')       // &quot; 转 "
    .replace(/\s+/g, ' ')          // 多个空格合并
    .trim()
  return text.length > 200 ? text.slice(0, 200) + '...' : text
}

const queryParams = computed(() => ({
  page: currentPage.value,
  pageSize,
  status: 'published',
  ...(activeCategory.value ? { category: activeCategory.value } : {})
}))

const { data: newsResponse, pending: loading } = useFetch('/api/articles', {
  params: queryParams,
  dedupe: 'cancel',
  initialCache: false,
  transform: (res: any) => {
    if (res?.success && res.data) {
      return { list: res.data.list || [], totalPages: res.data.pagination?.totalPages || 1 }
    }
    return { list: [], totalPages: 1 }
  }
})

const newsList = computed<Article[]>(() => newsResponse.value?.list || [])
const totalPages = computed(() => newsResponse.value?.totalPages || 1)

const displayPages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const switchCategory = (cat: string) => { activeCategory.value = cat; currentPage.value = 1 }
const changePage = (page: number) => { currentPage.value = page; window.scrollTo({ top: 0, behavior: 'smooth' }) }

useHead({
  title: '新闻资讯 - 玺铭电力',
  meta: [
    { name: 'description', content: '了解电力设备带电清洗行业动态、玺铭电力公司新闻和技术分享' },
    { name: 'keywords', content: '电力行业新闻,带电清洗资讯,工业清洗技术,电力设备维护' }
  ]
})
</script>

<style scoped>
.news-banner { position: relative; height: 320px; overflow: hidden; }
.news-banner-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #0c2340 0%, #1a3a5c 50%, #0c2340 100%); }
.news-banner-overlay { position: absolute; inset: 0; background: url('/uploads/hero-bg.jpg') center/cover no-repeat; opacity: 0.15; }
.news-banner-content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 100%; display: flex; flex-direction: column; justify-content: center; }
.breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
.breadcrumb-link { color: rgba(255, 255, 255, 0.6); transition: color 0.2s; }
.breadcrumb-link:hover { color: #fff; }
.breadcrumb-sep { color: rgba(255, 255, 255, 0.3); font-size: 14px; }
.breadcrumb-current { color: rgba(255, 255, 255, 0.8); font-size: 14px; }
.news-banner-title { font-size: 40px; font-weight: 800; color: #fff; letter-spacing: 2px; }

.news-list-section { padding: 40px 0 80px; background: #f5f7fa; min-height: 60vh; }
.news-list { display: flex; flex-direction: column; gap: 20px; }

.news-item { display: flex; gap: 28px; background: #fff; border-radius: 16px; overflow: hidden; text-decoration: none; padding: 24px; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03); }
.news-item:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(26, 115, 232, 0.1); }

.news-item-img { width: 280px; height: 180px; flex-shrink: 0; border-radius: 12px; overflow: hidden; }
.news-item-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.news-item:hover .news-item-img img { transform: scale(1.06); }
.news-item-img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #e0e7ef, #cbd5e1); }

.news-item-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.news-item-title { font-size: 19px; font-weight: 700; color: #1a1a2e; line-height: 1.5; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.3s; }
.news-item:hover .news-item-title { color: #1a73e8; }
.news-item-date { font-size: 13px; color: #9ca3af; margin-bottom: 10px; }
.news-item-summary { font-size: 14px; color: #6b7280; line-height: 1.8; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 14px; flex: 1; }
.news-item-link { display: inline-flex; align-items: center; font-size: 13px; font-weight: 600; color: #1a73e8; letter-spacing: 0.5px; opacity: 0; transform: translateX(-8px); transition: all 0.4s ease; }
.news-item:hover .news-item-link { opacity: 1; transform: translateX(0); }

.news-item-skeleton { display: flex; gap: 28px; background: #fff; border-radius: 16px; padding: 24px; }
.skeleton-img { width: 280px; height: 180px; border-radius: 12px; background: #e2e8f0; flex-shrink: 0; }
.skeleton-body { flex: 1; padding-top: 4px; }

.news-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 48px; }
.page-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; color: #64748b; font-size: 14px; cursor: pointer; transition: all 0.2s; }
.page-btn:hover:not(:disabled) { border-color: #1a73e8; color: #1a73e8; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn-active { background: #1a73e8; border-color: #1a73e8; color: #fff; }
.page-btn-active:hover { background: #1557b0; color: #fff; }

@media (max-width: 768px) {
  .news-banner { height: 240px; }
  .news-banner-title { font-size: 28px; }
  .news-item { flex-direction: column; gap: 16px; padding: 16px; }
  .news-item-img { width: 100%; height: 200px; }
  .news-item-title { font-size: 17px; }
  .news-item-link { opacity: 1; transform: translateX(0); }
  .news-item-skeleton { flex-direction: column; gap: 16px; }
  .skeleton-img { width: 100%; height: 200px; }
}

@media (max-width: 480px) {
  .news-banner { height: 200px; }
  .news-banner-title { font-size: 24px; }
  .news-item-img { height: 160px; }
}
</style>
