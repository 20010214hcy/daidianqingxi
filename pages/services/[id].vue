<template>
  <div class="service-detail-page">
    <!-- 顶部横幅 -->
    <section class="detail-banner">
      <div class="banner-bg">
        <img           :src="service?.coverImage || '/uploads/default-service.jpg'"
          :alt="service?.title"
          class="banner-image"
        />
        <div class="banner-overlay"></div>
      </div>
      <div class="banner-content">
        <div class="container">
          <!-- 面包屑导航 -->
          <nav class="breadcrumb">
            <NuxtLink to="/" class="breadcrumb-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              首页
            </NuxtLink>
            <span class="separator">/</span>
            <NuxtLink to="/services" class="breadcrumb-item">服务项目</NuxtLink>
            <span class="separator">/</span>
            <span class="breadcrumb-current">{{ service?.title || '加载中...' }}</span>
          </nav>
          <!-- 标题 -->
          <h1 class="banner-title">{{ service?.title || '加载中...' }}</h1>
        </div>
      </div>
    </section>

    <!-- 加载状态 -->
    <template v-if="loading">
      <section class="loading-section">
        <div class="container">
          <div class="loading-skeleton">
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
          </div>
        </div>
      </section>
    </template>

    <!-- 内容区域 -->
    <template v-else-if="service">
      <!-- 项目概述 -->
      <section class="overview-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">项目概述</h2>
            <div class="title-line"></div>
          </div>
          <div class="overview-content">
            <!-- 视频/图片区域 -->
            <div v-if="service.videoUrl || service.detailImage" class="overview-media">
              <video
                v-if="service.videoUrl"
                :src="service.videoUrl"
                controls
                autoplay
                muted
                loop
                class="overview-video"
              ></video>
              <img                 v-else-if="service.detailImage"
                :src="service.detailImage"
                :alt="service.title"
                class="overview-image"
              />
            </div>
            <!-- 文字描述 -->
            <div class="overview-text">
              <h3 class="overview-name">{{ service.title }}</h3>
              <div class="overview-description" v-html="service.content || service.description"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 方案优势 -->
      <section v-if="advantages && advantages.length > 0" class="advantages-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">方案优势</h2>
            <div class="title-line"></div>
          </div>
          <div class="advantages-grid">
            <div
              v-for="(adv, index) in advantages"
              :key="index"
              class="advantage-card"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="advantage-icon">
                <span v-if="adv.icon" class="text-2xl">{{ adv.icon }}</span>
                <svg v-else viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="24" cy="24" r="20"/>
                  <path d="M16 24l6 6 10-10"/>
                </svg>
              </div>
              <h3 class="advantage-title">{{ adv.title }}</h3>
              <p class="advantage-desc">{{ adv.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 技术参数 -->
      <section v-if="service.specs && service.specs.length > 0" class="specs-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">技术参数</h2>
            <div class="title-line"></div>
          </div>
          <div class="specs-table-wrapper">
            <table class="specs-table">
              <tbody>
                <tr v-for="(spec, index) in service.specs" :key="index">
                  <td class="spec-label">{{ spec.label }}</td>
                  <td class="spec-value">{{ spec.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 推荐产品 -->
      <section v-if="relatedProducts && relatedProducts.length > 0" class="products-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">推荐产品</h2>
            <div class="title-line"></div>
          </div>
          <div class="products-slider">
            <div class="products-track">
              <div
                v-for="product in relatedProducts"
                :key="product.id"
                class="product-card"
              >
                <NuxtLink :to="`/products/${product.id}`" class="product-link">
                  <div class="product-image">
                    <img :src="product.image || product.coverImage" :alt="product.name"  loading="lazy" />
                  </div>
                  <div class="product-info">
                    <h4 class="product-name">{{ product.name }}</h4>
                    <p class="product-desc">{{ product.description }}</p>
                    <span class="product-more">查看更多 →</span>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 参考案例 -->
      <section v-if="relatedCases && relatedCases.length > 0" class="cases-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">参考案例</h2>
            <div class="title-line"></div>
          </div>
          <div class="cases-slider">
            <div
              v-for="caseItem in relatedCases"
              :key="caseItem.id"
              class="case-card"
            >
              <NuxtLink :to="`/cases/${caseItem.id}`" class="case-link">
                <div class="case-image">
                  <img :src="caseItem.coverImage" :alt="caseItem.title"  loading="lazy" />
                </div>
                <div class="case-info">
                  <h4 class="case-name">{{ caseItem.title }}</h4>
                  <p v-if="caseItem.specs" class="case-specs">{{ caseItem.specs }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- 底部导航 -->
      <section class="nav-section">
        <div class="container">
          <div class="nav-links">
            <NuxtLink to="/services" class="nav-back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              返回服务列表
            </NuxtLink>
            <NuxtLink to="/contact" class="nav-contact">
              咨询服务
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </section>
    </template>

    <!-- 错误状态 -->
    <template v-else>
      <section class="error-section">
        <div class="container">
          <div class="error-content">
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="32" cy="32" r="28"/>
              <path d="M20 20l24 24M44 20L20 44"/>
            </svg>
            <h2>服务未找到</h2>
            <p>您访问的服务页面不存在或已被删除</p>
            <NuxtLink to="/services" class="back-btn">返回服务列表</NuxtLink>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const serviceId = route.params.id

// 状态
const loading = ref(true)
const service = ref<any>(null)
const advantages = ref<any[]>([])
const relatedProducts = ref<any[]>([])
const relatedCases = ref<any[]>([])

// 获取服务详情
const fetchServiceDetail = async () => {
  loading.value = true
  try {
    const response = await $fetch(`/api/services/${serviceId}`)
    if (response.success && response.data) {
      service.value = response.data

      // 解析优势数据
      if (response.data.advantages) {
        try {
          advantages.value = typeof response.data.advantages === 'string'
            ? JSON.parse(response.data.advantages)
            : response.data.advantages
        } catch (e) {
          advantages.value = []
        }
      }

      // 获取相关产品
      if (response.data.relatedProducts) {
        relatedProducts.value = response.data.relatedProducts
      }

      // 获取相关案例
      if (response.data.relatedCases) {
        relatedCases.value = response.data.relatedCases
      }
    }
  } catch (error) {
    console.error('获取服务详情失败:', error)
  } finally {
    loading.value = false
  }
}

// SEO
useHead({
  title: computed(() => service.value ? `${service.value.title} - 玺铭电力` : '服务详情 - 玺铭电力'),
  meta: [
    {
      name: 'description',
      content: computed(() => service.value?.description || '玺铭电力专业服务')
    }
  ]
})

onMounted(() => {
  fetchServiceDetail()
})
</script>

<style scoped>
/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 顶部横幅 */
.detail-banner {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.banner-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 48px;
}

/* 面包屑 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb-item:hover {
  color: white;
}

.breadcrumb-item svg {
  width: 16px;
  height: 16px;
}

.separator {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

.breadcrumb-current {
  font-size: 14px;
  color: white;
}

.banner-title {
  font-size: 42px;
  font-weight: 700;
  color: white;
  letter-spacing: 2px;
}

/* 加载状态 */
.loading-section {
  padding: 80px 0;
}

.loading-skeleton {
  max-width: 800px;
}

.skeleton-title {
  height: 32px;
  width: 300px;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 24px;
  animation: pulse 1.5s infinite;
}

.skeleton-text {
  height: 18px;
  width: 100%;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 16px;
  animation: pulse 1.5s infinite;
}

.skeleton-text.short {
  width: 60%;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 通用区块样式 */
.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 16px;
}

.title-line {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  margin: 0 auto;
}

/* 项目概述 */
.overview-section {
  padding: 80px 0;
  background: white;
}

.overview-content {
  display: flex;
  gap: 48px;
  align-items: flex-start;
}

.overview-media {
  flex: 1;
  max-width: 600px;
}

.overview-video,
.overview-image {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.overview-text {
  flex: 1;
}

.overview-name {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 20px;
}

.overview-description {
  font-size: 16px;
  line-height: 1.8;
  color: #4a5568;
}

.overview-description :deep(p) {
  margin-bottom: 16px;
}

/* 方案优势 */
.advantages-section {
  padding: 80px 0;
  background: #f8fafc;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.advantage-card {
  background: white;
  padding: 32px 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.advantage-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.advantage-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 16px;
}

.advantage-icon img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.advantage-icon svg {
  width: 40px;
  height: 40px;
  color: #2563eb;
}

.advantage-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.advantage-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
}

/* 技术参数 */
.specs-section {
  padding: 80px 0;
  background: white;
}

.specs-table-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table tr {
  border-bottom: 1px solid #e2e8f0;
}

.specs-table tr:last-child {
  border-bottom: none;
}

.spec-label {
  width: 200px;
  padding: 16px 20px;
  font-size: 15px;
  font-weight: 500;
  color: #1a1a2e;
  background: #f8fafc;
}

.spec-value {
  padding: 16px 20px;
  font-size: 15px;
  color: #4a5568;
}

/* 推荐产品 */
.products-section {
  padding: 80px 0;
  background: #f8fafc;
}

.products-slider {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.products-track {
  display: flex;
  gap: 24px;
  padding-bottom: 16px;
}

.product-card {
  flex: 0 0 280px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.product-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.product-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-more {
  font-size: 14px;
  color: #2563eb;
  font-weight: 500;
}

/* 参考案例 */
.cases-section {
  padding: 80px 0;
  background: white;
}

.cases-slider {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.case-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.case-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.case-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.case-image {
  height: 200px;
  overflow: hidden;
}

.case-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.case-card:hover .case-image img {
  transform: scale(1.05);
}

.case-info {
  padding: 20px;
  background: white;
}

.case-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.case-specs {
  font-size: 14px;
  color: #2563eb;
  font-weight: 500;
}

/* 底部导航 */
.nav-section {
  padding: 40px 0;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.nav-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-back,
.nav-contact {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-back {
  color: #64748b;
}

.nav-back:hover {
  color: #2563eb;
}

.nav-back svg {
  width: 18px;
  height: 18px;
}

.nav-contact {
  color: white;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  padding: 12px 24px;
  border-radius: 8px;
}

.nav-contact:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}

.nav-contact svg {
  width: 18px;
  height: 18px;
}

/* 错误状态 */
.error-section {
  padding: 120px 0;
  background: #f8fafc;
}

.error-content {
  text-align: center;
}

.error-content svg {
  width: 80px;
  height: 80px;
  color: #cbd5e1;
  margin-bottom: 24px;
}

.error-content h2 {
  font-size: 24px;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.error-content p {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 32px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  color: white;
  background: #2563eb;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

/* 响应式 */
@media (max-width: 1024px) {
  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cases-slider {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .detail-banner {
    height: 300px;
  }

  .banner-title {
    font-size: 28px;
  }

  .overview-content {
    flex-direction: column;
  }

  .overview-media {
    max-width: 100%;
  }

  .advantages-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .cases-slider {
    grid-template-columns: 1fr;
  }

  .product-card {
    flex: 0 0 240px;
  }
}

@media (max-width: 480px) {
  .detail-banner {
    height: 250px;
  }

  .banner-title {
    font-size: 24px;
  }

  .section-title {
    font-size: 24px;
  }

  .nav-links {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
