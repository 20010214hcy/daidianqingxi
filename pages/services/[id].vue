<template>
  <div class="service-detail-page">
    <!-- 顶部横幅 -->
    <DetailBanner
      :breadcrumb="[
        { name: '首页', to: '/' },
        { name: '服务项目', to: '/services' },
      ]"
      :tag="service?.businessunit?.name"
      :title="service?.title"
      :lead="service?.description"
    />

    <!-- 内容区域 -->
    <template v-if="service?.id">
      <!-- 项目概述 -->
      <section class="overview-section">
        <div class="container-page">
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
              <div class="overview-description" v-html="sanitizedContent"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 方案优势 -->
      <section v-if="advantages && advantages.length > 0" class="advantages-section">
        <div class="container-page">
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
        <div class="container-page">
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
        <div class="container-page">
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
        <div class="container-page">
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
        <div class="container-page">
          <div class="nav-links">
            <NuxtLink to="/services" class="nav-back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              返回服务列表
            </NuxtLink>
            <NuxtLink
              :to="{
                path: '/contact',
                query: {
                  subject: service.businessUnitId === 2 ? '储能集成' : '带电清洗',
                  ref: service.title,
                },
              }"
              class="nav-contact"
            >
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
        <div class="container-page">
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
import DOMPurify from "dompurify"

const route = useRoute()
const serviceId = computed(() => Number(route.params.id))

// 服务详情走 SSR：详情页是搜索引擎最该收录的页面，不能等浏览器端再加载
const { data: serviceRes } = await useFetch(
  computed(() => `/api/services/${serviceId.value}`),
  { transform: (res: any) => (res?.success ? res.data : null) }
)
const service = computed<any>(() => serviceRes.value || {})
// 数据不存在时返回真实 404（避免无效 ID 被搜索引擎当成有效页收录）
if (!service.value || !(service.value as any).id) {
  throw createError({ statusCode: 404, statusMessage: '服务不存在或已下架' })
}


// 接口可能把数组字段以 JSON 字符串返回，统一解析
const toList = (raw: any): any[] => {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  try {
    const parsed = JSON.parse(String(raw))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const advantages = computed<any[]>(() => toList(service.value.advantages))
const relatedProducts = computed<any[]>(() => toList(service.value.relatedProducts))
const relatedCases = computed<any[]>(() => toList(service.value.relatedCases))

// XSS 防护：DOMPurify 依赖浏览器环境，SSR 阶段输出原文，客户端再净化
const sanitizedContent = computed(() => {
  const raw = service.value?.content || service.value?.description || ''
  if (import.meta.server) return raw
  return DOMPurify.sanitize(raw)
})

// SEO
const SITE_ORIGIN = 'https://ximingpower.com'

// 结构化数据：Service + BreadcrumbList（与产品页同模式）
const serviceJsonLd = computed(() => {
  if (!service.value?.id) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.value.title,
    description: service.value.description || service.value.title,
    url: `${SITE_ORIGIN}/services/${service.value.id}`,
    serviceType: service.value.businessunit?.name || service.value.title,
    areaServed: { '@type': 'Country', name: 'CN' },
    provider: {
      '@type': 'Organization',
      name: '河南玺铭电力科技有限公司',
      url: SITE_ORIGIN,
    },
  }
})

const breadcrumbJsonLd = computed(() => {
  if (!service.value?.id) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: SITE_ORIGIN + '/' },
      { '@type': 'ListItem', position: 2, name: '服务项目', item: SITE_ORIGIN + '/services' },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.value.title,
        item: `${SITE_ORIGIN}/services/${service.value.id}`,
      },
    ],
  }
})

useHead({
  title: computed(() => service.value?.id ? `${service.value.title} - 服务项目` : '服务详情'),
  meta: [
    {
      name: 'description',
      content: computed(() => service.value?.description || '玺铭电力专业服务')
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => (serviceJsonLd.value ? JSON.stringify(serviceJsonLd.value) : '')),
    },
    {
      type: 'application/ld+json',
      innerHTML: computed(() => (breadcrumbJsonLd.value ? JSON.stringify(breadcrumbJsonLd.value) : '')),
    },
  ] as any,
})
</script>

<style scoped>
/* 顶部横幅与面包屑样式已抽到 components/DetailBanner.vue，
   内容宽度统一由 main.css 的 .container-page 提供 */

/* 通用区块样式 */
.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
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
  color: #0f172a;
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
  color: #0f172a;
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
  color: #0f172a;
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
  color: #0f172a;
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
  color: #0f172a;
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
  color: #0f172a;
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
