<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="服务案例" subtitle="查看我们成功完成的项目案例" />

    <!-- 二级导航 -->
    <section class="py-4 bg-white border-b border-slate-200 sticky top-20 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UnitTabs v-model="activeUnit" />
      </div>
    </section>

    <!-- Cases List -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="cases.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400">
          <svg class="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <p class="text-lg">暂无案例</p>
          <p class="text-sm mt-1">成功案例即将上线</p>
        </div>

        <div v-else ref="gridRef" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink v-for="caseItem in cases" :key="caseItem.id" :to="`/cases/${caseItem.id}`" class="card overflow-hidden group block stagger-reveal-item">
            <div class="h-56 relative overflow-hidden">
              <img v-if="caseItem.coverImage"
                :src="caseItem.coverImage"
                :alt="caseItem.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                <span class="text-7xl text-primary-700">🏭</span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">
                {{ caseItem.title }}
              </h3>
              <p class="text-slate-600 mb-4 line-clamp-2">{{ caseItem.description }}</p>
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center text-slate-500">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  </svg>
                  {{ caseItem.location }}
                </div>
                <div class="text-slate-500">
                  {{ formatDate(caseItem.endDate || caseItem.createdAt) }}
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: "服务案例",
  meta: [
    { name: 'description', content: '查看玺铭电力成功完成的项目案例，涵盖带电清洗、储能系统等各类场景。' },
    { property: 'og:title", content: "服务案例 - 河南玺铭电力科技有限公司' },
    { property: 'og:description', content: '带电清洗、储能系统等各类项目成功案例。' },
    { name: 'keywords', content: '带电清洗案例,电力清洗项目,储能系统案例,工业清洗工程,变电站清洗,成功案例' },
  ]
})

import type { Case } from '~/types'

const { formatDate } = useFormatDate()
const route = useRoute()
const router = useRouter()

// 业务板块切换
const activeUnit = ref(route.query.unit as string || 'daidianqingxi')

watch(activeUnit, (val) => {
  router.replace({ query: { unit: val } })
})

// SSR 数据获取
const { data: casesData, pending: loading } = useFetch('/api/cases', {
  query: computed(() => ({ businessUnit: activeUnit.value })),
  transform: (res: any) => res?.success ? (res.data?.list || res.data || []) : []
})
const cases = computed<Case[]>(() => casesData.value || [])

const gridRef = ref<HTMLElement | null>(null)

const { refresh: refreshStagger } = useStaggerReveal(gridRef, { delay: 100 })

// 客户端加载完成后触发 stagger 动画
onMounted(() => {
  watch(cases, (newVal) => {
    if (newVal && newVal.length > 0) {
      nextTick(() => refreshStagger())
    }
  }, { immediate: true })
})
</script>

<style scoped>
.card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}
@media (max-width: 768px) {
  .card .h-56 {
    height: 200px;
  }
  .card h3 {
    font-size: 18px;
  }
  .card p {
    font-size: 14px;
  }
}
@media (max-width: 640px) {
  section.py-20 {
    padding: 48px 0;
  }
  h1.text-4xl {
    font-size: 28px;
  }
  p.text-xl {
    font-size: 16px;
  }
  .card .p-6 {
    padding: 20px;
  }
}
@media (max-width: 480px) {
  .card .h-56 {
    height: 180px;
  }
  .card h3 {
    font-size: 16px;
  }
}
</style>
