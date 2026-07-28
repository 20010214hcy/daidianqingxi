<template>
  <section class="py-20 cases-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14">
        <span class="case-tag">工程案例</span>
        <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mt-4 mb-3">精选项目案例</h2>
        <p class="text-slate-500 text-lg max-w-2xl mx-auto">丰富的项目经验，专业的技术团队，为客户提供可靠的解决方案</p>
      </div>
      <div v-if="featuredCases.length" class="case-grid">
        <NuxtLink v-for="(item, i) in featuredCases" :key="item.id"
          :to="`/cases/${item.id}`" class="case-card group">
          <div class="case-card-img-wrap">
            <img v-if="item.coverImage" :src="item.coverImage" :alt="item.title" class="case-card-img" loading="lazy" />
            <div v-else class="case-card-placeholder">⚡</div>
            <div class="case-card-overlay">
              <span class="case-card-btn">查看详情</span>
            </div>
          </div>
          <div class="case-card-body">
            <span class="case-card-index">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="case-card-title">{{ item.title }}</h3>
            <p class="case-card-desc">{{ item.description }}</p>
          </div>
        </NuxtLink>
      </div>
      <div class="text-center mt-12">
        <NuxtLink to="/cases" class="case-more-btn">
          查看全部案例
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Case } from '~/types'
interface Props { featuredCases: Case[] }
defineProps<Props>()
</script>

<style scoped>
.case-tag {
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 3px;
  padding: 4px 14px;
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.case-card {
  display: block;
  background: #fff;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
  text-decoration: none;
}

.case-card:hover { transform: translateY(-8px); }

.case-card-img-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.case-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.case-card:hover .case-card-img { transform: scale(1.08); }

.case-card-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #dbeafe, #93c5fd);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}

.case-card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.case-card:hover .case-card-overlay { opacity: 1; }

.case-card-btn {
  padding: 10px 28px;
  background: #fff;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  transform: translateY(12px);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.case-card:hover .case-card-btn { transform: translateY(0); }

.case-card-body { padding: 24px; }

.case-card-index {
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.case-card-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.4;
  transition: color 0.3s;
}

.case-card-desc {
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.case-more-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 32px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
}

.case-more-btn:hover { transform: translateY(-2px); }

@media (max-width: 1024px) {
  .case-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
}

@media (max-width: 640px) {
  .case-grid { grid-template-columns: 1fr; gap: 16px; }
  .case-card-body { padding: 18px; }
  .case-card-title { font-size: 16px; }
}
</style>
