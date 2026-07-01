<template>
  <div class="admin-page-header">
    <div class="admin-page-header-left">
      <h1 class="admin-page-title">{{ title }}</h1>
      <p v-if="description" class="admin-page-description">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="admin-page-header-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
}

defineProps<Props>();
</script>

<style scoped>
.admin-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--admin-space-6, 24px);
  flex-wrap: wrap;
  gap: var(--admin-space-4, 16px);
}

.admin-page-header-left {
  flex: 1;
  min-width: 0;
}

.admin-page-title {
  font-size: var(--admin-page-title-size, 24px);
  font-weight: var(--admin-page-title-weight, 700);
  color: var(--admin-text-primary, #1a1a2e);
  margin: 0;
  line-height: 1.3;
}

.admin-page-description {
  font-size: 14px;
  color: var(--admin-text-secondary, #6b7280);
  margin-top: 4px;
}

.admin-page-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .admin-page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .admin-page-header-actions {
    width: 100%;
  }

  .admin-page-header-actions :deep(.el-button) {
    width: 100%;
  }
}
</style>
