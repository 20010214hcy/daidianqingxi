<template>
  <div class="mobile-card" :class="{ 'mobile-card--clickable': clickable }" @click="clickable && $emit('click')">
    <!-- 卡片头部：图片 + 标题 -->
    <div class="mobile-card-header">
      <div v-if="image" class="mobile-card-image">
        <img :src="image" :alt="title" />
      </div>
      <div class="mobile-card-title-area">
        <h4 class="mobile-card-title">{{ title }}</h4>
        <p v-if="subtitle" class="mobile-card-subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="status" class="mobile-card-status">
        <el-tag :type="statusType" size="small">{{ status }}</el-tag>
      </div>
    </div>

    <!-- 卡片内容：标签信息 -->
    <div v-if="tags && tags.length" class="mobile-card-tags">
      <span v-for="tag in tags" :key="tag.label" class="mobile-card-tag">
        <span class="tag-label">{{ tag.label }}:</span>
        <span class="tag-value">{{ tag.value }}</span>
      </span>
    </div>

    <!-- 卡片底部：操作按钮 -->
    <div v-if="$slots.actions" class="mobile-card-actions">
      <slot name="actions" />
    </div>

    <!-- 自定义内容插槽 -->
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  image: { type: String, default: '' },
  status: { type: String, default: '' },
  statusType: { type: String, default: 'info' },
  tags: { type: Array, default: () => [] },
  clickable: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>

<style scoped>
.mobile-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s ease;
}

.mobile-card--clickable {
  cursor: pointer;
}

.mobile-card--clickable:active {
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
}

.mobile-card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.mobile-card-image {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f3f4f6;
}

.mobile-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-card-title-area {
  flex: 1;
  min-width: 0;
}

.mobile-card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-card-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-card-status {
  flex-shrink: 0;
}

.mobile-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.mobile-card-tag {
  font-size: 13px;
  color: #475569;
}

.tag-label {
  color: #94a3b8;
  margin-right: 4px;
}

.tag-value {
  color: #1e293b;
  font-weight: 500;
}

.mobile-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.mobile-card-actions :deep(.el-button) {
  height: 36px;
  padding: 0 16px;
  font-size: 13px;
}

/* 桌面端隐藏 */
@media (min-width: 769px) {
  .mobile-card {
    display: none;
  }
}
</style>
