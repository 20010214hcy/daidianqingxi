<template>
  <section class="py-20 services-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 section-header-center">
        <span class="section-tag">服务展示</span>
        <h2 class="section-title">我们的服务</h2>
        <p class="section-desc">提供全方位的工业清洗解决方案</p>
      </div>
      <div v-if="services.length" class="service-showcase">
        <div class="service-focus">
          <Transition name="service-fade" mode="out-in">
            <div :key="activeServiceIndex" class="service-focus-inner">
              <img v-if="services[activeServiceIndex]?.coverImage"
                :src="services[activeServiceIndex].coverImage"
                :alt="services[activeServiceIndex].title"
                class="service-focus-img"
                loading="lazy" />
              <div v-else class="service-focus-placeholder">⚡</div>
              <div class="service-focus-overlay">
                <h3 class="text-2xl md:text-3xl font-bold mb-3">{{ services[activeServiceIndex]?.title }}</h3>
                <p class="text-slate-200 text-lg mb-6 max-w-lg">{{ services[activeServiceIndex]?.description }}</p>
                <NuxtLink :to="`/services/${services[activeServiceIndex]?.id}`"
                  class="inline-flex items-center text-white font-medium hover:text-primary-200 transition-colors">
                  了解详情
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>
        <div class="service-list">
          <div v-for="(service, i) in services" :key="service.id"
            class="service-list-item"
            :class="{ 'is-active': i === activeServiceIndex }"
            @mouseenter="activeServiceIndex = i; pauseAutoplay()"
            @mouseleave="resumeAutoplay()">
            <div class="service-list-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="service-list-content">
              <h4 class="font-bold text-slate-800">{{ service.title }}</h4>
              <p class="text-sm text-slate-600 line-clamp-1">{{ service.description }}</p>
            </div>
            <svg class="service-list-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Service } from '~/types'

interface Props { services: Service[] }
const props = defineProps<Props>()

const activeServiceIndex = ref(0)
let serviceTimer: ReturnType<typeof setInterval> | null = null

const startServiceAutoplay = () => {
  if (props.services.length === 0) return
  serviceTimer = setInterval(() => {
    if (props.services.length > 0) {
      activeServiceIndex.value = (activeServiceIndex.value + 1) % props.services.length
    }
  }, 5000)
}

const pauseAutoplay = () => {
  if (serviceTimer) { clearInterval(serviceTimer); serviceTimer = null }
}

const resumeAutoplay = () => {
  if (!serviceTimer) startServiceAutoplay()
}

onMounted(() => { startServiceAutoplay() })
onUnmounted(() => { if (serviceTimer) clearInterval(serviceTimer) })
</script>

<style scoped>
.service-showcase {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 32px;
}

.service-focus {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 4 / 3;
}

.service-focus-inner { position: relative; width: 100%; height: 100%; }

.service-focus-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
}

.service-focus-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #dbeafe, #93c5fd);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6rem;
}

.service-focus-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: #fff;
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.service-list-item:hover,
.service-list-item.is-active { background: #f0f9ff; }

.service-list-num {
  font-size: 1.5rem;
  font-weight: 800;
  min-width: 36px;
  transition: color 0.3s;
}

.service-list-content { flex: 1; min-width: 0; }

.service-list-arrow {
  width: 20px;
  height: 20px;
  color: #94a3b8;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s;
}

.service-list-item.is-active .service-list-arrow {
  opacity: 1;
  transform: translateX(0);
}

.service-fade-enter-active, .service-fade-leave-active { transition: opacity 0.5s ease; }
.service-fade-enter-from, .service-fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .service-showcase { grid-template-columns: 1fr; min-height: auto; }
  .service-focus { aspect-ratio: 16 / 10; }
  .service-focus-overlay { padding: 24px; }
}
</style>
