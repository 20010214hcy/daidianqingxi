<template>
  <div>
    <div class="reading-progress-bar" :style="{ transform: `scaleX(${readProgress})` }"></div>

    <!-- Page Header -->
    <section class="bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white pt-10 pb-4">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-4">
        <div class="flex items-center space-x-2 text-slate-300 mb-8">
          <NuxtLink to="/" class="hover:text-white transition-colors">首页</NuxtLink>
          <span>/</span>
          <NuxtLink to="/cases" class="hover:text-white transition-colors">工程案例</NuxtLink>
          <span>/</span>
          <span class="text-white">{{ caseItem.title || '...' }}</span>
        </div>
        <div v-if="caseItem.id" class="flex items-center space-x-4 mb-4">
          <span v-if="caseItem.location" class="text-slate-300 text-sm flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {{ caseItem.location }}
          </span>
          <span v-if="caseItem.clientName" class="text-slate-300 text-sm">客户：{{ caseItem.clientName }}</span>
        </div>
        <h1 v-if="caseItem.id" class="text-3xl md:text-4xl font-bold mb-4">{{ caseItem.title }}</h1>
        <div v-else class="text-center"><div class="animate-pulse">加载中...</div></div>
      </div>
    </section>

    <!-- Case Content -->
    <section v-if="caseItem.id" class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 封面图 -->
        <div v-if="caseItem.coverImage" class="mb-12">
          <img :src="caseItem.coverImage" :alt="caseItem.title" class="w-full rounded-lg shadow-lg" />
        </div>

        <!-- 项目信息 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="md:col-span-2">
            <h2 class="text-2xl font-bold text-slate-800 mb-4">项目介绍</h2>
            <p class="text-slate-600 leading-relaxed text-lg">{{ caseItem.description || '暂无介绍' }}</p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-800 mb-4">项目信息</h3>
            <div class="space-y-3">
              <div v-if="caseItem.clientName" class="flex justify-between">
                <span class="text-slate-500">客户</span>
                <span class="font-medium text-slate-800">{{ caseItem.clientName }}</span>
              </div>
              <div v-if="caseItem.location" class="flex justify-between">
                <span class="text-slate-500">地点</span>
                <span class="font-medium text-slate-800">{{ caseItem.location }}</span>
              </div>
              <div v-if="caseItem.startDate" class="flex justify-between">
                <span class="text-slate-500">开始时间</span>
                <span class="font-medium text-slate-800">{{ formatDate(caseItem.startDate) }}</span>
              </div>
              <div v-if="caseItem.endDate" class="flex justify-between">
                <span class="text-slate-500">完成时间</span>
                <span class="font-medium text-slate-800">{{ formatDate(caseItem.endDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目图片 -->
        <div v-if="caseItem.images && caseItem.images.length" class="mb-12">
          <h2 class="text-2xl font-bold text-slate-800 mb-6">项目实拍</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <img v-for="(img, i) in caseItem.images" :key="i" :src="img" :alt="`${caseItem.title} - 图${i+1}`"
              class="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300" />
          </div>
        </div>

        <!-- 富文本内容 -->
        <div v-if="caseItem.content" class="tiptap-content" v-html="sanitizedContent"></div>

        <!-- CTA -->
        <div class="mt-12 text-center">
          <NuxtLink to="/contact" class="btn-primary text-lg px-10 py-4">
            咨询类似项目
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

import DOMPurify from "dompurify"

definePageMeta({ layout: 'default' })

const { formatDate } = useFormatDate()
const route = useRoute()
const caseId = Number(route.params.id)
const { readProgress } = useReadingProgress()

// SSR 数据获取
const { data: caseData } = useFetch(`/api/cases/${caseId}`, {
  transform: (res: any) => {
    if (!res?.success || !res.data) return {}
    const data = res.data
    // 解析 images 字段（可能是 JSON 字符串）
    if (data.images && typeof data.images === 'string') {
      try {
        data.images = JSON.parse(data.images)
      } catch {
        data.images = data.images ? [data.images] : []
      }
    }
    return data
  }
})
const caseItem = computed(() => caseData.value || {})

const sanitizedContent = computed(() => {
  if (process.server) return caseItem.value.content || ""
  return DOMPurify.sanitize(caseItem.value.content || '')
})

useHead({
  title: computed(() => caseItem.value.title ? `${caseItem.value.title} - 工程案例 - 玺铭电力` : '案例详情 - 玺铭电力'),
  meta: [
    { name: 'description', content: computed(() => caseItem.value.description || caseItem.value.title || '玺铭电力工程案例详情') },
  ]
})
</script>
