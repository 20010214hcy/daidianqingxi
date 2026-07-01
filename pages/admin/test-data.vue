<template>
  <div class="admin-page-container">
    <h1>数据测试页面</h1>
    
    <el-card class="mb-4">
      <h3>案例数据</h3>
      <p>加载状态: {{ casesLoading }}</p>
      <p>数据数量: {{ cases.length }}</p>
      <pre>{{ JSON.stringify(cases, null, 2) }}</pre>
    </el-card>
    
    <el-card>
      <h3>服务数据</h3>
      <p>加载状态: {{ servicesLoading }}</p>
      <p>数据数量: {{ services.length }}</p>
      <pre>{{ JSON.stringify(services, null, 2) }}</pre>
    </el-card>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const cases = ref([])
const casesLoading = ref(true)
const services = ref([])
const servicesLoading = ref(true)

onMounted(async () => {
  try {
    const casesRes = await ('/api/cases?status=all')
    cases.value = casesRes?.data?.list || casesRes?.data || []
    console.log('案例数据:', cases.value)
  } catch (e) {
    console.error('获取案例失败:', e)
  } finally {
    casesLoading.value = false
  }
  
  try {
    const servicesRes = await ('/api/services?status=all')
    services.value = servicesRes?.data || []
    console.log('服务数据:', services.value)
  } catch (e) {
    console.error('获取服务失败:', e)
  } finally {
    servicesLoading.value = false
  }
})
</script>
