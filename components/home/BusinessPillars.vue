<template>
  <section id="business" class="business-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="business-header">
        <span class="section-tag">核心业务</span>
        <h2 class="business-title">两大业务板块</h2>
        <p class="business-desc">带电清洗保障供电安全，储能集成助力绿色用能</p>
      </div>

      <div class="business-grid">
        <article class="business-card business-card-clean">
          <div class="business-visual">
            <NuxtImg
              src="/uploads/hero-bg.webp"
              alt=""
              class="business-img"
              sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:640px"
              format="webp"
              quality="74"
              loading="lazy"
              decoding="async"
            />
            <div class="business-img-mask" />
          </div>
          <div class="business-card-body">
            <div class="business-accent business-accent-blue" />
            <div class="business-badge">业务一</div>
            <h3 class="business-name">带电清洗</h3>
            <p class="business-summary">
              变电站、配电室、工业厂房带电清洗与高压清洗，不停电作业，降低闪络与停电风险。
            </p>
            <ul class="business-points">
              <li v-for="s in cleanServices" :key="s.id">
                <NuxtLink :to="`/services/${s.id}`" class="business-point-link">
                  <span class="point-dot" />
                  <span>{{ s.title }}</span>
                  <svg class="point-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
                </NuxtLink>
              </li>
              <li v-if="!cleanServices.length" class="business-point-empty">服务陆续上线中</li>
            </ul>
            <NuxtLink to="/services" class="business-cta">
              查看清洗服务
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
            </NuxtLink>
          </div>
        </article>

        <article class="business-card business-card-storage">
          <div class="business-visual">
            <NuxtImg
              src="/uploads/default-service.jpg"
              alt=""
              class="business-img"
              sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:640px"
              format="webp"
              quality="74"
              loading="lazy"
              decoding="async"
            />
            <div class="business-img-mask" />
          </div>
          <div class="business-card-body">
            <div class="business-accent business-accent-emerald" />
            <div class="business-badge">业务二</div>
            <h3 class="business-name">储能集成</h3>
            <p class="business-summary">
              工商业储能、台区储能系统集成与交付，覆盖方案设计、设备选型到并网运维。
            </p>
            <ul class="business-points">
              <li v-for="p in storagePoints" :key="p.label">
                <NuxtLink :to="p.to" class="business-point-link">
                  <span class="point-dot point-dot-emerald" />
                  <span>{{ p.label }}</span>
                  <svg class="point-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
                </NuxtLink>
              </li>
            </ul>
            <NuxtLink to="/products" class="business-cta">
              查看储能方案
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Service } from '~/types'

interface Props {
  services: Service[]
}
const props = defineProps<Props>()

const cleanServices = computed(() =>
  (props.services || [])
    .filter((s) => !s.businessUnitId || s.businessUnitId === 1)
    .slice(0, 4)
)

const storagePoints = [
  { label: '工商业储能', to: '/products' },
  { label: '台区储能', to: '/products' },
  { label: '系统集成方案', to: '/solutions' },
]
</script>

<style scoped>
.business-section {
  padding: 80px 0;
  background: #fff;
  scroll-margin-top: 88px;
}

.business-header {
  text-align: center;
  margin-bottom: 48px;
}

.business-title {
  font-size: clamp(20px, 1.8vw, 26px);
  font-weight: 800;
  color: #0f172a;
  margin: 8px 0 12px;
  letter-spacing: 0.02em;
}

.business-desc {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.business-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}

.business-card {
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.business-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  border-color: #cbd5e1;
}

.business-visual {
  position: relative;
  height: 180px;
  overflow: hidden;
  flex-shrink: 0;
}

.business-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.business-card:hover .business-img {
  transform: scale(1.04);
}

.business-img-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.45) 100%);
}

.business-card-body {
  position: relative;
  padding: 28px 28px 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.business-accent {
  position: absolute;
  top: 0;
  left: 28px;
  right: 28px;
  height: 3px;
  border-radius: 0 0 3px 3px;
  transform: translateY(-1px);
}

.business-accent-blue {
  background: linear-gradient(90deg, #2563eb, #60a5fa);
}

.business-accent-emerald {
  background: linear-gradient(90deg, #059669, #34d399);
}

.business-badge {
  display: inline-block;
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 12px;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
  font-weight: 600;
}

.business-name {
  font-size: clamp(18px, 1.6vw, 22px);
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 12px;
  letter-spacing: 0.02em;
}

.business-summary {
  margin: 0 0 20px;
  color: #64748b;
  font-size: 13.5px;
  line-height: 1.7;
}

.business-points {
  list-style: none;
  margin: 0 0 24px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.business-point-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #1e293b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.business-point-link:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.business-card-storage .business-point-link:hover {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #047857;
}

.point-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3b82f6;
  flex-shrink: 0;
}

.point-dot-emerald {
  background: #10b981;
}

.point-arrow {
  width: 14px;
  height: 14px;
  margin-left: auto;
  opacity: 0.45;
}

.business-point-empty {
  color: #94a3b8;
  font-size: 14px;
  padding: 8px 4px;
}

.business-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 10px;
  background: #0f172a;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease;
  align-self: flex-start;
}

.business-cta:hover {
  background: #1e293b;
  transform: translateY(-1px);
}

.business-card-storage .business-cta:hover {
  background: #064e3b;
}

/* md-desktop-density */
@media (min-width: 960px) and (max-width: 1440px) {
  .business-section {
    padding: 64px 0;
  }

  .business-title {
    font-size: 30px;
  }

  .business-card {
    min-height: 380px;
  }

  .business-card-body {
    padding: 28px 24px 26px;
  }

  .business-name {
    font-size: 24px;
  }

  .business-points {
    margin-bottom: 18px;
  }
}

@media (max-width: 900px) {
  .business-grid {
    grid-template-columns: 1fr;
  }

  .business-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .business-section {
    padding: 40px 0;
  }

  .business-header {
    margin-bottom: 24px;
  }

  .business-title {
    font-size: 22px;
  }

  .business-desc {
    font-size: 13px;
  }

  .business-visual {
    height: 120px;
  }

  .business-card-body {
    padding: 16px 14px 18px;
  }

  .business-accent {
    left: 14px;
    right: 14px;
  }

  .business-badge {
    font-size: 11px;
    margin-bottom: 8px;
  }

  .business-name {
    font-size: 18px;
    margin-bottom: 8px;
  }

  .business-summary {
    font-size: 12px;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .business-points {
    margin-bottom: 14px;
    gap: 6px;
  }

  .business-point-link {
    padding: 8px 10px;
    font-size: 12px;
  }

  .business-cta {
    padding: 10px 16px;
    font-size: 13px;
    width: 100%;
    justify-content: center;
  }
}
</style>
