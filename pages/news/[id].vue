<template>
  <div>
    <!-- 阅读进度条 -->
    <div class="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-800/30">
      <div class="h-full bg-white/90 origin-left will-change-transform"
        :style="{ transform: `scaleX(${readProgress})` }" />
    </div>

    <!-- 沉浸式 Hero -->
    <section class="relative min-h-[420px] flex items-end">
      <div class="absolute inset-0">
        <img v-if="article.coverImage" :src="article.coverImage" :alt="article.title"
          class="w-full h-full object-cover" />
        <div v-else class="w-full h-full bg-gradient-to-br from-slate-800 via-primary-900 to-slate-900" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>
      <div class="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-10 pt-28">
        <nav class="flex items-center gap-2 text-sm text-white/60 mb-6">
          <NuxtLink to="/" class="hover:text-white transition-colors">首页</NuxtLink>
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
          <NuxtLink to="/news" class="hover:text-white transition-colors">新闻资讯</NuxtLink>
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
          <span class="text-white/80 truncate max-w-[200px]">{{ article.title || '...' }}</span>
        </nav>
        <div v-if="article.id">
          <span class="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {{ getCategoryLabel(article.category) }}
          </span>
          <h1 class="text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight text-white mb-5">
            {{ article.title }}
          </h1>
          <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {{ formatDate(article.publishedAt || article.createdAt) }}
            </span>
            <span v-if="article.user" class="flex items-center gap-1.5">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {{ article.user.name }}
            </span>
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
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

    <!-- 三栏布局 -->
    <section v-if="article.id" class="bg-white py-12 md:py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-10">

          <!-- 左侧：浮动目录 -->
          <aside class="hidden lg:block w-52 flex-shrink-0">
            <div class="sticky top-24">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">目录</h4>
              <nav class="toc-nav">
                <a v-for="(heading, i) in tocItems" :key="i"
                  :href="`#${heading.id}`"
                  class="toc-link"
                  :class="[
                    activeTocId === heading.id ? 'toc-link-active' : '',
                    heading.level === 3 ? 'toc-link-sub' : ''
                  ]"
                  @click.prevent="scrollToHeading(heading.id)">
                  {{ heading.text }}
                </a>
              </nav>
            </div>
          </aside>

          <!-- 中间：正文 -->
          <main class="flex-1 min-w-0 max-w-3xl">
            <!-- 摘要 -->
            <p v-if="article.summary" class="text-lg text-slate-500 leading-relaxed mb-8 pb-8 border-b border-slate-100 font-medium">
              {{ article.summary }}
            </p>

            <!-- 正文 -->
            <article class="prose-content" v-html="sanitizedContent" ref="articleRef" />

            <!-- 标签 -->
            <div class="mt-10 pt-8 border-t border-slate-100">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-slate-400">标签：</span>
                <span class="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">{{ getCategoryLabel(article.category) }}</span>
              </div>
            </div>

            <!-- 上一篇 / 下一篇 -->
            <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <NuxtLink v-if="prevArticle" :to="`/news/${prevArticle.id}`"
                class="group flex items-center gap-4 p-5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                <svg class="w-5 h-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                <div class="min-w-0">
                  <span class="text-xs text-slate-400">上一篇</span>
                  <p class="text-sm font-medium text-slate-700 truncate group-hover:text-blue-600">{{ prevArticle.title }}</p>
                </div>
              </NuxtLink>
              <div v-else />
              <NuxtLink v-if="nextArticle" :to="`/news/${nextArticle.id}`"
                class="group flex items-center gap-4 p-5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-right justify-end">
                <div class="min-w-0">
                  <span class="text-xs text-slate-400">下一篇</span>
                  <p class="text-sm font-medium text-slate-700 truncate group-hover:text-blue-600">{{ nextArticle.title }}</p>
                </div>
                <svg class="w-5 h-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </NuxtLink>
            </div>
          </main>

          <!-- 右侧：侧边栏 -->
          <aside class="hidden xl:block w-64 flex-shrink-0">
            <div class="sticky top-24 space-y-8">

              <!-- 分享按钮 -->
              <div>
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">分享文章</h4>
                <div class="flex gap-3">
                  <button @click="shareToWeixin" class="share-btn" title="微信">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/></svg>
                  </button>
                  <button @click="copyLink" class="share-btn" title="复制链接">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                  </button>
                </div>
              </div>

              <!-- 联系 CTA -->
              <div class="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 border border-blue-100">
                <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <h4 class="font-bold text-slate-800 mb-2">需要专业服务？</h4>
                <p class="text-sm text-slate-500 mb-4">联系我们获取免费方案和报价</p>
                <NuxtLink to="/contact" class="block w-full text-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  免费咨询
                </NuxtLink>
              </div>

              <!-- 相关文章 -->
              <div v-if="relatedArticles.length">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">相关推荐</h4>
                <div class="space-y-4">
                  <NuxtLink v-for="item in relatedArticles" :key="item.id" :to="`/news/${item.id}`"
                    class="group block">
                    <div class="flex gap-3">
                      <div v-if="item.coverImage" class="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img :src="item.coverImage" :alt="item.title" class="w-full h-full object-cover" />
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-slate-700 line-clamp-2 group-hover:text-blue-600 transition-colors">{{ item.title }}</p>
                        <span class="text-xs text-slate-400">{{ formatDate(item.publishedAt || item.createdAt) }}</span>
                      </div>
                    </div>
                  </NuxtLink>
                </div>
              </div>

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

// SSR 数据获取
const { data: articleData } = useFetch(`/api/articles/${articleId}`, {
  transform: (res: any) => res?.success ? res.data : {} as Article
})
const article = computed<Article>(() => articleData.value || {} as Article)

// 上一篇/下一篇
const { data: navData } = useFetch('/api/articles', {
  params: { page: 1, pageSize: 100, status: 'published' },
  transform: (res: any) => {
    const list = res?.success ? (res.data?.list || []) : []
    return list.map((a: any) => ({ id: a.id, title: a.title, publishedAt: a.publishedAt, createdAt: a.createdAt, category: a.category }))
  }
})

const currentIndex = computed(() => (navData.value || []).findIndex((a: any) => a.id === articleId))
const prevArticle = computed(() => currentIndex.value > 0 ? navData.value[currentIndex.value - 1] : null)
const nextArticle = computed(() => currentIndex.value >= 0 && currentIndex.value < (navData.value?.length || 0) - 1 ? navData.value[currentIndex.value + 1] : null)

// 相关文章（同分类，排除自己）
const relatedArticles = computed(() => {
  return (navData.value || [])
    .filter((a: any) => a.id !== articleId && a.category === article.value.category)
    .slice(0, 4)
})

// 浏览量
onMounted(async () => {
  try { await $fetch(`/api/articles/${articleId}/view`, { method: 'POST' }) } catch {}
})

// XSS 过滤
const sanitizedContent = computed(() => {
  if (process.server) return article.value.content || ""
  return DOMPurify.sanitize(article.value.content || '', { ADD_ATTR: ['id'] })
})

// ===== 目录 TOC =====
const tocItems = ref<{ id: string; text: string; level: number }[]>([])
const activeTocId = ref('')
const articleRef = ref<HTMLElement>()

// 从正文提取 h2/h3 生成目录
const buildToc = () => {
  if (!articleRef.value) return
  const headings = articleRef.value.querySelectorAll('h2, h3')
  const items: { id: string; text: string; level: number }[] = []
  headings.forEach((el, i) => {
    const id = `heading-${i}`
    el.id = id
    items.push({ id, text: el.textContent?.trim() || '', level: el.tagName === 'H2' ? 2 : 3 })
  })
  tocItems.value = items
}

// 监听滚动，高亮当前目录项
const observeToc = () => {
  if (!articleRef.value) return
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeTocId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
  )
  articleRef.value.querySelectorAll('h2, h3').forEach(el => observer.observe(el))
}

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 分享
const shareToWeixin = () => {
  alert('请截图或复制链接分享到微信')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert('链接已复制')
  } catch {}
}

onMounted(() => {
  nextTick(() => {
    buildToc()
    observeToc()
  })
})

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
/* 目录导航 */
.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toc-link {
  display: block;
  padding: 6px 12px;
  font-size: 13px;
  color: #64748b;
  border-left: 2px solid transparent;
  transition: all 0.2s;
  line-height: 1.5;
}

.toc-link:hover {
  color: #1e293b;
  background: #f8fafc;
}

.toc-link-active {
  color: #1a73e8;
  border-left-color: #1a73e8;
  background: #f0f7ff;
  font-weight: 500;
}

.toc-link-sub {
  padding-left: 24px;
  font-size: 12px;
}

/* 分享按钮 */
.share-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.share-btn:hover {
  border-color: #1a73e8;
  color: #1a73e8;
  background: #f0f7ff;
}
</style>
