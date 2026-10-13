<template>
  <section class="trust-bar">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ul class="trust-list">
        <li v-for="item in items" :key="item.label" class="trust-item">
          <span class="trust-value">{{ item.value }}</span>
          <span class="trust-label">{{ item.label }}</span>
        </li>
        <li v-if="certCount" class="trust-item">
          <span class="trust-value">{{ certCount }}+</span>
          <span class="trust-label">资质荣誉</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  certCount?: number
}
const props = defineProps<Props>()

const items = [
  { value: '20+', label: '年行业经验' },
  { value: '500+', label: '工程案例' },
  { value: '全国', label: '服务可承接' },
]
</script>

<style scoped>
.trust-bar {
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  min-height: 56px;
  display: flex;
  align-items: center;
}

.trust-list {
  list-style: none;
  margin: 0;
  padding: 14px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 28px;
  width: 100%;
}

.trust-item {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  position: relative;
}

/* 项目间细竖线 */
.trust-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -16px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 14px;
  background: #e2e8f0;
}

.trust-value {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
  line-height: 1;
}

.trust-label {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1;
}

@media (max-width: 640px) {
  .trust-list {
    gap: 10px 18px;
    padding: 12px 0;
  }

  .trust-item:not(:last-child)::after {
    display: none;
  }

  .trust-value {
    font-size: 15px;
  }

  .trust-label {
    font-size: 11px;
  }
}
</style>
