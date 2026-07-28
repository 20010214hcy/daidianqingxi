<template>
  <div>
    <!-- Hero Section -->
    <LazyHomeHeroSection />

    <!-- 关于我们 -->
    <LazyHomeAboutSection />

    <!-- 服务展示 -->
    <LazyHomeServicesShowcase :services="services" />

    <!-- 精选案例 -->
    <LazyHomeCasesSection :featured-cases="featuredCases" />

    <!-- 最新新闻 -->
    <LazyHomeNewsSection :latest-news="latestNews" />

    <!-- 资质荣誉 -->
    <LazyHomeCertificatesMarquee :certificates="certificates" />
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
    { name: 'description', content: '玺铭电力设备清洗有限公司，专业提供电力设备带电清洗、工业设备清洗、化学清洗、储能系统集成等服务。20年行业经验，服务覆盖全国，安全高效值得信赖。' },
    { property: 'og:title", content: "河南玺铭电力科技有限公司 - 带电清洗与储能系统集成解决方案' },
    { property: 'og:description', content: '玺铭电力设备清洗有限公司，专业提供电力设备带电清洗、工业设备清洗、化学清洗等服务。' },
    { property: 'og:type', content: 'website' },
    { name: 'keywords', content: '带电清洗,电力设备清洗,工业清洗,高压清洗,玺铭电力,带电清洗公司,电力设备维护,储能系统,储能设备,储能集成服务' },
  ]
})

// SSR 数据获取
const { data: servicesData } = useFetch('/api/services', {
  transform: (res: any) => res?.success ? (res.data || []) : []
})
const { data: casesData } = useFetch('/api/cases', {
  params: { page: 1, pageSize: 3 },
  transform: (res: any) => res?.success ? (res.data?.list || res.data || []) : []
})
const { data: newsData } = useFetch('/api/articles', {
  params: { page: 1, pageSize: 4 },
  transform: (res: any) => res?.success ? (res.data?.list || []) : []
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
/* 导入首页专用高级样式 */
@import '~/assets/css/homepage-premium.css';
</style>
