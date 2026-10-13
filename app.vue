<template>
  <div>
    <JsonLd :contact-info="contactData" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const siteName = ref('带电清洗')
const siteIcon = ref('')

// 站点规范域名（与非 www 的 sitemap / robots 保持一致）
const CANONICAL_ORIGIN = 'https://ximingpower.com'

// 联系方式：在根组件获取（SSR 会等待数据完成），传给 JsonLd 生成结构化数据。
// JsonLd 自身保持同步组件 —— 异步 setup 组件在 Suspense 边界外会渲染成空标签。
const { data: contactData } = await useFetch('/api/contact', {
  transform: (res: any) => (res?.success ? res.data : null),
  default: () => null,
})

// 按当前路径动态生成 canonical / og:url
// 不含 query：筛选、分页、统计参数不产生重复页面
const canonicalUrl = computed(() => {
  const path = (route.path || '/').replace(/\/+$/, '')
  return path ? CANONICAL_ORIGIN + path : CANONICAL_ORIGIN + '/'
})

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
  // 统一标题模板：页面名在前、公司名在后。
  // （此前 nuxt.config.ts 与本文件各写一套且互相冲突，且 config 内的函数模板 SSR 不生效）
  titleTemplate: (title?: string) =>
    title
      ? `${title} - 河南玺铭电力科技有限公司`
      : '河南玺铭电力科技有限公司 - 带电清洗与储能系统集成服务商',
  title: '带电清洗与储能系统集成解决方案',
  link: computed(() => {
    const links: any[] = [{ rel: 'canonical', href: canonicalUrl.value }]
    if (siteIcon.value) {
      links.push(
        { rel: 'icon', type: 'image/png', href: siteIcon.value },
        { rel: 'shortcut icon', type: 'image/x-icon', href: siteIcon.value }
      )
    }
    return links
  }),
  meta: [
    { property: 'og:url', content: computed(() => canonicalUrl.value) },
  ],
})

onMounted(() => {
  loadSiteSetting()
})
</script>
