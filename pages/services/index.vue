<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="服务项目" subtitle="专业的工业清洗解决方案" />

    <!-- 二级导航：业务板块切换 -->
    <UnitSwitcher v-model="activeUnit" />

    <!-- Services Grid -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 骨架屏 -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="n in 4" :key="'skel-'+n" class="border border-slate-200 rounded-2xl overflow-hidden">
            <div class="aspect-[16/9] bg-slate-200 animate-pulse" />
            <div class="p-6 space-y-3">
              <div class="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
              <div class="h-4 w-full bg-slate-200 rounded animate-pulse" />
              <div class="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="services.length === 0" class="text-center py-20">
          <div class="text-6xl mb-4">🔧</div>
          <p class="text-xl text-slate-500">该业务板块暂无服务项目</p>
          <button
            type="button"
            class="mt-6 inline-flex items-center px-6 py-2.5 rounded-full border border-blue-200 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
            @click="switchToOtherUnit"
          >
            查看{{ otherUnitLabel }}服务
          </button>
        </div>

        <!-- 真实数据 -->
        <div
          v-else
          ref="gridRef"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <div
            v-for="service in services"
            :key="service.id"
            class="service-card group border border-slate-200 rounded-2xl overflow-hidden stagger-reveal-item"
          >
            <!-- Card Image -->
            <div class="service-image-wrapper overflow-hidden">
              <img 
                v-if="service.coverImage"
                :src="service.coverImage" 
                :alt="service.title"
                class="service-image"
              />
              <div v-else class="service-image bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center">
                <span class="text-6xl">⚡</span>
              </div>
              <div class="service-overlay"></div>
            </div>
            
            <!-- Card Content -->
            <div class="service-content p-6 bg-white">
              <h3 class="text-xl font-bold text-slate-800 mb-3 line-clamp-2">{{ service.title }}</h3>
              <p class="text-slate-600 mb-4 line-clamp-3">{{ service.description }}</p>
              <NuxtLink :to="`/services/${service.id}`" class="text-primary-600 font-medium hover:text-primary-700 transition-colors inline-flex items-center">
                了解详情
                <svg class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-slate-800 mb-4">需要定制化服务？</h2>
        <p class="text-lg text-slate-600 mb-8">
          我们可以根据您的具体需求，提供量身定制的清洗解决方案
        </p>
        <NuxtLink to="/contact" class="btn-primary">
          联系我们
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '~/types'

definePageMeta({
  layout: 'default'
})

useHead({
  title: "电力设备带电清洗与储能服务项目",
  meta: [
    { name: 'description', content: "玺铭电力服务项目，提供电力设备带电清洗、储能系统集成、化学清洗、工业设备维护等专业清洗解决方案。" },
    { property: 'og:title', content: '电力设备带电清洗与储能服务项目 - 河南玺铭电力科技有限公司' },
    { property: 'og:description', content: '电力设备带电清洗、化学清洗、工业设备维护等专业清洗解决方案。' },
    { name: 'keywords', content: "带电清洗服务,化学清洗,工业设备维护,电力设备清洗,高压清洗,清洗解决方案,储能系统集成,储能设备安装,储能运维服务" },
  ]
})

// 业务板块切换（与产品/案例/方案页共用 UnitSwitcher）
const route = useRoute()
const router = useRouter()
const activeUnit = ref((route.query.unit as string) || 'daidianqingxi')

watch(activeUnit, (val) => {
  router.replace({ query: { unit: val } })
})

// 空状态：一键切到另一业务板块
const otherUnitLabel = computed(() => (activeUnit.value === 'daidianqingxi' ? '储能' : '带电清洗'))
const switchToOtherUnit = () => {
  activeUnit.value = activeUnit.value === 'daidianqingxi' ? 'chuneng' : 'daidianqingxi'
}

// SSR 数据获取
const { data: servicesData, pending: loading } = useFetch('/api/services', {
  query: computed(() => ({ businessUnit: activeUnit.value })),
  transform: (res: any) => res?.success ? (res.data || []) : []
})
const services = computed<Service[]>(() => servicesData.value || [])

const gridRef = ref<HTMLElement | null>(null)

const { refresh: refreshStagger } = useStaggerReveal(gridRef, { delay: 100 })

// 客户端加载完成后触发 stagger 动画
onMounted(() => {
  watch(services, () => {
    nextTick(() => refreshStagger())
  }, { immediate: true })
})
</script>

<style scoped>
.service-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #c7d2fe;
}

.service-image-wrapper {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.service-card:hover .service-image {
  transform: scale(1.1);
}

.service-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.service-card:hover .service-overlay {
  opacity: 1;
}

.service-content {
  transition: all 0.3s ease;
}

.service-card:hover .service-content {
  background-color: #fafbff;
}

@media (max-width: 768px) {
  .service-card {
    border-radius: 16px;
  }
}
@media (max-width: 640px) {
  section.py-20 {
    padding: 48px 0;
  }
  h2.text-3xl {
    font-size: 22px;
  }
  p.text-lg {
    font-size: 15px;
  }
  p.text-xl {
    font-size: 16px;
  }
  .service-content {
    padding: 20px;
  }
  .service-card h3 {
    font-size: 18px;
  }
}
@media (max-width: 480px) {
  h1.text-4xl {
    font-size: 28px;
  }
}
</style>
