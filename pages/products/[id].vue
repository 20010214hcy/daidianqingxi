<template>
  <div>
    <div class="reading-progress-bar" :style="{ transform: `scaleX(${readProgress})` }"></div>

    <!-- Page Header -->
    <section class="bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white pt-10 pb-4">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-4">
        <div class="flex items-center space-x-2 text-slate-300 mb-8">
          <NuxtLink to="/" class="hover:text-white transition-colors">首页</NuxtLink>
          <span>/</span>
          <NuxtLink to="/products" class="hover:text-white transition-colors">产品中心</NuxtLink>
          <span>/</span>
          <span class="text-white">{{ product.name || '...' }}</span>
        </div>
        <div v-if="product.id" class="flex items-center space-x-4 mb-4">
          <span v-if="product.category" class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
            {{ product.category.name }}
          </span>
        </div>
        <h1 v-if="product.id" class="text-3xl md:text-4xl font-bold mb-4">{{ product.name }}</h1>
        <div v-else class="text-center"><div class="animate-pulse">加载中...</div></div>
      </div>
    </section>

    <!-- Product Content -->
    <section v-if="product.id" class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 产品主图 -->
        <div v-if="product.image" class="mb-12">
          <img :src="product.image" :alt="product.name" class="w-full rounded-lg shadow-lg" />
        </div>

        <!-- 产品信息 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="md:col-span-2">
            <h2 class="text-2xl font-bold text-slate-800 mb-4">产品介绍</h2>
            <p class="text-slate-600 leading-relaxed text-lg">{{ product.description || '暂无详细介绍' }}</p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-800 mb-4">产品信息</h3>
            <div class="space-y-3">
              <div v-if="product.category" class="flex justify-between">
                <span class="text-slate-500">分类</span>
                <span class="font-medium text-slate-800">{{ product.category.name }}</span>
              </div>
              <div v-if="showPrice" class="flex justify-between">
                <span class="text-slate-500">价格</span>
                <span class="font-bold text-red-600 text-xl">¥{{ formatPrice(product.price) }}</span>
              </div>
            </div>
            <NuxtLink to="/contact" class="mt-6 w-full btn-primary text-center block">
              立即咨询
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({ layout: 'default' })

const route = useRoute()
const productId = Number(route.params.id)
const { readProgress } = useReadingProgress()

// SSR 数据获取
const { data: productData } = useFetch(`/api/products/${productId}`, {
  transform: (res: any) => res?.success ? res.data : {} as Product
})
const product = computed<Product>(() => productData.value || {} as Product)

const { data: priceData } = useFetch('/api/price-visibility', {
  transform: (res: any) => res?.success && res.data ? res.data.visible : false
})
const showPrice = computed(() => priceData.value === true)

const formatPrice = (price: number) => {
  return Number(price).toFixed(2)
}

useHead({
  title: computed(() => product.value.name ? `${product.value.name} - 产品中心 - 玺铭电力` : '产品详情 - 玺铭电力'),
  meta: [
    { name: 'description', content: computed(() => product.value.description || product.value.name || '玺铭电力产品详情') },
  ]
})
</script>
