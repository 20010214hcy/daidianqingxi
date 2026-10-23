<template>
  <section ref="heroRef" class="hero-section" :class="{ 'hero-visible': heroVisible }">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="animate-fade-in hero-decoration">
        <span class="hero-decoration-line"></span>
        <span class="hero-decoration-text">玺铭电力 · XIMING ELECTRIC</span>
        <span class="hero-decoration-line"></span>
      </div>
      <h1 class="hero-title animate-fade-in">
        <span class="hero-title-main">带电清洗 · 储能系统集成</span>
        <span class="hero-title-sub">电力设备全生命周期运维服务商</span>
      </h1>
      <p class="hero-subtitle animate-fade-in animate-delay-1">
        不停电作业 · 全国可承接 · 24 小时内响应
      </p>
      <div class="animate-fade-in animate-delay-2 hero-stats">
        <div class="hero-stat-item">
          <div class="hero-stat-number">20+</div>
          <div class="hero-stat-label">年行业经验</div>
        </div>
        <div class="hero-stat-divider"></div>
        <div class="hero-stat-item">
          <div class="hero-stat-number">500+</div>
          <div class="hero-stat-label">成功案例</div>
        </div>
        <div class="hero-stat-divider"></div>
        <div class="hero-stat-item">
          <div class="hero-stat-number">99%</div>
          <div class="hero-stat-label">客户满意度</div>
        </div>
      </div>
      <div class="animate-fade-in animate-delay-2 hero-buttons">
        <NuxtLink to="/services" class="hero-btn-primary">
          带电清洗服务
        </NuxtLink>
        <NuxtLink to="/products" class="hero-btn-outline">
          储能系统方案
        </NuxtLink>
      </div>
    </div>
    <button class="scroll-indicator" @click="scrollToNext" aria-label="向下滚动">
      <span class="scroll-indicator-text">SCROLL</span>
      <svg class="scroll-indicator-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>
  </section>
</template>

<script setup lang="ts">
const heroRef = ref<HTMLElement>()
const heroVisible = ref(false)

// 首屏背景图提前下载，避免 LCP 被 CSS 背景图的发现时机拖慢
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: '/uploads/hero-bg-v2.webp',
      type: 'image/webp',
      fetchpriority: 'high',
    },
  ],
})

onMounted(() => {
  nextTick(() => {
    heroVisible.value = true
  })
})

const scrollToNext = () => {
  const target = document.querySelector('.business-section') || document.querySelector('.trust-bar')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  height: calc(100svh - 72px);
  min-height: calc(100dvh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/uploads/hero-bg-v2.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.55) 0%, rgba(30, 58, 138, 0.5) 50%, rgba(15, 23, 42, 0.65) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 60px 24px;
  max-width: 860px;
}

.hero-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.hero-decoration-line {
  width: 40px;
  height: 1px;
  background: rgba(255, 255, 255, 0.4);
}

.hero-decoration-text {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

.hero-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-size: clamp(24px, 3vw, 44px);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.15;
  margin-bottom: 16px;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.35);
  letter-spacing: 1px;
}

.hero-title-main { display: block; }

.hero-title-sub {
  display: block;
  font-size: 0.5em;
  font-weight: 600;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.78);
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: clamp(14px, 1.2vw, 16px);
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.6;
  margin-bottom: 28px;
  font-weight: 400;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
  letter-spacing: 2px;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}

.hero-stat-item { text-align: center; }

.hero-stat-number {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  font-size: clamp(16px, 1.5vw, 20px);
  font-weight: 700;
  color: #fff;
}

.hero-stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 1px;
  margin-top: 2px;
}

.hero-stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
}

.hero-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.hero-btn-primary,
.hero-btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 14px 28px !important;
  font-size: 14.5px !important;
  min-width: 180px;
}

.hero-btn-primary {
  background: #2563eb !important;
  color: #ffffff !important;
  border: 2px solid #2563eb !important;
}

.hero-btn-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
}

.hero-btn-outline {
  background: transparent !important;
  color: #ffffff !important;
  border: 2px solid rgba(255, 255, 255, 0.7) !important;
}

.hero-btn-outline:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in { opacity: 0; }

.hero-visible .animate-fade-in {
  animation: fadeInUp 0.8s ease forwards;
}

.hero-visible .animate-delay-1 { animation-delay: 0.2s; }
.hero-visible .animate-delay-2 { animation-delay: 0.4s; }

.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.3s ease;
  padding: 12px;
}

.scroll-indicator:hover { color: #ffffff; }

.scroll-indicator-text {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 3px;
  opacity: 0.6;
}

.scroll-indicator-arrow {
  width: 28px;
  height: 28px;
  animation: bounceDown 2s ease-in-out infinite;
}

@keyframes bounceDown {
  0%, 100% { transform: translateY(0); opacity: 0.7; }
  50% { transform: translateY(8px); opacity: 1; }
}

@media (max-width: 768px) {
  .hero-section {
    height: auto;
    min-height: calc(100dvh - 64px);
    max-height: none;
  }
  .hero-title { font-size: 30px; letter-spacing: 1px; gap: 8px; }
  .hero-title-sub { letter-spacing: 1.5px; }
  .hero-subtitle { font-size: 14px; letter-spacing: 0.5px; margin-bottom: 18px; }
  .hero-content { padding: 48px 16px 72px; }
  .hero-decoration { margin-bottom: 16px; }
  .hero-stats { gap: 14px; margin-bottom: 22px; }
  .hero-stat-number { font-size: 20px; }
  .hero-stat-label { font-size: 11px; }
  .hero-stat-divider { height: 28px; }
  .hero-btn-primary,
  .hero-btn-outline {
    padding: 12px 18px !important;
    font-size: 14px !important;
    min-width: 0;
    border-radius: 999px !important;
  }
  .hero-buttons {
    flex-direction: row;
    align-items: stretch;
    gap: 10px;
    padding: 0;
    width: 100%;
  }
  .hero-btn-primary,
  .hero-btn-outline { flex: 1; width: auto; max-width: none; }
  .scroll-indicator { bottom: 12px; padding: 8px; }
  .scroll-indicator-text { display: none; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 22px; gap: 6px; }
  .hero-stats { gap: 10px; }
  .hero-stat-number { font-size: clamp(14px, 1.2vw, 16px); }
  .hero-buttons { flex-direction: column; }
  .hero-btn-primary,
  .hero-btn-outline { width: 100%; }
}
</style>
