<template>
  <component :is="'script'" type="application/ld+json" v-html="jsonLd" />
</template>

<script setup lang="ts">
const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      'name': '河南玺铭电力科技有限公司',
      'url': 'https://www.ximingpower.com',
      'logo': 'https://www.ximingpower.com/images/logo.png',
      'description': '专业提供电力设备带电清洗、储能系统集成服务的高新技术企业',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': '郑州市',
        'addressRegion': '河南省',
        'addressCountry': 'CN'
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+86-400-888-8888',
        'contactType': 'customer service',
        'availableLanguage': 'Chinese'
      }
    },
    {
      '@type': 'WebSite',
      'name': '河南玺铭电力科技有限公司',
      'url': 'https://www.ximingpower.com',
      'description': '带电清洗与储能系统集成解决方案',
      'inLanguage': 'zh-CN'
    },
    {
      '@type': 'LocalBusiness',
      'name': '河南玺铭电力科技有限公司',
      'image': 'https://www.ximingpower.com/images/og-cover.svg',
      'url': 'https://www.ximingpower.com',
      'telephone': '+86-400-888-8888',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': '郑州市',
        'addressRegion': '河南省',
        'addressCountry': 'CN'
      },
      'openingHoursSpecification': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday','Tuesday','Wednesday','Thursday','Friday'],
        'opens': '09:00',
        'closes': '18:00'
      },
      'serviceArea': { '@type': 'Country', 'name': '中国' }
    }
  ]
})
</script>
