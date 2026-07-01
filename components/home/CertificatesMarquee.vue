<template>
  <section class="py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div class="text-center">
        <span class="inline-block bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">资质荣誉</span>
        <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">专业资质 · 值得信赖</h2>
        <p class="text-slate-600 text-lg max-w-2xl mx-auto">多年行业深耕，获得多项专业资质认证，为客户提供安全可靠的服务保障</p>
      </div>
    </div>

    <div v-if="certificates.length <= 4" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="cert in certificates" :key="cert.id" class="cert-card group">
          <div class="cert-image-wrapper">
            <img v-if="cert.image" :src="cert.image" :alt="cert.title" class="cert-image" loading="lazy" />
          </div>
          <div class="cert-info">
            <h3 class="cert-title">{{ cert.title }}</h3>
          </div>
        </div>
      </div>
    </div>

    <template v-else>
      <div class="marquee-wrapper" @mouseenter="pauseAnimation" @mouseleave="resumeAnimation">
        <div class="marquee-track" :class="{ paused: isPaused }" :style="{ animationDuration: animDuration + 's' }">
          <div v-for="(cert, index) in duplicatedCerts" :key="index" class="marquee-item">
            <div class="cert-card">
              <div class="cert-image-wrapper">
                <img v-if="cert.image" :src="cert.image" :alt="cert.title" class="cert-image" loading="lazy" />
              </div>
              <div class="cert-info">
                <h3 class="cert-title">{{ cert.title }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
interface Certificate {
  id: number
  title: string
  image: string
  sortOrder: number
}

const props = defineProps<{ certificates: Certificate[] }>()

const isPaused = ref(false)

const duplicatedCerts = computed(() => {
  const certs = props.certificates || []
  if (certs.length <= 4) return certs
  return [...certs, ...certs, ...certs]
})

const animDuration = computed(() => {
  const count = props.certificates?.length || 0
  return Math.min(60, Math.max(20, count * 5))
})

const pauseAnimation = () => { isPaused.value = true }
const resumeAnimation = () => { isPaused.value = false }
</script>

<style scoped>
.cert-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.cert-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}
.cert-image-wrapper {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f9fafb;
}
.cert-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cert-info {
  padding: 14px 16px;
  text-align: center;
}
.cert-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  line-height: 1.5;
}
.marquee-wrapper {
  overflow: hidden;
  width: 100%;
}
.marquee-track {
  display: flex;
  animation: scroll-left linear infinite;
  width: max-content;
}
.marquee-track.paused {
  animation-play-state: paused;
}
.marquee-item {
  flex-shrink: 0;
  margin: 0 10px;
  width: 220px;
}
@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.33%); }
}
@media (max-width: 640px) {
  .marquee-item { width: 160px; margin: 0 8px; }
  .cert-image-wrapper { height: 140px; }
}
</style>
