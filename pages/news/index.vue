<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="新闻资讯" subtitle="了解行业动态与公司最新消息" />

    <!-- 分类筛选 -->
    <section class="sticky top-16 z-30 bg-white border-b border-slate-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

    <!-- 时间轴 -->
    <section class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 骨架屏 -->
        <div v-if="loading" class="space-y-10">
          <div v-for="n in 4" :key="n" class="flex gap-8">
            <div class="flex-shrink-0 w-20 pt-2">
              <div class="h-4 w-16 bg-slate-200 rounded animate-pulse ml-auto" />
            </div>
            <div class="flex-shrink-0 relative">
              <div class="w-3 h-3 bg-slate-200 rounded-full animate-pulse" />
            </div>
            <div class="flex-1 border border-slate-200 rounded-2xl overflow-hidden">
              <div class="flex gap-6 p-6">
                <div class="w-48 h-32 bg-slate-200 rounded-xl animate-pulse flex-shrink-0" />
                <div class="flex-1 space-y-3">
                  <div class="h-5 w-16 bg-slate-200 rounded animate-pulse" />
                  <div class="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
                  <div class="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div class="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 时间轴内容 -->
        <div v-else-if="newsList.length" class="relative">
          <!-- 时间轴线 -->
          <div class="absolute left-[88px] top-0 bottom-0 w-px bg-gradient-to-b from-primary-200 via-slate-200 to-transparent hidden md:block" />

          <div class="space-y-8">
            <template v-for="(group, groupIdx) in groupedNews" :key="group.date">
              <!-- 日期标签 -->
              <div class="hidden md:flex items-center gap-6 mb-2" :class="groupIdx > 0 && 'mt-2'">
                <div class="flex-shrink-0 w-20 text-right">
                  <span class="text-sm font-bold text-slate-400">{{ group.dateShort }}</span>
                </div>
                <div class="flex-shrink-0 w-3 flex justify-center">
                  <div class="w-2.5 h-2.5 rounded-full bg-primary-400 ring-4 ring-white" />
                </div>
                <div class="flex-1 border-b border-slate-100" />
              </div>

              <!-- 该日期下的文章 -->
              <NuxtLink v-for="news in group.items" :key="news.id" :to="`/news/${news.id}`"
                class="group flex gap-6 md:gap-8 items-start">
                <!-- 日期（桌面端占位） -->
                <div class="hidden md:block flex-shrink-0 w-20 pt-5">
                  <span class="text-xs text-slate-400 block text-right">
                    {{ formatShortDate(news.publishedAt || news.createdAt) }}
                  </span>
                </div>

                <!-- 节点 -->
                <div class="hidden md:flex flex-shrink-0 w-3 justify-center pt-6">
                  <div class="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-primary-500 group-hover:scale-125 transition-all duration-200" />
                </div>

                <!-- 卡片 -->
                <div class="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 transition-[transform,box-shadow,border-color] duration-300 will-change-transform">
                  <div class="flex flex-col sm:flex-row gap-0 sm:gap-6">
                    <!-- 图片 -->
                    <div class="sm:w-52 flex-shrink-0 overflow-hidden">
                      <div class="aspect-[16/10] sm:aspect-auto sm:h-full">
                        <img v-if="news.coverImage" :src="news.coverImage" :alt="news.title"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div v-else class="w-full h-full min-h-[140px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <svg class="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                            <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v6H7V8z"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <!-- 内容 -->
                    <div class="flex-1 py-5 pr-6 sm:pr-6 pl-6 sm:pl-0">
                      <!-- 移动端日期 -->
                      <span class="md:hidden text-xs text-slate-400 mb-2 block">
                        {{ formatDate(news.publishedAt || news.createdAt) }}
                      </span>
                      <div class="flex items-center gap-3 mb-2.5">
                        <span class="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full">
                          {{ getCategoryLabel(news.category) }}
                        </span>
                      </div>
                      <h2 class="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {{ news.title }}
                      </h2>
                      <p v-if="news.summary" class="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">
                        {{ news.summary }}
                      </p>
                      <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-2.5 transition-all">
                        阅读全文
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </template>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-20 text-slate-400">
          <svg class="w-14 h-14 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v6H7V8z"/>
          </svg>
          <p class="text-lg font-semibold text-slate-600 mb-1">暂无新闻</p>
          <span class="text-sm">敬请期待最新资讯</span>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-16">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1"
            class="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button v-for="page in displayPages" :key="page" @click="changePage(page)"
            class="w-10 h-10 flex items-center justify-center border rounded-xl text-sm font-medium transition-all"
            :class="page === currentPage
              ? 'bg-slate-900 text-white border-slate-900'
              : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'">
            {{ page }}
          </button>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages"
            class="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types'

definePageMeta({ layout: 'default' })

useHead({
  title: "新闻资讯",
  meta: [
    { name: 'description', content: '玺铭电力新闻资讯，涵盖行业动态、公司新闻、技术分享，了解电力清洗行业前沿信息。' },
    { name: 'keywords', content: '电力行业新闻,带电清洗资讯,工业清洗技术,电力设备维护,清洗行业动态' },
  ]
})

const { formatDate } = useFormatDate()

const activeCategory = ref('')
const currentPage = ref(1)
const PAGE_SIZE = 8

const categories = [
  { label: '全部', value: '' },
  { label: '行业动态', value: 'news' },
  { label: '公司新闻', value: 'company' },
  { label: '技术分享', value: 'tech' },
]

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = { 'news': '行业动态', 'company': '公司新闻', 'tech': '技术分享' }
  return labels[category] || category
}

// SSR 数据获取
const queryParams = computed(() => ({
  page: currentPage.value,
  pageSize: PAGE_SIZE,
  ...(activeCategory.value ? { category: activeCategory.value } : {})
}))
const { data: newsResponse, pending: loading } = useFetch('/api/articles', {
  params: queryParams,
  transform: (res: any) => {
    if (res?.success && res.data) {
      return { list: res.data.list || [], totalPages: res.data.pagination?.totalPages || 1 }
    }
    return { list: [], totalPages: 1 }
  }
})
const newsList = computed<Article[]>(() => newsResponse.value?.list || [])
const totalPages = computed(() => newsResponse.value?.totalPages || 1)

// 按日期分组
const groupedNews = computed(() => {
  const groups: { date: string; dateShort: string; items: Article[] }[] = []
  const map = new Map<string, Article[]>()

  for (const item of newsList.value) {
    const d = new Date(item.publishedAt || item.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(item)
  }

  for (const [date, items] of map) {
    const d = new Date(date)
    groups.push({
      date,
      dateShort: `${d.getMonth() + 1}月${d.getDate()}日`,
      items
    })
  }

  return groups
})

const formatShortDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

const displayPages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const switchCategory = (category: string) => {
  activeCategory.value = category
  currentPage.value = 1
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 300, behavior: 'smooth' })
}
</script>
