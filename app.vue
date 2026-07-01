<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const siteName = ref('带电清洗')

const loadSiteSetting = async () => {
  try {
    const response = await $fetch('/api/settings')
    if (response.success && response.data) {
      siteName.value = response.data.siteName || '带电清洗'
    }
  } catch (error) {
    console.error('加载网站设置失败', error)
  }
}

useHead({
  titleTemplate: '%s - ' + siteName.value,
  title: computed(() => `${siteName.value} - 专业工业清洗服务`)
})

onMounted(() => {
  loadSiteSetting()
})
</script>
