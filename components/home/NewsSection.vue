<template>
  <section class="py-20 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-12">
        <div>
          <h2 class="text-3xl font-bold text-slate-800 mb-2">新闻动态</h2>
          <p class="text-slate-500">了解行业资讯与公司动态</p>
        </div>
        <NuxtLink to="/news" class="text-primary-600 font-medium hover:text-primary-700 transition-colors hidden md:inline-flex items-center">
          查看全部
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>
      <div v-if="latestNews.length" class="news-magazine">
        <!-- 左侧头条 -->
        <NuxtLink v-if="latestNews[0]" :to="`/news/${latestNews[0].id}`" class="news-headline group">
          <div class="news-headline-img-wrap">
            <img v-if="latestNews[0].coverImage" :src="latestNews[0].coverImage" :alt="latestNews[0].title"
              class="news-headline-img" loading="lazy" />
            <div v-else class="news-headline-img bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
              <span class="text-6xl">📰</span>
            </div>
          </div>
          <div class="news-headline-content">
            <span class="text-xs text-primary-600 font-medium">{{ formatDate(latestNews[0].createdAt) }}</span>
            <h3 class="text-2xl font-bold text-slate-800 mt-2 mb-3 group-hover:text-primary-600 transition-colors">{{ latestNews[0].title }}</h3>
            <p class="text-slate-700 line-clamp-3">{{ latestNews[0].summary }}</p>
          </div>
        </NuxtLink>
        <!-- 右侧列表 -->
        <div class="news-side-list">
          <NuxtLink v-for="item in latestNews.slice(1, 4)" :key="item.id" :to="`/news/${item.id}`"
            class="news-side-item group">
            <div class="news-side-img-wrap">
              <img v-if="item.coverImage" :src="item.coverImage" :alt="item.title" class="news-side-img" loading="lazy" />
              <div v-else class="news-side-img bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <span class="text-2xl">📰</span>
              </div>
            </div>
            <div class="news-side-content">
              <span class="text-xs text-slate-500">{{ formatDate(item.createdAt) }}</span>
              <h4 class="font-bold text-slate-800 mt-1 group-hover:text-primary-600 transition-colors line-clamp-2">{{ item.title }}</h4>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~/types'

interface Props {
  latestNews: Article[]
}

defineProps<Props>()

const { formatDate } = useFormatDate()
</script>

<style scoped>
.news-magazine {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
}

.news-headline {
  display: block;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  transition: box-shadow 0.3s;
  text-decoration: none;
}

.news-headline:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.news-headline-img-wrap {
  height: 280px;
  overflow: hidden;
}

.news-headline-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.news-headline:hover .news-headline-img {
  transform: scale(1.03);
}

.news-headline-content {
  padding: 28px;
}

.news-side-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-side-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.3s, transform 0.3s;
  text-decoration: none;
}

.news-side-item:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  transform: translateX(4px);
}

.news-side-img-wrap {
  width: 100px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.news-side-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-side-content {
  flex: 1;
  min-width: 0;
}

@media (max-width: 768px) {
  .news-magazine {
    grid-template-columns: 1fr;
  }

  .news-headline-img-wrap {
    height: 200px;
  }
}
</style>
