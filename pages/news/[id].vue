<template>
  <div>
    <!-- 阅读进度条 -->
    <div class="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-800/30">
      <div class="h-full bg-blue-600 origin-left will-change-transform"
        :style="{ transform: `scaleX(${readProgress})` }" />
    </div>

    <!-- 简洁标题区 -->
    <section class="bg-gradient-to-b from-slate-50 to-white pt-24 pb-10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 面包屑 -->
        <nav class="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <NuxtLink to="/" class="hover:text-slate-700 transition-colors">首页</NuxtLink>
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
          <NuxtLink to="/news" class="hover:text-slate-700 transition-colors">新闻资讯</NuxtLink>
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
          <span class="text-slate-600 truncate max-w-[300px]">{{ article.title || '...' }}</span>
        </nav>

        <div v-if="article.id">
          <span class="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {{ getCategoryLabel(article.category) }}
          </span>
          <h1 class="text-2xl md:text-3xl lg:text-[34px] font-bold leading-tight text-slate-900 mb-4">
            {{ article.title }}
          </h1>
          <div class="flex items-center gap-4 text-sm text-slate-400">
            <span>{{ formatDate(article.publishedAt || article.createdAt) }}</span>
            <span>·</span>
            <span>{{ article.viewCount || 0 }} 次阅读</span>
          </div>
        </div>
        <div v-else class="animate-pulse space-y-3">
          <div class="h-4 w-16 bg-slate-200 rounded" />
          <div class="h-8 w-3/4 bg-slate-200 rounded" />
          <div class="h-3 w-1/3 bg-slate-200 rounded" />
        </div>
      </div>
    </section>

    <!-- 两栏布局 -->
    <section v-if="article.id" class="bg-white py-10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-12">

          <!-- 左侧：正文 -->
          <main class="flex-1 min-w-0">
            <!-- 摘要 -->
            <p v-if="article.summary" class="text-base text-slate-500 leading-relaxed mb-8 pb-6 border-b border-slate-100">
              {{ article.summary }}
            </p>

            <!-- 正文 -->
            <article class="prose-content" v-html="sanitizedContent" />

            <!-- 标签 + 分享 -->
            <div class="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-2">
                <span class="text-sm text-slate-400">标签：</span>
                <span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">{{ getCategoryLabel(article.category) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-slate-400">分享：</span>
                <button @click="copyLink" class="share-btn" title="复制链接">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                </button>
              </div>
            </div>

            <!-- 上一篇 / 下一篇 -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <NuxtLink v-if="prevArticle" :to="`/news/${prevArticle.id}`"
                class="group flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                <div class="min-w-0">
                  <span class="text-xs text-slate-400">上一篇</span>
                  <p class="text-sm font-medium text-slate-700 truncate group-hover:text-blue-600">{{ prevArticle.title }}</p>
                </div>
              </NuxtLink>
              <div v-else />
              <NuxtLink v-if="nextArticle" :to="`/news/${nextArticle.id}`"
                class="group flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-right justify-end">
                <div class="min-w-0">
                  <span class="text-xs text-slate-400">下一篇</span>
                  <p class="text-sm font-medium text-slate-700 truncate group-hover:text-blue-600">{{ nextArticle.title }}</p>
                </div>
                <svg class="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </NuxtLink>
            </div>
          </main>

          <!-- 右侧：侧边栏 -->
          <aside class="hidden lg:block w-72 flex-shrink-0">
            <div class="sticky top-24 space-y-8">

              <!-- 相关推荐 -->
              <div v-if="relatedArticles.length">
                <h3 class="text-base font-bold text-slate-800 mb-4">相关推荐</h3>
                <div class="space-y-3">
                  <NuxtLink v-for="item in relatedArticles" :key="item.id" :to="`/news/${item.id}`"
                    class="group block p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div class="flex gap-3">
                      <div v-if="item.coverImage" class="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <img :src="item.coverImage" :alt="item.title" class="w-full h-full object-cover" />
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-slate-700 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">{{ item.title }}</p>
                        <span class="text-xs text-slate-400 mt-1 block">{{ formatDate(item.publishedAt || item.createdAt) }}</span>
                      </div>
                    </div>
                  </NuxtLink>
                </div>
              </div>

              <!-- 联系 CTA -->
              <div class="bg-slate-900 rounded-2xl p-6 text-white">
                <h4 class="font-bold text-lg mb-2">需要专业服务？</h4>
                <p class="text-sm text-slate-300 mb-5">联系我们获取免费方案和报价</p>
                <NuxtLink to="/contact" class="block w-full text-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors">
                  免费咨询
                </NuxtLink>
              </div>

              <!-- 返回 -->
              <NuxtLink to="/news" class="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                返回新闻列表
              </NuxtLink>

            </div>
          </aside>

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

// 数据获取
const { data: articleData } = useFetch(`/api/articles/${articleId}`, {
  transform: (res: any) => res?.success ? res.data : {} as Article
})
const article = computed<Article>(() => articleData.value || {} as Article)

// 文章列表（上一篇/下一篇/相关）
const { data: navData } = useFetch('/api/articles', {
  params: { page: 1, pageSize: 100, status: 'published' },
  transform: (res: any) => {
    const list = res?.success ? (res.data?.list || []) : []
    return list.map((a: any) => ({ id: a.id, title: a.title, publishedAt: a.publishedAt, createdAt: a.createdAt, category: a.category, coverImage: a.coverImage }))
  }
})

const currentIndex = computed(() => (navData.value || []).findIndex((a: any) => a.id === articleId))
const prevArticle = computed(() => currentIndex.value > 0 ? navData.value[currentIndex.value - 1] : null)
const nextArticle = computed(() => currentIndex.value >= 0 && currentIndex.value < (navData.value?.length || 0) - 1 ? navData.value[currentIndex.value + 1] : null)

const relatedArticles = computed(() => {
  return (navData.value || [])
    .filter((a: any) => a.id !== articleId && a.category === article.value.category)
    .slice(0, 5)
})

// 浏览量
onMounted(async () => {
  try { await $fetch(`/api/articles/${articleId}/view`, { method: 'POST' }) } catch {}
})

const sanitizedContent = computed(() => {
  if (process.server) return article.value.content || ""
  return DOMPurify.sanitize(article.value.content || '')
})

const copyLink = async () => {
  try { await navigator.clipboard.writeText(window.location.href); alert('链接已复制') } catch {}
}

useHead({
  title: computed(() => article.value.title ? `${article.value.title} - 玺铭电力` : '新闻详情 - 玺铭电力'),
  meta: [
    { name: 'description', content: computed(() => article.value.summary || article.value.title || '玺铭电力新闻详情') },
  ]
})

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = { news: '行业动态', company: '公司新闻', tech: '技术分享' }
  return labels[category] || category
}
</script>

<style scoped>
.share-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}
.share-btn:hover {
  border-color: #1a73e8;
  color: #1a73e8;
}
</style>
