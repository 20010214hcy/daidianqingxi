<template>
  <div class="admin-mobile-list">
    <!-- 默认插槽：桌面端表格 -->
    <div class="desktop-table">
      <slot />
    </div>
    
    <!-- 移动端插槽：卡片列表 -->
    <div class="mobile-list">
      <slot name="mobile" />
    </div>
    
    <!-- 空状态 -->
    <div v-if="empty" class="list-empty">
      <slot name="empty">
        <el-empty description="暂无数据" :image-size="80" />
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  empty: { type: Boolean, default: false }
})
</script>

<style scoped>
.admin-mobile-list {
  position: relative;
}

.desktop-table {
  display: block;
}

.mobile-list {
  display: none;
}

.list-empty {
  padding: 40px 0;
}

@media (max-width: 768px) {
  .desktop-table {
    display: none !important;
  }
  
  .mobile-list {
    display: block;
  }
}
</style>
