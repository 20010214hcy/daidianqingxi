<template>
  <section class="cases-section" ref="sectionRef">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 标题区 -->
      <div class="cases-header" :class="{ 'animate-in': visible }">
        <span class="cases-tag">CASE STUDIES</span>
        <h2 class="cases-title">我们的案例</h2>
        <p class="cases-desc">丰富的项目经验，专业的技术团队，为客户提供可靠的解决方案</p>
      </div>

      <!-- 轮播区 + 两侧箭头 -->
      <div class="cases-swiper-wrap" :class="{ 'animate-in': visible }">
        <button class="swiper-btn swiper-btn-prev" ref="prevRef">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="swiper cases-swiper" ref="swiperRef">
          <div class="swiper-wrapper">
            <div v-for="(item, i) in featuredCases" :key="item.id" class="swiper-slide">
              <NuxtLink :to="`/cases/${item.id}`" class="case-card group">
                <div class="case-img-box">
                  <img v-if="item.coverImage" :src="item.coverImage" :alt="item.title" class="case-img" />
                  <div v-else class="case-img-placeholder" />
                  <div class="case-mask" />
                  <span class="case-num">{{ String(i + 1).padStart(2, '0') }}</span>
                </div>
                <div class="case-text">
                  <h3 class="case-title">{{ item.title }}</h3>
                  <p class="case-desc">{{ item.description }}</p>
                  <span class="case-link">
                    了解详情
                    <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
        <button class="swiper-btn swiper-btn-next" ref="nextRef">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <!-- 查看全部 -->
      <div class="cases-footer" :class="{ 'animate-in': visible }">
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
import Swiper from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

import type { Case } from '~/types'

interface Props { featuredCases: Case[] }
defineProps<Props>()

const sectionRef = ref<HTMLElement>()
const swiperRef = ref<HTMLElement>()
const prevRef = ref<HTMLElement>()
const nextRef = ref<HTMLElement>()
const visible = ref(false)

onMounted(() => {
  if (sectionRef.value) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { visible.value = true; observer.disconnect() }
      },
      { threshold: 0.1 }
    )
    observer.observe(sectionRef.value)
  }

  if (swiperRef.value) {
    new Swiper(swiperRef.value, {
      modules: [Navigation, Autoplay],
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      navigation: { prevEl: prevRef.value, nextEl: nextRef.value },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    })
  }
})
</script>

<style scoped>
.cases-section {
  padding: 100px 0;
  background: #f5f7fa;
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
.cases-header.animate-in { opacity: 1; transform: translateY(0); }

.cases-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #1a73e8;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.cases-title {
  font-size: 36px;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 10px;
}

.cases-desc {
  font-size: 16px;
  color: #6b7280;
  max-width: 500px;
  margin: 0 auto;
}

/* 轮播区域 - 箭头在两侧 */
.cases-swiper-wrap {
  position: relative;
  padding: 0 60px;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.cases-swiper-wrap.animate-in { opacity: 1; transform: translateY(0); }

.cases-swiper { overflow: hidden; padding: 10px 0 20px; }

/* 箭头 - 垂直居中在轮播区两侧 */
.swiper-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.swiper-btn:hover {
  background: #1a73e8;
  border-color: #1a73e8;
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
}

.swiper-btn:hover svg { color: #fff; }

.swiper-btn svg {
  width: 18px;
  height: 18px;
  color: #64748b;
  transition: color 0.3s;
}

.swiper-btn-prev { left: 0; }
.swiper-btn-next { right: 0; }

/* 案例卡片 */
.case-card {
  display: block;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.case-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(26, 115, 232, 0.12);
}

.case-img-box {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.case-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.case-card:hover .case-img { transform: scale(1.06); }

.case-img-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e0e7ef, #cbd5e1);
}

.case-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.03) 100%);
  transition: background 0.4s;
}

.case-card:hover .case-mask {
  background: linear-gradient(180deg, transparent 20%, rgba(26, 115, 232, 0.08) 100%);
}

.case-num {
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 1px;
}

.case-text { padding: 22px 24px 26px; }

.case-title {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
  line-height: 1.4;
  transition: color 0.3s;
}

.case-card:hover .case-title { color: #1a73e8; }

.case-desc {
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 14px;
}

.case-link {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: #1a73e8;
  letter-spacing: 0.5px;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.4s ease;
}

.case-card:hover .case-link {
  opacity: 1;
  transform: translateX(0);
}

/* 底部 */
.cases-footer {
  text-align: center;
  margin-top: 40px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.cases-footer.animate-in { opacity: 1; transform: translateY(0); }

.case-more-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 32px;
  background: #1a73e8;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  letter-spacing: 1px;
}

.case-more-btn:hover {
  background: #1557b0;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(26, 115, 232, 0.3);
}

/* 响应式 */
@media (max-width: 1024px) {
  .cases-section { padding: 80px 0; }
  .cases-title { font-size: 30px; }
}

@media (max-width: 768px) {
  .cases-swiper-wrap { padding: 0 40px; }
  .swiper-btn { width: 36px; height: 36px; }
  .swiper-btn svg { width: 16px; height: 16px; }
}

@media (max-width: 640px) {
  .cases-section { padding: 60px 0; }
  .cases-title { font-size: 26px; }
  .cases-swiper-wrap { padding: 0; }
  .swiper-btn { display: none; }
  .case-text { padding: 18px 20px 22px; }
  .case-title { font-size: 16px; }
}
</style>
