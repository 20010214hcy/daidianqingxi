<template>
  <section class="detail-banner">
    <div class="detail-banner-bg" aria-hidden="true" />
    <div class="container-page detail-banner-inner">
      <nav class="db-crumb" aria-label="面包屑导航">
        <template v-for="item in breadcrumb" :key="item.to">
          <NuxtLink :to="item.to" class="db-crumb-link">{{ item.name }}</NuxtLink>
          <span class="db-crumb-sep" aria-hidden="true">/</span>
        </template>
        <span class="db-crumb-current">{{ title || '加载中…' }}</span>
      </nav>

      <div v-if="title" class="db-meta">
        <span v-if="tag" class="db-tag">{{ tag }}</span>
        <h1 class="db-title">{{ title }}</h1>
        <p v-if="lead" class="db-lead">{{ lead }}</p>
        <ul v-if="highlights.length" class="db-highlights">
          <li v-for="h in highlights" :key="h">{{ h }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface DetailCrumb {
  name: string
  to: string
}

const props = withDefaults(
  defineProps<{
    /** 面包屑，不含当前页（当前页由 title 自动补在末尾） */
    breadcrumb: DetailCrumb[]
    /** 页面主标题，同时用作 h1 与面包屑末项 */
    title?: string
    /** 可选：标题上方的标签，如所属分类、业务板块 */
    tag?: string
    /** 可选：一句话简介 */
    lead?: string
    /** 可选：卖点/要点徽章，最多展示 3 个 */
    highlights?: string[]
  }>(),
  {
    title: '',
    tag: '',
    lead: '',
    highlights: () => [],
  }
)

const highlights = computed(() => (props.highlights || []).slice(0, 3))
</script>

<style scoped>
.detail-banner {
  position: relative;
  color: #fff;
  overflow: hidden;
}

.detail-banner-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.94) 0%,
    rgba(30, 64, 175, 0.9) 55%,
    rgba(37, 99, 235, 0.82) 100%
  );
}

.detail-banner-inner {
  position: relative;
  z-index: 1;
  padding-top: 36px;
  padding-bottom: 40px;
}

.db-crumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 20px;
}

.db-crumb-link {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: color 0.2s ease;
}

.db-crumb-link:hover {
  color: #fff;
}

.db-crumb-sep {
  opacity: 0.4;
}

.db-crumb-current {
  color: #fff;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.db-meta {
  min-height: 1px;
}

.db-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(147, 197, 253, 0.2);
  border: 1px solid rgba(147, 197, 253, 0.35);
  color: #dbeafe;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
}

.db-title {
  margin: 0 0 12px;
  font-size: clamp(24px, 2.4vw, 30px);
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 1.25;
}

.db-lead {
  margin: 0;
  max-width: 640px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
  line-height: 1.7;
}

.db-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.db-highlights li {
  padding: 5px 13px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.24);
  color: #fff;
  font-size: 12.5px;
  font-weight: 600;
}

@media (max-width: 640px) {
  .detail-banner-inner {
    padding-top: 22px;
    padding-bottom: 24px;
  }

  .db-crumb {
    margin-bottom: 14px;
  }

  .db-crumb-current {
    max-width: 160px;
  }
}
</style>
