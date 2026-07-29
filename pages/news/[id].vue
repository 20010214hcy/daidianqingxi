<template>
  <div>
    <!-- 阅读进度条 -->
    <div class="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-800/30">
      <div class="h-full bg-white/90 origin-left will-change-transform"
        :style="{ transform: `scaleX(${readProgress})` }" />
    </div>

    <!-- 沉浸式 Hero -->
    <section class="relative min-h-[480px] flex items-end">
      <!-- 背景图 -->
      <div class="absolute inset-0">
        <img v-if="article.coverImage" :src="article.coverImage" :alt="article.title"
          class="w-full h-full object-cover" />
        <div v-else class="w-full h-full bg-gradient-to-br from-slate-800 via-primary-900 to-slate-900" />
        <!-- 暗色遮罩 -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      <!-- 内容 -->
      <div class="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-12 pt-32">
        <!-- 面包屑 -->
        <nav class="flex items-center gap-2 text-sm text-white/60 mb-8">
          <NuxtLink to="/" class="hover:text-white transition-colors">首页</NuxtLink>
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
          <NuxtLink to="/news" class="hover:text-white transition-colors">新闻资讯</NuxtLink>
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
          <span class="text-white/80 truncate max-w-[200px]">{{ article.title || '...' }}</span>
        </nav>

        <div v-if="article.id">
          <span class="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-5">
            {{ getCategoryLabel(article.category) }}
          </span>
          <h1 class="text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight text-white mb-6">
            {{ article.title }}
          </h1>
          <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {{ formatDate(article.publishedAt || article.createdAt) }}
            </span>
            <span v-if="article.user" class="flex items-center gap-1.5">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {{ article.user.name }}
            </span>
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              {{ article.viewCount || 0 }} 次阅读
            </span>
          </div>
        </div>
        <div v-else class="animate-pulse space-y-4">
          <div class="h-5 w-20 bg-white/20 rounded" />
          <div class="h-10 w-3/4 bg-white/20 rounded" />
          <div class="h-4 w-1/3 bg-white/20 rounded" />
        </div>
      </div>
    </section>

    <!-- 文章正文 -->
    <section v-if="article.id" class="bg-white py-12 md:py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <!-- 摘要 -->
        <p v-if="article.summary" class="text-lg text-slate-500 leading-relaxed mb-10 pb-10 border-b border-slate-100 font-medium">
          {{ article.summary }}
        </p>

        <!-- 正文内容 -->
        <article class="prose-content" v-html="sanitizedContent" />

        <!-- 文章底部 -->
        <div class="mt-16 pt-10 border-t border-slate-100">
          <div class="flex items-center justify-between">
            <NuxtLink to="/news"
              class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              返回新闻列表
            </NuxtLink>
            <button @click="scrollToTop"
              class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              回到顶部
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import DOMPurify from "dompurify"
import type { Article } from '~/types'

definePageMeta({ layout: 'default' })

const route = useRoute()
const articleId = Number(route.params.id)
const { formatDate } = useFormatDate()
const { readProgress } = useReadingProgress()

// SSR 数据获取
const { data: articleData } = useFetch(`/api/articles/${articleId}`, {
  transform: (res: any) => res?.success ? res.data : {} as Article
})
const article = computed<Article>(() => articleData.value || {} as Article)

// 客户端加载后异步递增浏览量
onMounted(async () => {
  try {
    await $fetch(`/api/articles/${articleId}/view`, { method: 'POST' })
  } catch (e) {
    // 静默失败，不影响用户体验
  }
})

const sanitizedContent = computed(() => {
  if (process.server) return article.value.content || ""
  return DOMPurify.sanitize(article.value.content || '')
})

useHead({
  title: computed(() => article.value.title ? `${article.value.title} - 玺铭电力` : '新闻详情 - 玺铭电力'),
  meta: [
    { name: 'description', content: computed(() => article.value.summary || article.value.title || '玺铭电力新闻详情') },
    { property: 'og:title', content: computed(() => article.value.title ? `${article.value.title} - 玺铭电力` : '新闻详情 - 玺铭电力') },
  ]
})

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    'news': '行业动态',
    'company': '公司新闻',
    'tech': '技术分享'
  }
  return labels[category] || category
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style>
@media (max-width: 768px) {
  .prose-content {
    font-size: 16px;
    line-height: 1.8;
  }
  .prose-content h1 { font-size: 1.5em; }
  .prose-content h2 { font-size: 1.25em; }
  .prose-content blockquote {
    padding: 0.75em 1em;
  }
}
</style>
