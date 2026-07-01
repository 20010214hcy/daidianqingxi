<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-300">{{ error.statusCode }}</h1>
      <p class="text-xl text-gray-600 mt-4">{{ statusMessage }}</p>
      <NuxtLink to="/" class="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        返回首页
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; statusMessage?: string; message?: string } }>()

const statusMessage = computed(() => {
  return props.error.statusMessage || props.error.message || '页面出错了'
})
</script>
