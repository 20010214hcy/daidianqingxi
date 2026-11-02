<template>
  <section class="page-header">
    <div class="page-header-bg" aria-hidden="true" />
    <div class="page-header-content">
      <nav v-if="breadcrumb" class="page-header-crumbs" aria-label="面包屑">
        <NuxtLink to="/" class="page-header-crumb-link">首页</NuxtLink>
        <span class="page-header-crumb-sep">/</span>
        <span class="page-header-crumb-current">{{ breadcrumb }}</span>
      </nav>
      <h1 class="page-header-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header-subtitle">{{ subtitle }}</p>
      <div v-if="$slots.breadcrumb" class="page-header-breadcrumb">
        <slot name="breadcrumb" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  /** 可选面包屑当前层级文案，如「新闻中心」；自动带「首页 /」前缀 */
  breadcrumb?: string;
}

defineProps<Props>();
</script>

<style scoped>
.page-header {
  position: relative;
  overflow: hidden;
  color: #ffffff;
}

/* 统一横幅背景：深蓝渐变压在实拍图上（与产品页同配方） */
.page-header-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 58, 138, 0.88) 100%),
    url('/uploads/hero-bg-v2.webp') center/cover no-repeat;
}

.page-header-content {
  position: relative;
  z-index: 1;
  max-width: 80rem;
  margin: 0 auto;
  padding: 64px 1rem 56px;
  text-align: center;
}

.page-header-crumbs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 18px;
}

.page-header-crumb-link {
  color: rgba(255, 255, 255, 0.62);
  font-size: 14px;
  transition: color 0.2s;
}

.page-header-crumb-link:hover {
  color: #ffffff;
}

.page-header-crumb-sep {
  color: rgba(255, 255, 255, 0.32);
  font-size: 14px;
}

.page-header-crumb-current {
  color: rgba(255, 255, 255, 0.82);
  font-size: 14px;
}

.page-header-title {
  font-size: clamp(26px, 2.6vw, 34px);
  font-weight: 800;
  letter-spacing: 0.04em;
  margin: 0 0 12px;
}

.page-header-title:last-child {
  margin-bottom: 0;
}

.page-header-subtitle {
  font-size: 14.5px;
  color: rgba(255, 255, 255, 0.78);
  margin: 0;
  line-height: 1.75;
}

.page-header-breadcrumb {
  margin-top: 1.25rem;
}

@media (max-width: 768px) {
  .page-header-content {
    padding: 48px 1rem 40px;
  }

  .page-header-title {
    font-size: 26px;
  }

  .page-header-subtitle {
    font-size: 13.5px;
  }
}
</style>
