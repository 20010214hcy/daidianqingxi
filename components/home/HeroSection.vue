<template>
  <section ref="heroRef" class="hero-section" :class="{ 'hero-visible': heroVisible }">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <!-- 精密装饰线 -->
      <div class="animate-fade-in hero-decoration">
        <span class="hero-decoration-line"></span>
        <span class="hero-decoration-text">XIMING ELECTRIC</span>
        <span class="hero-decoration-line"></span>
      </div>
      <h1 class="hero-title animate-fade-in">玺铭电力</h1>
      <p class="hero-subtitle animate-fade-in animate-delay-1">专注电力设备带电清洗 · 安全高效 · 稳压保供</p>
      <!-- 数据亮点 -->
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
      <div class="hero-buttons animate-fade-in animate-delay-2">
        <NuxtLink to="/services" class="hero-btn hero-btn-primary">
          了解核心服务
        </NuxtLink>
        <NuxtLink to="/contact" class="hero-btn hero-btn-outline">
          免费获取方案
        </NuxtLink>
      </div>
    </div>
    <button class="scroll-indicator" @click="scrollToServices" aria-label="向下滚动">
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

onMounted(() => {
  nextTick(() => {
    heroVisible.value = true
  })
})

const scrollToServices = () => {
  const target = document.querySelector('.services-section')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  height: calc(100vh - 80px);
  min-height: calc(100dvh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/uploads/hero-bg.jpg');
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
  max-width: 800px;
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
  font-size: 56px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.15;
  margin-bottom: 16px;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.35);
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin-bottom: 8px;
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

.hero-stat-item {
  text-align: center;
}

.hero-stat-number {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  font-size: 28px;
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

.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 36px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-decoration: none;
  letter-spacing: 1px;
  cursor: pointer;
}

.hero-btn-primary {
  background: #2563eb;
  color: #ffffff;
  border: 2px solid #2563eb;
}

.hero-btn-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
}

.hero-btn-outline {
  background: transparent;
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.hero-btn-outline:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
}

/* 入场动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  opacity: 0;
}

.hero-visible .animate-fade-in {
  animation: fadeInUp 0.8s ease forwards;
}

.hero-visible .animate-delay-1 {
  animation-delay: 0.2s;
}

.hero-visible .animate-delay-2 {
  animation-delay: 0.4s;
}

/* 滚动指示器 */
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

.scroll-indicator:hover {
  color: #ffffff;
}

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
  0%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  50% {
    transform: translateY(8px);
    opacity: 1;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 30px;
    letter-spacing: 1px;
  }

  .hero-subtitle {
    font-size: 16px;
    margin-bottom: 32px;
  }

  .hero-content {
    padding: 40px 20px;
  }

  .hero-btn {
    padding: 12px 28px;
    font-size: 15px;
  }

  .hero-buttons {
    gap: 14px;
  }

  .scroll-indicator {
    bottom: 24px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 26px;
  }

  .hero-subtitle {
    font-size: 14px;
    margin-bottom: 28px;
  }

  .hero-btn {
    padding: 12px 24px;
    font-size: 14px;
    width: 100%;
    max-width: 260px;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
