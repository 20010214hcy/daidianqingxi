<template>
  <div>
    <!-- Hero：双业务入口 -->
    <LazyHomeHeroSection />

    <!-- 信任条 -->
    <LazyHomeTrustBar :cert-count="certificates.length" />

    <!-- 两大业务 -->
    <LazyHomeBusinessPillars :services="services" />

    <!-- 精选案例 -->
    <LazyHomeCasesSection :featured-cases="featuredCases" />

    <!-- 服务流程 -->
    <LazyHomeProcessSection />

    <!-- 资质荣誉 -->
    <LazyHomeCertificatesMarquee :certificates="certificates" />

    <!-- 新闻 -->
    <LazyHomeNewsSection :latest-news="latestNews" />

    <!-- 底部转化：预约勘查 -->
    <LazyHomeBottomCta />
  </div>
</template>

<script setup lang="ts">
import type { Service, Case, Article } from '~/types'

definePageMeta({
  layout: 'default'
})

useHead({
  title: "带电清洗与储能系统集成解决方案",
  meta: [
    { name: 'description', content: '玺铭电力专业提供电力设备带电清洗、工业清洗、储能系统集成等服务。20年行业经验，服务覆盖全国，安全高效值得信赖。' },
    { property: 'og:title', content: '河南玺铭电力科技有限公司 - 带电清洗与储能系统集成解决方案' },
    { property: 'og:description', content: '玺铭电力专业提供带电清洗、储能系统集成等服务。' },
    { property: 'og:type', content: 'website' },
    { name: 'keywords', content: '带电清洗,电力设备清洗,工业清洗,高压清洗,玺铭电力,储能系统,储能集成,工商业储能' },
  ]
})

const { data: servicesData } = useFetch('/api/services', {
  transform: (res: any) => res?.success ? (res.data || []) : []
})
const { data: casesData } = useFetch('/api/cases', {
  params: { page: 1, pageSize: 3 },
  transform: (res: any) => res?.success ? (res.data?.list || res.data || []) : []
})
const { data: newsData } = useFetch('/api/articles', {
  params: { page: 1, pageSize: 5, status: 'published' },
  transform: (res: any) => res?.success ? (res.data?.list || []) : [],
  // 新闻需及时反映后台发布：不自定义 getCachedData，走 Nuxt 默认（hydration 用 payload、客户端导航自动重取）
})
const { data: certificatesData } = useFetch('/api/certificates', {
  transform: (res: any) => res?.success ? (res.data || []) : []
})

const services = computed(() => servicesData.value || [])
const featuredCases = computed(() => casesData.value || [])
const latestNews = computed(() => newsData.value || [])
const certificates = computed(() => certificatesData.value || [])
</script>

<style>
@import '~/assets/css/homepage-premium.css';
</style>
