<template>
  <div class="min-h-screen bg-slate-50">
    <!-- 阅读进度条 -->
    <div class="fixed top-0 left-0 right-0 h-1 z-50">
      <div class="h-full bg-blue-600 origin-left will-change-transform"
        :style="{ transform: `scaleX(${readProgress})` }" />
    </div>

    <!-- 标题区 -->
    <section class="bg-white border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <nav class="flex items-center gap-2 text-sm text-slate-400 mb-5">
          <NuxtLink to="/" class="hover:text-blue-600 transition-colors">首页</NuxtLink>
          <svg class="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
          <NuxtLink to="/news" class="hover:text-blue-600 transition-colors">新闻资讯</NuxtLink>
          <svg class="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
          <span class="text-slate-500 truncate max-w-[300px]">{{ article.title || '...' }}</span>
        </nav>
        <div v-if="article.id">
          <span class="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {{ getCategoryLabel(article.category) }}
          </span>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">{{ article.title }}</h1>
          <div class="flex items-center gap-4 text-sm text-slate-400">
            <span>{{ formatDate(article.publishedAt || article.createdAt) }}</span>
            <span class="w-1 h-1 rounded-full bg-slate-300" />
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

    <!-- 内容区 -->
    <section v-if="article.id" class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-8">
          <!-- 左侧：正文 -->
          <main class="flex-1 min-w-0">
            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <img v-if="article.coverImage" :src="article.coverImage" :alt="article.title" class="w-full h-auto max-h-[480px] object-cover" loading="lazy" />
              <div class="px-8 md:px-12 py-10">
                <article class="prose-content" v-html="sanitizedContent" />
                <div class="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-slate-400">标签：</span>
                    <span class="px-3 py-1 bg-slate-50 text-slate-600 text-xs rounded-full border border-slate-100">{{ getCategoryLabel(article.category) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-slate-400">分享：</span>
                    <button @click="shareArticle" class="share-btn" title="分享文章">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <NuxtLink v-if="prevArticle" :to="`/news/${prevArticle.id}`" class="group flex items-center gap-3 p-5 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                <div class="min-w-0">
                  <span class="text-xs text-slate-400">上一篇</span>
                  <p class="text-sm font-medium text-slate-700 truncate group-hover:text-blue-600">{{ prevArticle.title }}</p>
                </div>
              </NuxtLink>
              <div v-else />
              <NuxtLink v-if="nextArticle" :to="`/news/${nextArticle.id}`" class="group flex items-center gap-3 p-5 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all text-right justify-end">
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
            <div class="sticky top-24 space-y-6">
              <div v-if="relatedArticles.length" class="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 class="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">相关推荐</h3>
                <div class="space-y-3">
                  <NuxtLink v-for="item in relatedArticles" :key="item.id" :to="`/news/${item.id}`" class="group block">
                    <div class="flex gap-3">
                      <div v-if="item.coverImage" class="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <img :src="item.coverImage" :alt="item.title" class="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm text-slate-700 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">{{ item.title }}</p>
                        <span class="text-xs text-slate-400 mt-1 block">{{ formatDate(item.publishedAt || item.createdAt) }}</span>
                      </div>
                    </div>
                  </NuxtLink>
                </div>
              </div>
              <div class="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h4 class="font-bold text-slate-800 mb-2">需要专业服务？</h4>
                <p class="text-sm text-slate-500 mb-5">联系我们获取免费方案和报价</p>
                <NuxtLink to="/contact" class="block w-full text-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">免费咨询</NuxtLink>
              </div>
              <NuxtLink to="/news" class="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-600 transition-colors px-1">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                返回新闻列表
              </NuxtLink>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- 回到顶部按钮 -->
    <button v-show="showBackToTop" @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      title="回到顶部">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>

    <!-- 轻提示 -->
    <Transition name="toast">
      <div v-if="toastText" class="fixed bottom-24 right-8 z-50 px-4 py-2.5 bg-slate-900 text-white text-sm rounded-lg shadow-lg">
        {{ toastText }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify'
import type { Article } from '~/types'

definePageMeta({ layout: 'default' })

const route = useRoute()
const articleId = computed(() => Number(route.params.id))
const { formatDate } = useFormatDate()
const { readProgress } = useReadingProgress()

// 回到顶部
const showBackToTop = ref(false)
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }

onMounted(() => {
  const onScroll = () => { showBackToTop.value = window.scrollY > 300 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

// SSR 拉取文章
const { data: articleRes } = await useFetch(`/api/articles/${articleId.value}`, {
  transform: (res: any) => (res?.success ? res.data : null) as Article | null,
})
const article = computed(() => articleRes.value || ({} as Article))

// 导航列表（SSR）
const { data: navData } = await useFetch('/api/articles', {
  params: { page: 1, pageSize: 100, status: 'published' },
  transform: (res: any) => {
    const list = res?.success ? (res.data?.list || []) : []
    return list.map((a: any) => ({
      id: a.id,
      title: a.title,
      publishedAt: a.publishedAt,
      createdAt: a.createdAt,
      category: a.category,
      coverImage: a.coverImage,
    }))
  },
})

const currentIndex = computed(() => (navData.value || []).findIndex((a: any) => a.id === articleId.value))
const prevArticle = computed(() => (currentIndex.value > 0 ? navData.value![currentIndex.value - 1] : null))
const nextArticle = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < (navData.value?.length || 0) - 1
    ? navData.value![currentIndex.value + 1]
    : null
)
const relatedArticles = computed(() =>
  (navData.value || [])
    .filter((a: any) => a.id !== articleId.value && a.category === article.value.category)
    .slice(0, 5)
)

// 阅读计数（仅客户端）
onMounted(async () => {
  try { await $fetch(`/api/articles/${articleId.value}/view`, { method: 'POST' }) } catch {}
})

const sanitizedContent = computed(() => {
  if (import.meta.server) return article.value.content || ''
  return DOMPurify.sanitize(article.value.content || '')
})

// 分享：优先系统分享，其次复制链接
const toastText = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
const showToast = (text: string) => {
  toastText.value = text
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastText.value = '' }, 2200)
}

const shareArticle = async () => {
  const url = window.location.href
  const title = article.value.title || '玺铭电力新闻'
  if (navigator.share) {
    try {
      await navigator.share({ title, url })
      return
    } catch {
      /* 用户取消或不支持，走复制 */
    }
  }
  try {
    await navigator.clipboard.writeText(url)
    showToast('链接已复制')
  } catch {
    showToast('复制失败，请手动复制地址栏链接')
  }
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = { news: '行业动态', company: '公司新闻', tech: '技术分享' }
  return labels[category] || category
}

const categoryLabel = computed(() => getCategoryLabel(article.value.category || ''))
const plainDescription = computed(() => {
  const text = (article.value.content || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.slice(0, 160)
})

const articleJsonLd = computed(() => {
  if (!article.value.id) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.value.title,
    description: plainDescription.value,
    image: article.value.coverImage ? [article.value.coverImage] : undefined,
    datePublished: article.value.publishedAt || article.value.createdAt,
    dateModified: article.value.updatedAt || article.value.publishedAt || article.value.createdAt,
    inLanguage: 'zh-CN',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.ximingpower.com/news/${article.value.id}`,
    },
    publisher: {
      '@type': 'Organization',
      name: '河南玺铭电力科技有限公司',
      url: 'https://www.ximingpower.com',
    },
    articleSection: categoryLabel.value,
  }
})

useHead({
  title: computed(() => (article.value.title ? `${article.value.title} - 玺铭电力` : '新闻详情 - 玺铭电力')),
  meta: [
    { name: 'description', content: computed(() => plainDescription.value || article.value.title || '玺铭电力新闻详情') },
    { property: 'og:title', content: computed(() => article.value.title || '新闻详情 - 玺铭电力') },
    { property: 'og:description', content: computed(() => plainDescription.value || '') },
    { property: 'og:type', content: 'article' },
    { property: 'og:image', content: computed(() => article.value.coverImage || '') },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => (articleJsonLd.value ? JSON.stringify(articleJsonLd.value) : '')),
    } as any,
  ],
})
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

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
