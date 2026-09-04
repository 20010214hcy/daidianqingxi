<template>
  <div class="solution-detail-page">
    <!-- 顶部横幅 -->
    <section class="sub-banner">
      <div class="banner-bg">
        <img           :src="solution?.detailImage || '/uploads/default-banner.jpg'"
          :alt="solution?.title"
          class="banner-img"
        />
        <div class="banner-overlay"></div>
      </div>
      <div class="banner-content">
        <div class="container">
          <!-- 面包屑导航 -->
          <div class="site">
            <NuxtLink to="/" class="home">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </NuxtLink>
            <span class="sep">/</span>
            <NuxtLink to="/solutions">技术方案</NuxtLink>
            <span class="sep">/</span>
            <span class="current">{{ solution?.title || '加载中...' }}</span>
          </div>
          <!-- 标题 -->
          <h4>{{ solution?.title || '加载中...' }}</h4>
        </div>
      </div>
    </section>

    <!-- 加载状态 -->
    <template v-if="loading">
      <section class="loading-section">
        <div class="container">
          <div class="loading-skeleton">
            <div class="skeleton-title"></div>
            <div class="skeleton-block"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
          </div>
        </div>
      </section>
    </template>

    <!-- 内容区域 -->
    <template v-else-if="solution">
      <!-- 项目概述 -->
      <section class="view-box">
        <div class="container">
          <div class="com-title">项目概述</div>
          <!-- 视频/图片 -->
          <div v-if="solution.videoUrl || solution.detailImage" class="video">
            <video
              v-if="solution.videoUrl"
              :src="solution.videoUrl"
              controls
              autoplay
              muted
              loop
              style="width: 100%;"
            ></video>
            <img               v-else
              :src="solution.detailImage"
              :alt="solution.title"
              style="width: 100%;"
            />
          </div>
          <!-- 文字描述 -->
          <div class="main">
            <div class="name">{{ solution.title }}</div>
            <div class="content" v-html="solution.content || solution.description"></div>
          </div>
        </div>
      </section>

      <!-- 方案优势 -->
      <section v-if="advantages && advantages.length > 0" class="adv-box" id="adv">
        <div class="container">
          <div class="com-title">方案优势</div>
          <div class="adv-list">
            <div v-for="(adv, index) in advantages" :key="index" class="item">
              <div class="img">
                <span v-if="adv.icon" class="text-2xl">{{ adv.icon }}</span>
                <svg v-else viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" stroke="#2563eb" stroke-width="2"/>
                  <path d="M16 24l6 6 10-10" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="name">{{ adv.title }}</div>
              <div class="txt">
                <p>{{ adv.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 技术特点 -->
      <section v-if="features && features.length > 0" class="feat-box">
        <div class="container">
          <div class="com-title">技术特点</div>
          <div class="feat-list">
            <div v-for="(feat, index) in features" :key="index" class="feat-item">
              <div class="feat-num">{{ String(index + 1).padStart(2, '0') }}</div>
              <div class="feat-content">
                <h4>{{ feat.title }}</h4>
                <p>{{ feat.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 技术参数 -->
      <section v-if="solution.specs && solution.specs.length > 0" class="spec-box">
        <div class="container">
          <div class="com-title">技术参数</div>
          <div class="spec-table">
            <table>
              <thead>
                <tr>
                  <th>参数名称</th>
                  <th>参数值</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(spec, index) in solution.specs" :key="index">
                  <td>{{ spec.label }}</td>
                  <td>{{ spec.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 推荐产品 -->
      <section v-if="relatedProducts && relatedProducts.length > 0" class="pro-box" id="pro">
        <div class="container">
          <div class="com-title">推荐产品</div>
          <div class="swiper-pro swiper-container">
            <div class="swiper-wrapper">
              <div v-for="product in relatedProducts" :key="product.id" class="swiper-slide">
                <NuxtLink :to="`/products/${product.id}`">
                  <div class="img">
                    <img :src="product.image || product.coverImage" :alt="product.name"  loading="lazy" />
                  </div>
                  <div class="main">
                    <div class="title">{{ product.name }}</div>
                    <div class="txt">{{ product.description }}</div>
                    <div class="read-more">查看更多</div>
                  </div>
                </NuxtLink>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
        </div>
      </section>

      <!-- 参考案例 -->
      <section v-if="relatedCases && relatedCases.length > 0" class="ref-box">
        <div class="container">
          <div class="com-title">成功案例</div>
          <div class="swiper-case">
            <div class="swiper-container">
              <div class="swiper-wrapper">
                <div v-for="caseItem in relatedCases" :key="caseItem.id" class="swiper-slide">
                  <NuxtLink :to="`/cases/${caseItem.id}`">
                    <div class="pic">
                      <div class="imgBg" :style="{ backgroundImage: `url(${caseItem.coverImage})` }"></div>
                    </div>
                    <div class="name">{{ caseItem.title }}</div>
                    <div v-if="caseItem.specs" class="data">{{ caseItem.specs }}</div>
                  </NuxtLink>
                </div>
              </div>
            </div>
            <div class="swiper-button-prev"><i></i></div>
            <div class="swiper-button-next"><i></i></div>
          </div>
        </div>
      </section>

      <!-- 咨询区域 -->
      <section class="cta-box">
        <div class="container">
          <div class="cta-content">
            <h3>需要专业的技术方案？</h3>
            <p>我们的技术团队将为您提供定制化的解决方案</p>
            <div class="cta-btns">
              <NuxtLink to="/contact" class="btn-primary">立即咨询</NuxtLink>
              <a href="tel:400-888-8888" class="btn-secondary">电话咨询</a>
            </div>
          </div>
        </div>
      </section>

      <!-- 底部导航 -->
      <section class="nav-box">
        <div class="container">
          <NuxtLink to="/solutions" class="nav-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回技术方案
          </NuxtLink>
        </div>
      </section>
    </template>

    <!-- 错误状态 -->
    <template v-else>
      <section class="error-box">
        <div class="container">
          <div class="error-content">
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="32" cy="32" r="28"/>
              <path d="M20 20l24 24M44 20L20 44"/>
            </svg>
            <h2>方案未找到</h2>
            <p>您访问的技术方案页面不存在或已被删除</p>
            <NuxtLink to="/solutions" class="back-btn">返回技术方案</NuxtLink>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const solutionId = route.params.id

const loading = ref(true)
const solution = ref(null)
const advantages = ref([])
const features = ref([])
const relatedProducts = ref([])
const relatedCases = ref([])

const fetchSolutionDetail = async () => {
  loading.value = true
  try {
    const response = await $fetch(`/api/services/${solutionId}`)
    if (response.success && response.data) {
      solution.value = response.data

      if (response.data.advantages) {
        try {
          advantages.value = typeof response.data.advantages === 'string'
            ? JSON.parse(response.data.advantages)
            : response.data.advantages
        } catch { advantages.value = [] }
      }

      if (response.data.features) {
        try {
          features.value = typeof response.data.features === 'string'
            ? JSON.parse(response.data.features)
            : response.data.features
        } catch { features.value = [] }
      }

      if (response.data.relatedProducts) {
        relatedProducts.value = response.data.relatedProducts
      }

      if (response.data.relatedCases) {
        relatedCases.value = response.data.relatedCases
      }
    }
  } catch (error) {
    console.error('获取技术方案详情失败:', error)
  } finally {
    loading.value = false
  }
}

useHead({
  title: computed(() => solution.value ? `${solution.value.title} - 技术方案 - 玺铭电力` : '技术方案 - 玺铭电力'),
  meta: [
    { name: 'description', content: computed(() => solution.value?.description || '玺铭电力专业技术方案') }
  ]
})

onMounted(() => {
  fetchSolutionDetail()
})
</script>

<style scoped>
/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 通用标题 */
.com-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  text-align: center;
  margin-bottom: 48px;
  position: relative;
}

.com-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  margin: 16px auto 0;
}

/* 顶部横幅 */
.sub-banner {
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

.banner-img {
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
    135deg,
    rgba(10, 22, 40, 0.92) 0%,
    rgba(15, 40, 71, 0.88) 50%,
    rgba(13, 59, 102, 0.85) 100%
  );
}

.banner-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 50px;
}

.site {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.site a,
.site span {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s;
}

.site a:hover {
  color: white;
}

.site .home svg {
  width: 16px;
  height: 16px;
}

.site .sep {
  color: rgba(255, 255, 255, 0.4);
}

.site .current {
  color: white;
}

.banner-content h4 {
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
  margin: 0 auto;
}

.skeleton-title {
  height: 36px;
  width: 200px;
  background: #e2e8f0;
  border-radius: 4px;
  margin: 0 auto 40px;
  animation: pulse 1.5s infinite;
}

.skeleton-block {
  height: 300px;
  background: #e2e8f0;
  border-radius: 8px;
  margin-bottom: 30px;
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

/* 项目概述 */
.view-box {
  padding: 80px 0;
  background: white;
}

.view-box .video {
  margin-bottom: 40px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.view-box .video img,
.view-box .video video {
  display: block;
  width: 100%;
}

.view-box .main {
  max-width: 900px;
  margin: 0 auto;
}

.view-box .name {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 20px;
}

.view-box .content {
  font-size: 16px;
  line-height: 1.8;
  color: #4a5568;
}

.view-box .content :deep(p) {
  margin-bottom: 16px;
}

/* 方案优势 */
.adv-box {
  padding: 80px 0;
  background: #f8fafc;
}

.adv-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.adv-list .item {
  background: white;
  padding: 32px 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.adv-list .item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.adv-list .img {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 16px;
}

.adv-list .img img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.adv-list .img svg {
  width: 40px;
  height: 40px;
}

.adv-list .name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.adv-list .txt {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
}

/* 技术特点 */
.feat-box {
  padding: 80px 0;
  background: white;
}

.feat-list {
  max-width: 900px;
  margin: 0 auto;
}

.feat-item {
  display: flex;
  gap: 28px;
  padding: 28px 0;
  border-bottom: 1px solid #e2e8f0;
}

.feat-item:last-child {
  border-bottom: none;
}

.feat-num {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: #2563eb;
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
  border-radius: 14px;
}

.feat-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 10px;
}

.feat-content p {
  font-size: 15px;
  color: #64748b;
  line-height: 1.7;
}

/* 技术参数 */
.spec-box {
  padding: 80px 0;
  background: #f8fafc;
}

.spec-table {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.spec-table table {
  width: 100%;
  border-collapse: collapse;
}

.spec-table thead {
  background: linear-gradient(135deg, #1e40af, #2563eb);
}

.spec-table th {
  padding: 16px 24px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  text-align: left;
}

.spec-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
}

.spec-table tbody tr:last-child {
  border-bottom: none;
}

.spec-table tbody tr:hover {
  background: #f8fafc;
}

.spec-table td {
  padding: 16px 24px;
  font-size: 15px;
  color: #4a5568;
}

.spec-table td:first-child {
  font-weight: 500;
  color: #1a1a2e;
  width: 200px;
}

/* 推荐产品 */
.pro-box {
  padding: 80px 0;
  background: white;
}

.swiper-pro {
  overflow: hidden;
}

.swiper-pro .swiper-slide {
  width: 300px;
}

.swiper-pro .swiper-slide a {
  display: block;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  text-decoration: none;
  transition: all 0.3s;
}

.swiper-pro .swiper-slide a:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.swiper-pro .img {
  height: 200px;
  overflow: hidden;
}

.swiper-pro .img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.swiper-pro .swiper-slide a:hover .img img {
  transform: scale(1.05);
}

.swiper-pro .main {
  padding: 20px;
}

.swiper-pro .title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 10px;
}

.swiper-pro .txt {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.swiper-pro .read-more {
  font-size: 14px;
  color: #2563eb;
  font-weight: 500;
}

.swiper-pro .swiper-pagination {
  margin-top: 30px;
}

/* 参考案例 */
.ref-box {
  padding: 80px 0;
  background: #f8fafc;
}

.swiper-case {
  position: relative;
  overflow: hidden;
}

.swiper-case .swiper-slide {
  width: calc(33.333% - 20px);
  margin-right: 30px;
}

.swiper-case .swiper-slide a {
  display: block;
  text-decoration: none;
  color: inherit;
}

.swiper-case .pic {
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.swiper-case .imgBg {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s;
}

.swiper-case .swiper-slide:hover .imgBg {
  transform: scale(1.05);
}

.swiper-case .name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.swiper-case .data {
  font-size: 14px;
  color: #2563eb;
  font-weight: 500;
}

.swiper-case .swiper-button-prev,
.swiper-case .swiper-button-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
}

.swiper-case .swiper-button-prev:hover,
.swiper-case .swiper-button-next:hover {
  background: #2563eb;
  color: white;
}

.swiper-case .swiper-button-prev {
  left: -22px;
}

.swiper-case .swiper-button-next {
  right: -22px;
}

.swiper-case .swiper-button-prev i,
.swiper-case .swiper-button-next i {
  display: block;
  width: 10px;
  height: 10px;
  border-top: 2px solid currentColor;
  border-right: 2px solid currentColor;
}

.swiper-case .swiper-button-prev i {
  transform: rotate(-135deg);
  margin-left: 4px;
}

.swiper-case .swiper-button-next i {
  transform: rotate(45deg);
  margin-right: 4px;
}

/* 咨询区域 */
.cta-box {
  padding: 80px 0;
  background: linear-gradient(135deg, #0f4c81 0%, #1a73e8 100%);
}

.cta-content {
  text-align: center;
}

.cta-content h3 {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}

.cta-content p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 36px;
}

.cta-btns {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 14px 36px;
  font-size: 16px;
  font-weight: 600;
  color: #1a73e8;
  background: white;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 14px 36px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.6);
}

/* 底部导航 */
.nav-box {
  padding: 40px 0;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.nav-back {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-back:hover {
  color: #2563eb;
  transform: translateX(-4px);
}

.nav-back svg {
  width: 18px;
  height: 18px;
}

/* 错误状态 */
.error-box {
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
  .adv-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .swiper-case .swiper-slide {
    width: calc(50% - 15px);
    margin-right: 30px;
  }
}

@media (max-width: 768px) {
  .sub-banner {
    height: 300px;
  }

  .banner-content h4 {
    font-size: 28px;
  }

  .com-title {
    font-size: 24px;
    margin-bottom: 32px;
  }

  .view-box,
  .adv-box,
  .feat-box,
  .spec-box,
  .pro-box,
  .ref-box,
  .cta-box {
    padding: 50px 0;
  }

  .adv-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .feat-item {
    flex-direction: column;
    gap: 16px;
  }

  .swiper-case .swiper-slide {
    width: calc(100% - 15px);
  }

  .cta-content h3 {
    font-size: 24px;
  }

  .cta-btns {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .sub-banner {
    height: 250px;
  }

  .banner-content h4 {
    font-size: 24px;
  }

  .swiper-pro .swiper-slide {
    width: 260px;
  }
}
</style>
