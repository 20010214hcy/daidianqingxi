<template>
  <div>
    <div class="reading-progress-bar" :style="{ transform: `scaleX(${readProgress})` }"></div>

    <!-- Page Header -->
    <section class="bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white pt-10 pb-4">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-4">
        <div class="flex items-center space-x-2 text-slate-300 mb-8">
          <NuxtLink to="/" class="hover:text-white transition-colors">首页</NuxtLink>
          <span>/</span>
          <NuxtLink to="/services" class="hover:text-white transition-colors">服务项目</NuxtLink>
          <span>/</span>
          <span class="text-white">{{ service.title || '...' }}</span>
        </div>
        <h1 v-if="service.id" class="text-3xl md:text-4xl font-bold mb-4">{{ service.title }}</h1>
        <p v-if="service.description" class="text-lg text-slate-300 mb-4">{{ service.description }}</p>
        <div v-if="!service.id" class="text-center"><div class="animate-pulse">加载中...</div></div>
      </div>
    </section>

    <!-- Service Content -->
    <section v-if="service.id" class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="service.coverImage" class="mb-12">
          <img :src="service.coverImage" :alt="service.title" class="w-full rounded-lg shadow-lg" />
        </div>
        <div class="w-e-text-container" v-html="sanitizedContent"></div>

        <!-- 服务特点 -->
        <div v-if="service.price" class="mt-12 p-8 bg-slate-50 rounded-2xl">
          <h3 class="text-xl font-bold text-slate-800 mb-4">服务报价</h3>
          <p class="text-3xl font-bold text-primary-600">¥{{ service.price }}</p>
          <p class="text-sm text-slate-500 mt-2">* 具体价格根据项目规模和需求而定，请联系我们获取详细报价</p>
        </div>

        <!-- CTA -->
        <div class="mt-12 text-center">
          <NuxtLink to="/contact" class="btn-primary text-lg px-10 py-4">
            立即咨询
            <svg class="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css"
import DOMPurify from "dompurify"

definePageMeta({ layout: 'default' })

const route = useRoute()
const serviceId = Number(route.params.id)
const { readProgress } = useReadingProgress()

// SSR 数据获取
const { data: serviceData } = useFetch(`/api/services/${serviceId}`, {
  transform: (res: any) => res?.success ? res.data : {}
})
const service = computed(() => serviceData.value || {})

const sanitizedContent = computed(() => {
  if (process.server) return service.value.content || ""
  return DOMPurify.sanitize(service.value.content || '')
})

useHead({
  title: computed(() => service.value.title ? `${service.value.title} - 服务项目 - 玺铭电力` : '服务详情 - 玺铭电力'),
  meta: [
    { name: 'description', content: computed(() => service.value.description || service.value.title || '玺铭电力服务详情') },
  ]
})
</script>
