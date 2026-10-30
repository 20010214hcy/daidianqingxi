<template>
  <section id="business" class="business-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="business-header">
        <span class="section-tag">核心业务</span>
        <h2 class="business-title">两大业务板块</h2>
        <p class="business-desc">带电清洗保障供电安全，储能集成助力绿色用能</p>
      </div>

      <div class="business-frame">
        <aside class="business-rail" aria-label="业务板块切换">
          <button
            v-for="unit in units"
            :key="unit.id"
            type="button"
            class="rail-item"
            :class="{ active: activeUnit === unit.id }"
            :data-unit="unit.id"
            :aria-pressed="activeUnit === unit.id"
            @click="activeUnit = unit.id"
          >
            <span class="rail-cnt">{{ unitServices(unit.id).length }} 项服务</span>
            <span class="rail-en">{{ unit.en }}</span>
            <span class="rail-name">{{ unit.name }}</span>
            <span class="rail-desc">{{ unit.tagline }}</span>
          </button>

          <div class="rail-tip">
            <b>选型拿不准？</b>
            <span>提供电压等级与现场工况，工程师 1 小时内给出方案建议。</span>
            <NuxtLink to="/contact" class="rail-tip-link">免费技术咨询 →</NuxtLink>
          </div>
        </aside>

        <div :key="activeUnit" class="business-panel" :class="`panel-unit-${activeUnit}`">
          <div class="panel-hero">
            <NuxtImg
              :src="activeUnitData.img"
              alt=""
              class="panel-img"
              sizes="xs:100vw sm:100vw md:100vw lg:940px"
              format="webp"
              quality="74"
              loading="lazy"
              decoding="async"
            />
            <div class="panel-mask" />
            <div class="hero-text">
              <div class="hero-kicker">{{ activeUnitData.kicker }}</div>
              <h3 class="hero-title">{{ activeUnitData.title }}</h3>
              <p class="hero-desc">{{ activeUnitData.desc }}</p>
            </div>
          </div>

          <div class="panel-body">
            <div class="body-head">
              <h4>核心服务</h4>
              <NuxtLink :to="activeUnitData.moreLink" class="body-more">查看全部服务 →</NuxtLink>
            </div>
            <div class="svc-grid">
              <NuxtLink
                v-for="s in activeServices"
                :key="s.id"
                :to="`/services/${s.id}`"
                class="svc"
              >
                <span class="svc-dot" />
                <span class="svc-name">{{ s.title }}</span>
                <span v-if="serviceBrief(s)" class="svc-brief">{{ serviceBrief(s) }}</span>
              </NuxtLink>
              <div v-if="!activeServices.length" class="svc-empty">服务陆续上线中</div>
            </div>

            <div class="panel-cta">
              <NuxtLink :to="activeUnitData.moreLink" class="cta-main">{{ activeUnitData.cta }}</NuxtLink>
              <NuxtLink to="/contact" class="cta-ghost">获取报价</NuxtLink>
            </div>
          </div>
        </div>
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

const activeUnit = ref<1 | 2>(1)

const units = [
  {
    id: 1 as const,
    name: '带电清洗',
    en: 'LIVE-LINE CLEANING',
    tagline: '不停电清除设备积污，消除污闪隐患',
    kicker: '带电清洗 · 供电保障',
    title: '0–1000kV 全电压等级带电清洗',
    desc: '变电站、配电室、输电线路与工业厂房带电清洗，不停电作业，消除污闪与放电隐患，保障供电可靠性。',
    img: '/uploads/hero-bg-v2.webp',
    cta: '查看清洗服务',
    moreLink: '/services?unit=daidianqingxi',
  },
  {
    id: 2 as const,
    name: '储能集成',
    en: 'ENERGY STORAGE',
    tagline: '工商业储能 EPC 与智能运维交付',
    kicker: '储能集成 · 绿色用能',
    title: '工商业储能一站式 EPC 交付',
    desc: '工商业储能、台区储能系统集成与交付，覆盖方案设计、设备选型、建设施工到并网投运与智能运维。',
    img: '/uploads/8cdfe3f4-2d8f-4208-b98c-87378a2ccb31.webp',
    cta: '查看储能服务',
    moreLink: '/services?unit=chuneng',
  },
]

const activeUnitData = computed(() => units.find((u) => u.id === activeUnit.value) ?? units[0])

const unitServices = (unitId: number) =>
  (props.services || []).filter((s: any) =>
    unitId === 1 ? !s.businessUnitId || s.businessUnitId === 1 : s.businessUnitId === 2,
  )

const activeServices = computed(() => unitServices(activeUnit.value).slice(0, 8))

const serviceBrief = (s: Service) => {
  const text = (s.description || '').trim()
  if (!text) return ''
  return text.length > 34 ? text.slice(0, 34) + '…' : text
}
</script>

<style scoped>
.business-section {
  padding: 80px 0;
  background: #fff;
  scroll-margin-top: 88px;
}

.business-header {
  text-align: center;
  margin-bottom: 44px;
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

.business-frame {
  display: flex;
  gap: 22px;
  align-items: stretch;
}

/* ===== 左侧竖排切换器 ===== */
.business-rail {
  width: 232px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rail-item {
  position: relative;
  display: block;
  width: 100%;
  text-align: left;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px 18px;
  cursor: pointer;
  background: #fff;
  font-family: inherit;
  transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  overflow: hidden;
}

.rail-item:hover {
  border-color: #cbd5e1;
}

.rail-item.active {
  border-color: #1d4ed8;
  background: #f6faff;
  box-shadow: 0 8px 22px rgba(29, 78, 216, 0.08);
}

.rail-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 14px;
  bottom: 14px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: #1d4ed8;
}

.rail-item[data-unit='2'].active {
  border-color: #059669;
  background: #f4fdf9;
  box-shadow: 0 8px 22px rgba(5, 150, 105, 0.08);
}

.rail-item[data-unit='2'].active::before {
  background: #059669;
}

.rail-en {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #94a3b8;
  margin-bottom: 5px;
}

.rail-item.active .rail-en {
  color: #1d4ed8;
}

.rail-item[data-unit='2'].active .rail-en {
  color: #059669;
}

.rail-name {
  display: block;
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 5px;
}

.rail-desc {
  display: block;
  font-size: 11.5px;
  color: #64748b;
  line-height: 1.55;
}

.rail-cnt {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
}

.rail-item.active .rail-cnt {
  color: #1d4ed8;
}

.rail-item[data-unit='2'].active .rail-cnt {
  color: #059669;
}

.rail-tip {
  margin-top: auto;
  padding: 14px 16px;
  border-radius: 14px;
  background: #0f172a;
  color: #fff;
}

.rail-tip b {
  display: block;
  font-size: 12.5px;
  margin-bottom: 4px;
}

.rail-tip span {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  display: block;
}

.rail-tip-link {
  display: inline-block;
  margin-top: 9px;
  font-size: 11.5px;
  font-weight: 600;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  padding: 5px 14px;
  transition: background 0.2s ease;
}

.rail-tip-link:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* ===== 右侧主面板 ===== */
.business-panel {
  flex: 1;
  min-width: 0;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  animation: panelIn 0.4s ease;
}

@keyframes panelIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.panel-hero {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.panel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.business-panel:hover .panel-img {
  transform: scale(1.03);
}

.panel-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, rgba(15, 23, 42, 0.82) 0%, rgba(15, 23, 42, 0.45) 55%, rgba(15, 23, 42, 0.1) 100%);
}

.hero-text {
  position: absolute;
  left: 34px;
  bottom: 28px;
  right: 34px;
  color: #fff;
}

.hero-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #93c5fd;
  margin-bottom: 7px;
}

.panel-unit-2 .hero-kicker {
  color: #6ee7b7;
}

.hero-title {
  font-size: clamp(22px, 2vw, 28px);
  font-weight: 800;
  margin: 0 0 8px;
  letter-spacing: 0.02em;
}

.hero-desc {
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.82);
  max-width: 560px;
  line-height: 1.65;
  margin: 0;
}

.panel-body {
  padding: 22px 28px 28px;
}

.body-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;
}

.body-head h4 {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.body-more {
  font-size: 12px;
  font-weight: 600;
  color: #1d4ed8;
}

.panel-unit-2 .body-more {
  color: #059669;
}

.svc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.svc {
  border: 1px solid #e9eef4;
  border-radius: 11px;
  padding: 13px 13px 14px;
  background: #fbfcfe;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-decoration: none;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.svc:hover {
  border-color: #bfdbfe;
  background: #f4f8ff;
  transform: translateY(-2px);
}

.panel-unit-2 .svc:hover {
  border-color: #a7f3d0;
  background: #f2fdf7;
}

.svc-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3b82f6;
  flex-shrink: 0;
}

.panel-unit-2 .svc-dot {
  background: #10b981;
}

.svc-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a2433;
  line-height: 1.45;
}

.svc-brief {
  font-size: 11px;
  color: #8a95a5;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.svc-empty {
  color: #94a3b8;
  font-size: 13px;
  padding: 8px 4px;
  grid-column: 1 / -1;
}

.panel-cta {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

.cta-main {
  flex: 1;
  text-align: center;
  font-size: 13.5px;
  font-weight: 700;
  color: #fff;
  background: #1d4ed8;
  border-radius: 999px;
  padding: 12px 0;
  text-decoration: none;
  transition: background 0.2s ease;
}

.cta-main:hover {
  background: #1e40af;
}

.panel-unit-2 .cta-main {
  background: #059669;
}

.panel-unit-2 .cta-main:hover {
  background: #047857;
}

.cta-ghost {
  flex: 1;
  text-align: center;
  font-size: 13.5px;
  font-weight: 700;
  color: #1d4ed8;
  border: 1.5px solid #bfdbfe;
  border-radius: 999px;
  padding: 11px 0;
  text-decoration: none;
  transition: background 0.2s ease;
}

.cta-ghost:hover {
  background: #eff6ff;
}

.panel-unit-2 .cta-ghost {
  color: #059669;
  border-color: #a7f3d0;
}

.panel-unit-2 .cta-ghost:hover {
  background: #ecfdf5;
}

@media (prefers-reduced-motion: reduce) {
  .business-panel {
    animation: none;
  }
}

@media (max-width: 960px) {
  .business-frame {
    flex-direction: column;
  }

  .business-rail {
    width: 100%;
    flex-direction: row;
  }

  .rail-item {
    flex: 1;
    padding: 14px;
  }

  .rail-desc,
  .rail-tip,
  .rail-cnt {
    display: none;
  }

  .rail-name {
    margin-bottom: 0;
  }

  .svc-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .panel-hero {
    height: 200px;
  }

  .hero-text {
    left: 20px;
    right: 20px;
    bottom: 18px;
  }

  .panel-body {
    padding: 18px 16px 20px;
  }
}

@media (max-width: 480px) {
  .business-section {
    padding: 40px 0;
  }

  .business-header {
    margin-bottom: 24px;
  }

  .hero-desc {
    font-size: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .panel-cta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
