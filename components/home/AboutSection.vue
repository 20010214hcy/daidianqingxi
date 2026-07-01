<template>
  <section class="about-section" ref="aboutRef">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="about-grid" :class="{ 'about-visible': aboutVisible }">
        <div class="about-image-col">
          <div class="about-image-wrapper">
            <div class="about-image-accent"></div>
            <img
              class="about-image"
              src="/uploads/51a3b015-95f2-4b29-8fb6-952e2341599e.webp"
              alt="玺铭电力 - 专业电力设备运维"
              loading="lazy"
            />
          </div>
        </div>
        <div class="about-text-col">
          <span class="about-label">关于我们</span>
          <h2 class="about-heading">玺铭电力 — 专业电力设备运维服务商</h2>
          <p class="about-desc">
            专注电力设备带电清洗领域，以安全、高效、可靠的技术服务，
            为变电站、配电室、工业厂房等各类电力设施提供全生命周期运维保障。
            公司拥有一支经验丰富的专业技术团队，配备先进的带电清洗设备，
            始终坚持"安全第一、质量为本"的服务理念。
          </p>
          <div class="about-features">
            <div v-for="(feature, index) in features" :key="index" class="about-feature-item">
              <div class="about-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path v-if="index === 0" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <template v-else-if="index === 1">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </template>
                  <path v-else-if="index === 2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  <template v-else>
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                  </template>
                </svg>
              </div>
              <div>
                <h3 class="about-feature-title">{{ feature.title }}</h3>
                <p class="about-feature-desc">{{ feature.desc }}</p>
              </div>
            </div>
          </div>
          <!-- 统计数字 -->
          <div ref="statsRef" class="about-stats">
            <div v-for="(stat, i) in statItems" :key="i" class="about-stat-item">
              <p class="about-stat-number">{{ stat.formattedValue.value }}</p>
              <p class="about-stat-label">{{ stat.label }}</p>
            </div>
          </div>
          <NuxtLink to="/contact" class="about-cta">
            联系我们
            <svg class="about-cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const aboutRef = ref<HTMLElement>()
const aboutVisible = ref(false)
const statsRef = ref<HTMLElement | null>(null)

const features = [
  { title: '安全可靠', desc: '严格执行安全规范，零事故运行记录' },
  { title: '高效专业', desc: '十年行业深耕，500+ 成功案例积累' },
  { title: '技术领先', desc: '先进带电清洗设备，持续技术创新' },
  { title: '客户至上', desc: '定制化解决方案，99% 客户满意度' },
]

// 统计数据
const statsExperience = useCountUp(ref(20), { suffix: '+', triggerRef: statsRef, duration: 2000 })
const statsCases = useCountUp(ref(500), { suffix: '+', triggerRef: statsRef, duration: 2200 })
const statsClients = useCountUp(ref(200), { suffix: '+', triggerRef: statsRef, duration: 2000 })
const statsRate = useCountUp(ref(99), { suffix: '%', triggerRef: statsRef, duration: 2500 })

const statItems = [
  { label: '年行业经验', formattedValue: statsExperience.formattedValue },
  { label: '成功案例', formattedValue: statsCases.formattedValue },
  { label: '合作客户', formattedValue: statsClients.formattedValue },
  { label: '客户满意度', formattedValue: statsRate.formattedValue },
]

onMounted(() => {
  if (aboutRef.value) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          aboutVisible.value = true
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(aboutRef.value)
  }
})
</script>

<style scoped>
.about-section {
  padding: 100px 0;
  background: #ffffff;
}

.about-grid {
  display: flex;
  align-items: center;
  gap: 64px;
}

.about-grid.about-visible .about-image-col {
  animation: fadeInLeft 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.about-grid.about-visible .about-text-col {
  animation: fadeInRight 0.7s 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.about-image-col {
  flex: 0 0 44%;
  opacity: 0;
  transform: translateX(-20px);
}

.about-text-col {
  flex: 1;
  opacity: 0;
  transform: translateX(20px);
}

@keyframes fadeInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.about-image-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.4s ease;
}

.about-image-wrapper:hover {
  box-shadow: 0 8px 40px rgba(37, 99, 235, 0.15);
}

.about-image-accent {
  position: absolute;
  top: -12px;
  left: -12px;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-radius: 16px;
  opacity: 0.12;
  z-index: 0;
  transition: transform 0.4s ease;
}

.about-image-wrapper:hover .about-image-accent {
  transform: scale(1.15);
}

.about-image {
  position: relative;
  z-index: 1;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.about-label {
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  color: #2563eb;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 16px;
  padding: 4px 14px;
  background: rgba(37, 99, 235, 0.06);
  border-radius: 20px;
}

.about-heading {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.about-desc {
  font-size: 16px;
  color: #64748b;
  line-height: 1.8;
  margin-bottom: 32px;
  max-width: 560px;
}

.about-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.about-feature-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.about-feature-item:hover {
  border-color: #93c5fd;
  box-shadow: 0 2px 12px rgba(59, 130, 246, 0.08);
}

.about-feature-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-radius: 10px;
  flex-shrink: 0;
  color: #2563eb;
}

.about-feature-icon svg {
  width: 20px;
  height: 20px;
}

.about-feature-title {
  font-size: 15px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 2px;
}

.about-feature-desc {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 32px 0;
}

.about-stat-item {
  text-align: center;
  padding: 16px 8px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe;
  transition: transform 0.3s, box-shadow 0.3s;
}

.about-stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.12);
}

.about-stat-number {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e40af;
  line-height: 1.2;
  margin-bottom: 2px;
}

.about-stat-label {
  font-size: 0.8rem;
  color: #3b82f6;
  font-weight: 500;
}

.about-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: #2563eb;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}

.about-cta:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
}

.about-cta-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.about-cta:hover .about-cta-arrow {
  transform: translateX(4px);
}

/* 响应式 */
@media (max-width: 1024px) {
  .about-section {
    padding: 72px 0;
  }

  .about-grid {
    gap: 40px;
  }

  .about-image-col {
    flex: 0 0 42%;
  }

  .about-heading {
    font-size: 26px;
  }
}

@media (max-width: 768px) {
  .about-section {
    padding: 56px 0;
  }

  .about-grid {
    flex-direction: column;
    gap: 36px;
  }

  .about-image-col {
    flex: none;
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
  }

  .about-heading {
    font-size: 24px;
  }

  .about-desc {
    font-size: 15px;
  }

  .about-features {
    gap: 12px;
  }

  .about-stats {
    gap: 12px;
    margin: 24px 0;
  }

  .about-stat-number {
    font-size: 1.5rem;
  }

  .about-feature-item {
    padding: 14px;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .about-section {
    padding: 44px 0;
  }

  .about-grid {
    gap: 28px;
  }

  .about-image-col {
    max-width: 100%;
  }

  .about-label {
    font-size: 13px;
    letter-spacing: 2px;
    padding: 4px 12px;
  }

  .about-heading {
    font-size: 20px;
  }

  .about-desc {
    font-size: 14px;
    margin-bottom: 24px;
  }

  .about-features {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .about-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 20px 0;
  }

  .about-stat-item {
    padding: 12px 8px;
  }

  .about-stat-number {
    font-size: 1.3rem;
  }

  .about-feature-icon {
    width: 36px;
    height: 36px;
  }

  .about-feature-icon svg {
    width: 18px;
    height: 18px;
  }

  .about-cta {
    padding: 10px 24px;
    font-size: 14px;
    width: 100%;
    justify-content: center;
  }
}
</style>
