<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const siteName = ref('带电清洗')
const siteIcon = ref('')

const loadSiteSetting = async () => {
  try {
    const response = await $fetch('/api/settings')
    if (response.success && response.data) {
      siteName.value = response.data.siteName || '带电清洗'
      siteIcon.value = response.data.siteIcon || ''
    }
  } catch (error) {
    console.error('加载网站设置失败', error)
  }
}

useHead({
  titleTemplate: "河南玺铭电力科技有限公司 - %s",
  title: "带电清洗与储能系统集成解决方案",
  link: computed(() => {
    const links: any[] = []
    if (siteIcon.value) {
      links.push(
        { rel: 'icon', type: 'image/png', href: siteIcon.value },
        { rel: 'shortcut icon', type: 'image/x-icon', href: siteIcon.value }
      )
    }
    return links
  })
})

onMounted(() => {
  loadSiteSetting()
})
</script>
