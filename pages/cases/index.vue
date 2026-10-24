<template>
  <div class="cases-immersive">
    <!-- Page Header -->
    <PageHeader title="服务案例" subtitle="每一个项目，都是一次全程不断电的品质交付" />

    <!-- 二级导航：业务板块切换 -->
    <UnitSwitcher v-model="activeUnit" />

    <!-- Loading -->
    <section v-if="loading" class="py-24 bg-white flex justify-center items-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </section>

    <!-- Empty -->
    <section v-else-if="cases.length === 0" class="py-24 bg-white flex flex-col items-center text-slate-400">
      <svg class="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
      <p class="text-lg">暂无案例</p>
      <p class="text-sm mt-1">成功案例即将上线</p>
    </section>

    <!-- 沉浸式案例专辑：每屏一个案例 -->
    <template v-else>
      <article
        v-for="(caseItem, i) in cases"
        :key="caseItem.id"
        class="case-section"
      >
        <!-- 背景：大图 or 渐变兜底 -->
        <img
          v-if="caseItem.coverImage"
          :src="caseItem.coverImage"
          :alt="caseItem.title"
          class="case-bg"
          loading="lazy"
        />
        <div v-else class="case-bg case-bg-fallback">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>

        <!-- 压暗渐变，保证文字可读 -->
        <div class="case-overlay" aria-hidden="true"></div>

        <!-- 文字内容 -->
        <div class="case-content">
          <p class="case-eyebrow">
            CASE {{ String(i + 1).padStart(2, '0') }} · {{ unitLabel }}
          </p>
          <h2 class="case-title">
            <NuxtLink :to="`/cases/${caseItem.id}`" class="case-title-link">
              {{ caseItem.title }}
            </NuxtLink>
          </h2>
          <p v-if="caseItem.description" class="case-desc">{{ caseItem.description }}</p>

          <div class="case-meta">
            <span v-if="caseItem.location" class="case-chip">
              <svg class="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <circle cx="12" cy="11" r="2.5"/>
              </svg>
              {{ caseItem.location }}
            </span>
            <span v-if="caseItem.clientName" class="case-chip">
              <svg class="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
              </svg>
              {{ caseItem.clientName }}
            </span>
            <span class="case-chip">
              <svg class="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {{ formatDate(caseItem.endDate || caseItem.createdAt) }}
            </span>
          </div>

          <NuxtLink :to="`/cases/${caseItem.id}`" class="case-cta">
            查看完整案例
            <svg class="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </NuxtLink>
        </div>

        <!-- 序号指示 -->
        <span class="case-counter" aria-hidden="true">
          {{ String(i + 1).padStart(2, '0') }} / {{ String(cases.length).padStart(2, '0') }}
        </span>

        <!-- 滚动提示（最后一个不显示） -->
        <span v-if="i < cases.length - 1" class="case-scroll-hint" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7-7-7m14-6l-7 7-7-7"/>
          </svg>
        </span>
      </article>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: "电力清洗与储能工程案例",
  meta: [
    { name: 'description', content: '查看玺铭电力成功完成的项目案例，涵盖带电清洗、储能系统等各类场景。' },
    { property: 'og:title', content: '电力清洗与储能工程案例 - 河南玺铭电力科技有限公司' },
    { property: 'og:description', content: '带电清洗、储能系统等各类项目成功案例。' },
    { name: 'keywords', content: '带电清洗案例,电力清洗项目,储能系统案例,工业清洗工程,变电站清洗,成功案例' },
  ]
})

import type { Case } from '~/types'

const { formatDate } = useFormatDate()
const route = useRoute()
const router = useRouter()

// 业务板块切换
const activeUnit = ref(route.query.unit as string || 'daidianqingxi')

watch(activeUnit, (val) => {
  router.replace({ query: { unit: val } })
})

const UNIT_LABELS: Record<string, string> = {
  daidianqingxi: '带电清洗',
  chuneng: '储能系统',
}
const unitLabel = computed(() => UNIT_LABELS[activeUnit.value] || '工程案例')

// SSR 数据获取
const { data: casesData, pending: loading } = useFetch('/api/cases', {
  query: computed(() => ({ businessUnit: activeUnit.value })),
  transform: (res: any) => res?.success ? (res.data?.list || res.data || []) : []
})
const cases = computed<Case[]>(() => casesData.value || [])
</script>

<style scoped>
/* ===== 沉浸式案例区块 ===== */
.case-section {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 82vh;
  overflow: hidden;
  isolation: isolate;
  color: #fff;
  background: #0f172a;
}

/* 大图 */
.case-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: transform 1.2s ease;
  will-change: transform;
}
.case-section:hover .case-bg {
  transform: scale(1.03);
}

/* 无封面兜底：品牌色深渐变 */
.case-bg-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0f172a 100%);
}
.case-bg-fallback svg {
  width: 120px;
  height: 120px;
  color: rgba(255, 255, 255, 0.18);
}

/* 压暗渐变：底部深、顶部浅，保证文字对比度 */
.case-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 20, 35, 0.30) 0%,
    rgba(10, 20, 35, 0.45) 45%,
    rgba(10, 20, 35, 0.82) 100%
  );
  z-index: 1;
}

/* 内容区 */
.case-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 3rem 1.5rem 3.5rem;
}

.case-eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  color: #7dd3fc;
  margin: 0 0 0.75rem;
  font-weight: 500;
}

.case-title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.5rem, 3.2vw, 2.5rem);
  line-height: 1.25;
  font-weight: 700;
  color: #fff;
}
.case-title-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease;
}
.case-title-link:hover {
  color: #93c5fd;
}

.case-desc {
  max-width: 46rem;
  font-size: clamp(0.9rem, 1.3vw, 1.05rem);
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 信息 chips */
.case-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.case-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  padding: 0.3rem 0.85rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
}
.chip-icon {
  width: 0.85rem;
  height: 0.85rem;
  flex-shrink: 0;
}

/* CTA */
.case-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #0f172a;
  background: #fff;
  border-radius: 999px;
  padding: 0.65rem 1.5rem;
  text-decoration: none;
  transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
}
.case-cta:hover {
  background: #93c5fd;
  transform: translateY(-2px);
}
.cta-arrow {
  width: 1rem;
  height: 1rem;
  transition: transform 0.3s ease;
}
.case-cta:hover .cta-arrow {
  transform: translateX(3px);
}

/* 右下角序号 */
.case-counter {
  position: absolute;
  right: 1.5rem;
  bottom: 1.75rem;
  z-index: 2;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.65);
}

/* 向下滚动提示 */
.case-scroll-hint {
  position: absolute;
  left: 50%;
  bottom: 1.25rem;
  transform: translateX(-50%);
  z-index: 2;
  color: rgba(255, 255, 255, 0.6);
  animation: hintBounce 2s ease-in-out infinite;
}
.case-scroll-hint svg {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
}
@keyframes hintBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}

/* 桌面端：滚动吸附，接近案例边界时轻轻吸附 */
@media (min-width: 768px) {
  :global(html) {
    scroll-snap-type: y proximity;
  }
  .case-section {
    scroll-snap-align: start;
  }
}

/* 移动端 */
@media (max-width: 767px) {
  .case-section {
    min-height: 74vh;
  }
  .case-content {
    padding: 2rem 1.25rem 3rem;
  }
  .case-counter {
    right: 1.25rem;
    bottom: 1.25rem;
  }
  .case-scroll-hint {
    display: none;
  }
}

/* 尊重减弱动效偏好 */
@media (prefers-reduced-motion: reduce) {
  .case-bg,
  .case-cta,
  .cta-arrow,
  .case-title-link {
    transition: none;
  }
  .case-scroll-hint {
    animation: none;
  }
  .case-section:hover .case-bg {
    transform: none;
  }
}
</style>
