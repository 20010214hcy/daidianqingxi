<template>
  <section class="cases-section" ref="sectionRef">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 标题区 -->
      <div class="cases-header" :class="{ 'animate-in': visible }">
        <span class="cases-tag">工程案例</span>
        <h2 class="cases-title">精选项目案例</h2>
        <p class="cases-subtitle">丰富的项目经验，专业的技术团队，为客户提供可靠的解决方案</p>
      </div>

      <!-- 案例轮播 -->
      <div v-if="featuredCases.length" class="cases-slider" :class="{ 'animate-in': visible }">
        <div class="cases-track" ref="trackRef">
          <NuxtLink v-for="(item, i) in featuredCases" :key="item.id"
            :to="`/cases/${item.id}`" class="case-slide group">
            <div class="case-img-wrap">
              <img v-if="item.coverImage" :src="item.coverImage" :alt="item.title" class="case-img" loading="lazy" />
              <div v-else class="case-img-placeholder">⚡</div>
              <!-- 渐变遮罩 -->
              <div class="case-overlay"></div>
              <!-- 序号 -->
              <span class="case-index">{{ String(i + 1).padStart(2, '0') }}</span>
              <!-- 文字信息 -->
              <div class="case-info">
                <h3 class="case-title">{{ item.title }}</h3>
                <p class="case-desc">{{ item.description }}</p>
                <span class="case-link">
                  查看详情
                  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- 查看全部 -->
      <div class="text-center mt-12" :class="{ 'animate-in': visible }">
        <NuxtLink to="/cases" class="case-more-btn">
          查看全部案例
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
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

const sectionRef = ref<HTMLElement>()
const visible = ref(false)

onMounted(() => {
  if (sectionRef.value) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible.value = true
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(sectionRef.value)
  }
})
</script>

<style scoped>
.cases-section {
  padding: 100px 0;
  background: #0c2340;
  overflow: hidden;
}

/* 标题区 */
.cases-header {
  text-align: center;
  margin-bottom: 50px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.cases-header.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.cases-tag {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  color: #60a5fa;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.cases-title {
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 12px;
}

.cases-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  max-width: 500px;
  margin: 0 auto;
}

/* 轮播区域 */
.cases-slider {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.cases-slider.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.cases-track {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 10px;
}

.cases-track::-webkit-scrollbar { display: none; }

/* 单个案例卡片 */
.case-slide {
  flex: 0 0 calc(33.333% - 16px);
  min-width: 320px;
  scroll-snap-align: start;
  text-decoration: none;
}

.case-img-wrap {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
}

.case-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.case-slide:hover .case-img {
  transform: scale(1.08);
}

.case-img-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e3a5f, #0c2340);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}

/* 渐变遮罩 */
.case-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%);
  transition: background 0.4s ease;
}

.case-slide:hover .case-overlay {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.1) 100%);
}

/* 序号 */
.case-index {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 2px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* 文字信息 */
.case-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 28px;
  transform: translateY(10px);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.case-slide:hover .case-info {
  transform: translateY(0);
}

.case-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  line-height: 1.3;
}

.case-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
  opacity: 0;
  max-height: 0;
  transition: all 0.4s ease;
}

.case-slide:hover .case-desc {
  opacity: 1;
  max-height: 60px;
}

.case-link {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: #60a5fa;
  letter-spacing: 1px;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.4s 0.1s ease;
}

.case-slide:hover .case-link {
  opacity: 1;
  transform: translateY(0);
}

/* 查看全部按钮 */
.case-more-btn {
  display: inline-flex;
  align-items: center;
  padding: 14px 36px;
  background: transparent;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  text-decoration: none;
  transition: all 0.3s;
  letter-spacing: 1px;
}

.case-more-btn:hover {
  background: #fff;
  color: #0c2340;
  border-color: #fff;
  transform: translateY(-2px);
}

/* 响应式 */
@media (max-width: 1024px) {
  .case-slide { flex: 0 0 calc(50% - 12px); min-width: 280px; }
  .cases-section { padding: 80px 0; }
  .cases-title { font-size: 30px; }
}

@media (max-width: 640px) {
  .case-slide { flex: 0 0 100%; min-width: 0; }
  .cases-section { padding: 60px 0; }
  .cases-title { font-size: 26px; }
  .case-info { padding: 20px; }
  .case-title { font-size: 18px; }
}
</style>
