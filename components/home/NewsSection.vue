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
            <div class="news-headline-meta">
              <span v-if="parseTitle(latestNews[0].title).tag" class="news-chip">{{ parseTitle(latestNews[0].title).tag }}</span>
              <span class="news-headline-date">{{ formatDate(latestNews[0].publishedAt || latestNews[0].createdAt) }}</span>
            </div>
            <h3 class="news-headline-title">{{ parseTitle(latestNews[0].title).title }}</h3>
            <p v-if="latestNews[0].summary" class="news-headline-summary">{{ latestNews[0].summary }}</p>
            <span class="news-read-more">
              阅读全文
              <svg class="news-read-more-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </span>
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
              <div class="news-side-meta">
                <span v-if="parseTitle(item.title).tag" class="news-chip">{{ parseTitle(item.title).tag }}</span>
                <span class="news-side-date">{{ formatDate(item.publishedAt || item.createdAt) }}</span>
              </div>
              <h4 class="news-side-title">{{ parseTitle(item.title).title }}</h4>
              <p v-if="item.summary" class="news-side-summary">{{ item.summary }}</p>
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

// 标题里的「技术分享 | xxx」「一周产业观察 | xxx」前缀拆成分类标签显示
const TAGS = ['一周产业观察', '技术分享', '公司新闻']
function parseTitle(t: string) {
  const i = (t || '').indexOf('|')
  if (i > 0) {
    const tag = t.slice(0, i).trim()
    if (TAGS.includes(tag)) return { tag, title: t.slice(i + 1).trim() }
  }
  return { tag: '', title: t || '' }
}
</script>

<style scoped>
/* md-desktop-density */
@media (min-width: 960px) and (max-width: 1440px) {
  .news-home-section {
    padding: 64px 0;
  }

  .news-headline-img-wrap {
    height: 270px;
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
  align-items: stretch;
}

.news-headline {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  transition: box-shadow 0.3s;
  text-decoration: none;
}

.news-headline:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.1); }

.news-headline-img-wrap { height: 320px; overflow: hidden; flex-shrink: 0; }

.news-headline-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.news-headline:hover .news-headline-img { transform: scale(1.03); }

.news-headline-content {
  padding: 28px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-headline-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.news-headline-date { font-size: 12px; color: #94a3b8; }

.news-headline-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.5;
  margin-bottom: 12px;
}

.news-headline-summary {
  color: #475569;
  font-size: 14px;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-read-more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: auto;
  padding-top: 16px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 500;
}

.news-read-more-icon { width: 14px; height: 14px; transition: transform 0.25s; }
.news-headline:hover .news-read-more-icon { transform: translateX(3px); }

.news-chip {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  line-height: 1;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 500;
  flex-shrink: 0;
}

.news-side-list { display: flex; flex-direction: column; gap: 16px; }

.news-side-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fff;
  transition: box-shadow 0.3s, transform 0.3s;
  text-decoration: none;
  flex: 1;
}

.news-side-item:hover { transform: translateX(4px); box-shadow: 0 6px 20px rgba(0,0,0,0.07); }

.news-side-img-wrap {
  width: 112px;
  height: 88px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.news-side-img { width: 100%; height: 100%; object-fit: cover; }
.news-side-content { flex: 1; min-width: 0; }

.news-side-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.news-side-date { font-size: 11px; color: #94a3b8; flex-shrink: 0; }

.news-side-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-side-summary {
  margin-top: 5px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .news-magazine { grid-template-columns: 1fr; gap: 12px; }
  .news-headline-img-wrap { height: 160px; }
  .news-headline-content { padding: 14px 14px 16px; }
  .news-headline-title {
    font-size: 16px !important;
    margin-bottom: 6px !important;
  }
  .news-headline-summary { font-size: 12.5px !important; line-height: 1.7 !important; }
  .news-read-more { padding-top: 10px !important; font-size: 12px !important; }
  .news-side-list { gap: 8px; }
  .news-side-item { gap: 10px; padding: 10px; transform: none !important; }
  .news-side-img-wrap { width: 72px; height: 64px; flex-shrink: 0; }
  .news-side-title { font-size: 13px !important; }
  .news-side-summary { font-size: 11px !important; -webkit-line-clamp: 2; }
  .news-chip { font-size: 10px; padding: 3px 8px; }
  .section-title { font-size: 22px !important; }
  .section-desc { font-size: 13px !important; }
}

@media (max-width: 480px) {
  .news-headline-img-wrap { height: 140px; }
  .news-side-img-wrap { width: 64px; height: 56px; }
  .news-side-summary { -webkit-line-clamp: 1; }
}

/* mobile section pad */
@media (max-width: 768px) {
  .py-20 { padding-top: 48px !important; padding-bottom: 48px !important; }
  .mb-12 { margin-bottom: 20px !important; }
}
</style>
