<template>
  <section class="certs-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span class="certs-tag">资质荣誉</span>
        <h2 class="certs-heading">专业资质 · 值得信赖</h2>
        <p class="certs-desc">多年行业深耕，获得多项专业资质认证，为客户提供安全可靠的服务保障</p>
      </div>

      <div v-if="certificates.length" class="certs-grid">
        <div
          v-for="(cert, index) in certificates"
          :key="cert.id"
          class="cert-card"
          @click="openLightbox(index)"
        >
          <div class="cert-img-wrap">
            <img
              v-if="cert.image"
              :src="cert.image"
              :alt="cert.title"
              class="cert-img"
              loading="lazy"
            />
            <div class="cert-zoom-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
          </div>
          <div class="cert-info">
            <h3 class="cert-title">{{ cert.title }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- 灯箱弹窗 -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div v-if="lightboxOpen" class="lightbox-overlay" @click.self="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox" aria-label="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <button v-if="certificates.length > 1" class="lightbox-nav lightbox-prev" @click="prevCert" aria-label="上一张">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div class="lightbox-content">
            <div class="lightbox-img-wrap">
              <img
                v-if="currentCert?.image"
                :src="currentCert.image"
                :alt="currentCert.title"
                class="lightbox-img"
              />
            </div>
            <div class="lightbox-info">
              <h3 class="lightbox-title">{{ currentCert?.title }}</h3>
              <p v-if="currentCert?.description" class="lightbox-desc">{{ currentCert.description }}</p>
              <span class="lightbox-counter">{{ currentIndex + 1 }} / {{ certificates.length }}</span>
            </div>
          </div>

          <button v-if="certificates.length > 1" class="lightbox-nav lightbox-next" @click="nextCert" aria-label="下一张">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
interface Certificate {
  id: number
  title: string
  image: string
  description?: string
  sortOrder: number
}

const props = defineProps<{ certificates: Certificate[] }>()

const lightboxOpen = ref(false)
const currentIndex = ref(0)

const currentCert = computed(() => props.certificates[currentIndex.value])

const openLightbox = (index: number) => {
  currentIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const prevCert = () => {
  currentIndex.value = currentIndex.value === 0
    ? props.certificates.length - 1
    : currentIndex.value - 1
}

const nextCert = () => {
  currentIndex.value = (currentIndex.value + 1) % props.certificates.length
}

onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (!lightboxOpen.value) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') prevCert()
    if (e.key === 'ArrowRight') nextCert()
  }
  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})
</script>

<style scoped>
.certs-section {
  padding: 80px 0;
  background: #f5f7fa;
}

.certs-tag {
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  color: #1a73e8;
  letter-spacing: 2px;
  background: #e8f0fe;
  padding: 6px 16px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.certs-heading {
  font-size: 36px;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.certs-desc {
  font-size: 16px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

/* 网格 */
.certs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* 证书卡片 */
.cert-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cert-card:hover {
  transform: translateY(-6px);
  border-color: #1a73e8;
  box-shadow: 0 12px 32px rgba(26, 115, 232, 0.12);
}

/* 图片容器 - 固定高度，所有卡片一致 */
.cert-img-wrap {
  position: relative;
  height: 200px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 图片在容器内完整显示，不裁切 */
.cert-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.cert-card:hover .cert-img {
  transform: scale(1.03);
}

/* 放大图标 */
.cert-zoom-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(26, 115, 232, 0.12);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cert-card:hover .cert-zoom-icon {
  opacity: 1;
}

.cert-zoom-icon svg {
  width: 36px;
  height: 36px;
  color: #fff;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.cert-info {
  padding: 14px 16px;
  text-align: center;
  border-top: 1px solid #f1f5f9;
}

.cert-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  line-height: 1.5;
}

/* ========== 灯箱 ========== */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  z-index: 10;
}

.lightbox-close:hover { background: rgba(255, 255, 255, 0.2); }
.lightbox-close svg { width: 24px; height: 24px; color: #fff; }

.lightbox-content {
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-img-wrap {
  max-height: 70vh;
  overflow: hidden;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  display: block;
}

.lightbox-info {
  text-align: center;
  margin-top: 20px;
}

.lightbox-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.lightbox-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  max-width: 500px;
}

.lightbox-counter {
  display: inline-block;
  margin-top: 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
}

/* 导航箭头 */
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  z-index: 10;
}

.lightbox-nav:hover { background: rgba(255, 255, 255, 0.2); }
.lightbox-nav svg { width: 24px; height: 24px; color: #fff; }
.lightbox-prev { left: 20px; }
.lightbox-next { right: 20px; }

.lightbox-enter-active { transition: opacity 0.3s ease; }
.lightbox-leave-active { transition: opacity 0.2s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }

/* 响应式 */
@media (max-width: 1024px) {
  .certs-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
}

@media (max-width: 768px) {
  .certs-section { padding: 60px 0; }
  .certs-heading { font-size: 28px; }
  .certs-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .cert-img-wrap { height: 160px; }
  .lightbox-overlay { padding: 20px; }
  .lightbox-nav { width: 40px; height: 40px; }
  .lightbox-prev { left: 10px; }
  .lightbox-next { right: 10px; }
}

@media (max-width: 480px) {
  .certs-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .cert-img-wrap { height: 140px; }
  .cert-info { padding: 10px 12px; }
  .cert-title { font-size: 13px; }
  .lightbox-title { font-size: 16px; }
}
</style>
