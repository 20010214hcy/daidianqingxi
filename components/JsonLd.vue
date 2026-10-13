<template>
  <!-- 结构化数据通过 useHead 注入到 <head>（与详情页 Product/Breadcrumb 同路径，已验证可靠）；
       模板 v-html 渲染 <script> 在 SSR 下会输出空标签，请勿改回 -->
  <span hidden aria-hidden="true" />
</template>

<script setup lang="ts">
/**
 * 全站结构化数据（Organization / WebSite / LocalBusiness）
 *
 * 联系方式由 app.vue 获取后通过 props 传入（本组件保持同步，确保 SSR 正常渲染），
 * 后台「联系信息」改完前台自动同步。
 *
 * ⚠️ 前一个版本这里是硬编码的，且是错的：
 *    - 电话写的是占位符 +86-400-888-8888（真实为 0375-3633369）
 *    - 城市写的「郑州市」（真实为河南省平顶山市）
 *    - logo 指向不存在的 /images/logo.png（404）
 *    这些字段会直接进入搜索引擎与地图平台的企业信息库，请勿再写死。
 */
const ORIGIN = 'https://ximingpower.com'
const OG_IMAGE = ORIGIN + '/images/og-cover.png'

const props = defineProps<{ contactInfo?: any }>()

const contact = computed<any>(() => props.contactInfo || {})

const legalName = computed(() =>
  String(contact.value.companyName || '河南玺铭电力科技有限公司')
)

// 0375-3633369 → +86-375-3633369
const telephone = computed<string | undefined>(() => {
  const digits = String(contact.value.phone1 || '').replace(/\D/g, '')
  if (!digits) return undefined
  const local = digits.replace(/^0+/, '')
  if (local.length <= 3) return '+86-' + local
  return `+86-${local.slice(0, 3)}-${local.slice(3)}`
})

const email = computed<string | undefined>(() => contact.value.email1 || undefined)

// 「河南省平顶山市高新区尼龙织造产业园一期17号」→ 拆成 省 / 市 / 街道
const postalAddress = computed(() => {
  const full = String(contact.value.address || '').trim()
  if (!full) return undefined
  let rest = full
  let region = ''
  let locality = ''

  const regionMatch = rest.match(
    /^(.{2,4}?省|.{2,5}?自治区|北京市|上海市|天津市|重庆市)/
  )
  if (regionMatch) {
    region = regionMatch[1]
    rest = rest.slice(region.length)
  }

  const cityMatch = rest.match(/^(.{2,6}?市|.{2,6}?自治州|.{2,6}?地区)/)
  if (cityMatch) {
    locality = cityMatch[1]
    rest = rest.slice(locality.length)
  }

  return {
    '@type': 'PostalAddress',
    ...(region ? { addressRegion: region } : {}),
    ...(locality ? { addressLocality: locality } : {}),
    ...(rest ? { streetAddress: rest } : {}),
    addressCountry: 'CN',
  }
})

const geo = computed(() => {
  const lat = Number(contact.value.latitude)
  const lng = Number(contact.value.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (!lat && !lng)) {
    return undefined
  }
  return { '@type': 'GeoCoordinates', latitude: lat, longitude: lng }
})

// 「周一至周五：9:00 - 18:00」→ schema.org 营业时间
const openingHours = computed(() => {
  const raw = String(contact.value.workHours1 || '')
  const m = raw.match(/(\d{1,2}):(\d{2})\s*[-–—~至到]\s*(\d{1,2}):(\d{2})/)
  const pad = (h: string, mi: string) => `${h.padStart(2, '0')}:${mi}`
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const withWeekend = /周[六日末]|星期六|星期日/.test(raw)
    ? [...weekdays, 'Saturday']
    : weekdays
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: withWeekend,
    opens: m ? pad(m[1], m[2]) : '09:00',
    closes: m ? pad(m[3], m[4]) : '18:00',
  }
})

const jsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${ORIGIN}/#organization`,
        name: legalName.value,
        alternateName: '河南玺铭电力科技有限公司',
        url: `${ORIGIN}/`,
        logo: { '@type': 'ImageObject', url: OG_IMAGE },
        image: OG_IMAGE,
        description: '专业提供电力设备带电清洗、储能系统集成服务的高新技术企业',
        ...(postalAddress.value ? { address: postalAddress.value } : {}),
        ...(telephone.value || email.value
          ? {
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  ...(telephone.value ? { telephone: telephone.value } : {}),
                  ...(email.value ? { email: email.value } : {}),
                  contactType: 'customer service',
                  availableLanguage: ['zh-CN'],
                },
              ],
            }
          : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${ORIGIN}/#website`,
        name: legalName.value,
        alternateName: '玺铭电力',
        url: `${ORIGIN}/`,
        description: '带电清洗与储能系统集成解决方案',
        inLanguage: 'zh-CN',
        publisher: { '@id': `${ORIGIN}/#organization` },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${ORIGIN}/#localbusiness`,
        name: legalName.value,
        image: OG_IMAGE,
        url: `${ORIGIN}/`,
        ...(telephone.value ? { telephone: telephone.value } : {}),
        ...(email.value ? { email: email.value } : {}),
        ...(postalAddress.value ? { address: postalAddress.value } : {}),
        ...(geo.value ? { geo: geo.value } : {}),
        openingHoursSpecification: openingHours.value,
        serviceArea: { '@type': 'Country', name: '中国' },
        priceRange: '面议',
      },
    ],
  })
)

// 通过 useHead 注入 <head>（SSR 可靠），替代原先模板 v-html 的方式
useHead({
  script: [
    { type: 'application/ld+json', innerHTML: jsonLd },
  ] as any,
})
</script>
