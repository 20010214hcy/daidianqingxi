<template>
  <div class="admin-action-btns">
    <el-tooltip v-if="showEdit" content="编辑" placement="top" :show-after="300">
      <el-button type="primary" :size="size" circle @click="$emit('edit')">
        <el-icon><Edit /></el-icon>
      </el-button>
    </el-tooltip>
    <el-tooltip v-if="showView" content="查看" placement="top" :show-after="300">
      <el-button type="info" :size="size" circle @click="$emit('view')">
        <el-icon><View /></el-icon>
      </el-button>
    </el-tooltip>
    <el-tooltip v-if="showDelete" content="删除" placement="top" :show-after="300">
      <el-button type="danger" :size="size" circle @click="$emit('delete')">
        <el-icon><Delete /></el-icon>
      </el-button>
    </el-tooltip>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { Edit, Delete, View } from '@element-plus/icons-vue'

withDefaults(defineProps<{
  showEdit?: boolean
  showDelete?: boolean
  showView?: boolean
  size?: 'small' | 'default' | 'large'
}>(), {
  showEdit: true,
  showDelete: true,
  showView: false,
  size: 'small'
})

defineEmits<{
  edit: []
  delete: []
  view: []
}>()
</script>

<style scoped>
.admin-action-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.admin-action-btns .el-button--primary {
  background: var(--admin-primary-gradient);
  border: none;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.admin-action-btns .el-button--primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
  transform: translateY(-1px);
}

.admin-action-btns .el-button--danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
}

.admin-action-btns .el-button--danger:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
  transform: translateY(-1px);
}

.admin-action-btns .el-button--info {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(100, 116, 139, 0.25);
}

.admin-action-btns .el-button--info:hover {
  background: linear-gradient(135deg, #475569 0%, #334155 100%);
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.35);
  transform: translateY(-1px);
}

.admin-action-btns .el-button:active {
  transform: translateY(0);
}
</style>
