<template>
  <section id="news" class="news-home-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-12">
        <div>
          <span class="section-tag">新闻资讯</span>
          <h2 class="section-title">新闻动态</h2>
          <p class="section-desc">了解行业资讯与公司动态</p>
        </div>
        <NuxtLink to="/news" class="text-blue-600 font-medium hover:text-blue-700 transition-colors hidden md:inline-flex items-center">
          查看全部
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>
      <div v-if="latestNews.length" class="news-magazine">
        <NuxtLink v-if="latestNews[0]" :to="`/news/${latestNews[0].id}`" class="news-headline group">
          <div class="news-headline-img-wrap">
            <NuxtImg
              v-if="latestNews[0].coverImage"
              :src="latestNews[0].coverImage"
              :alt="latestNews[0].title"
              class="news-headline-img"
              sizes="xs:100vw md:60vw lg:700px"
              format="webp"
              quality="76"
              loading="lazy"
              decoding="async"
            />
            <div v-else class="news-headline-img bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
              <span class="text-6xl">📰</span>
            </div>
          </div>
          <div class="news-headline-content">
            <span class="text-xs text-blue-600 font-medium">{{ formatDate(latestNews[0].createdAt) }}</span>
            <h3 class="text-lg font-bold text-slate-800 mt-2 mb-3 group-hover:text-blue-600 transition-colors">{{ latestNews[0].title }}</h3>
            <p class="text-slate-700 line-clamp-3">{{ latestNews[0].summary }}</p>
          </div>
        </NuxtLink>
        <div class="news-side-list">
          <NuxtLink v-for="item in latestNews.slice(1, 5)" :key="item.id" :to="`/news/${item.id}`"
            class="news-side-item group">
            <div class="news-side-img-wrap">
              <NuxtImg
                v-if="item.coverImage"
                :src="item.coverImage"
                :alt="item.title"
                class="news-side-img"
                sizes="xs:100px md:200px"
                format="webp"
                quality="74"
                loading="lazy"
                decoding="async"
              />
              <div v-else class="news-side-img bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <span class="text-2xl">📰</span>
              </div>
            </div>
            <div class="news-side-content">
              <span class="text-xs text-slate-500">{{ formatDate(item.createdAt) }}</span>
              <h4 class="font-bold text-slate-800 mt-1 group-hover:text-blue-600 transition-colors line-clamp-2">{{ item.title }}</h4>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~/types'
interface Props { latestNews: Article[] }
defineProps<Props>()
const { formatDate } = useFormatDate()
</script>

<style scoped>
/* md-desktop-density */
@media (min-width: 960px) and (max-width: 1440px) {
  .news-home-section {
    padding: 64px 0;
  }

  .news-headline-img-wrap {
    height: 240px;
  }

  .news-headline-content {
    padding: 22px;
  }
}

.news-home-section {
  padding: 80px 0;
  background: #f8fafc;
  scroll-margin-top: 88px;
}

@media (max-width: 768px) {
  .news-home-section {
    padding: 48px 0;
  }
}

.news-magazine {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
}

.news-headline {
  display: block;
  overflow: hidden;
  background: #fff;
  transition: box-shadow 0.3s;
  text-decoration: none;
}

.news-headline:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.1); }

.news-headline-img-wrap { height: 280px; overflow: hidden; }

.news-headline-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.news-headline:hover .news-headline-img { transform: scale(1.03); }

.news-headline-content { padding: 28px; }

.news-side-list { display: flex; flex-direction: column; gap: 16px; }

.news-side-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fff;
  transition: box-shadow 0.3s, transform 0.3s;
  text-decoration: none;
}

.news-side-item:hover { transform: translateX(4px); }

.news-side-img-wrap {
  width: 100px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.news-side-img { width: 100%; height: 100%; object-fit: cover; }
.news-side-content { flex: 1; min-width: 0; }

@media (max-width: 768px) {
  .news-magazine { grid-template-columns: 1fr; gap: 12px; }
  .news-headline-img-wrap { height: 160px; }
  .news-headline-content { padding: 14px 14px 16px; }
  .news-headline-content h3,
  .news-headline-content .text-2xl {
    font-size: 16px !important;
    margin-bottom: 6px !important;
  }
  .news-side-list { gap: 8px; }
  .news-side-item { gap: 10px; padding: 0; transform: none !important; }
  .news-side-img-wrap { width: 72px; height: 56px; flex-shrink: 0; }
  .news-side-content h4,
  .news-side-content .font-bold {
    font-size: 13px !important;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .section-title { font-size: 22px !important; }
  .section-desc { font-size: 13px !important; }
}

@media (max-width: 480px) {
  .news-headline-img-wrap { height: 140px; }
  .news-side-img-wrap { width: 64px; height: 48px; }
}

/* mobile section pad */
@media (max-width: 768px) {
  .py-20 { padding-top: 48px !important; padding-bottom: 48px !important; }
  .mb-12 { margin-bottom: 20px !important; }
}
</style>
