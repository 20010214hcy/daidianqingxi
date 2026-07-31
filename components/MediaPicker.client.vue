<template>
  <div class="media-picker">
    <!-- 当前图片预览 -->
    <div v-if="modelValue" class="media-picker-preview">
      <img :src="modelValue" class="media-picker-img" />
      <div class="media-picker-actions">
        <el-button size="small" @click="showLibrary = true">更换</el-button>
        <el-button size="small" type="danger" @click="clearImage">移除</el-button>
      </div>
    </div>

    <!-- 无图片时显示选择按钮 -->
    <div v-else class="media-picker-empty">
      <el-button @click="showLibrary = true">
        <el-icon class="mr-1"><Picture /></el-icon>
        从媒体库选择
      </el-button>
      <span class="text-slate-400 text-sm mx-3">或</span>
      <el-upload
        action="/api/upload"
        :show-file-list="false"
        :on-success="handleUpload"
        :before-upload="beforeUpload"
        accept="image/*"
      >
        <el-button type="primary">本地上传</el-button>
      </el-upload>
    </div>

    <!-- 媒体库弹窗 -->
    <el-dialog v-model="showLibrary" title="选择图片" width="800px" top="5vh">
      <!-- 搜索 + 上传 -->
      <div class="flex items-center gap-3 mb-4">
        <el-input v-model="searchQuery" placeholder="搜索文件名..." clearable class="w-64" @clear="fetchMedia" @keyup.enter="fetchMedia">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-button @click="fetchMedia">搜索</el-button>
        <div class="flex-1" />
        <el-upload
          action="/api/upload"
          :show-file-list="false"
          :on-success="handleQuickUpload"
          :before-upload="beforeUpload"
          accept="image/*"
        >
          <el-button size="small" type="primary">上传新图片</el-button>
        </el-upload>
      </div>

      <!-- 图片网格 -->
      <div v-loading="loading" class="media-library-grid">
        <div v-for="item in mediaList" :key="item.id"
          class="media-library-item"
          :class="{ 'is-selected': selectedUrl === item.url }"
          @click="selectedUrl = item.url">
          <img :src="item.url" :alt="item.filename" class="media-library-img" loading="lazy" />
          <div class="media-library-check" v-if="selectedUrl === item.url">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p class="media-library-name">{{ item.filename }}</p>
        </div>
      </div>

      <div v-if="!loading && mediaList.length === 0" class="text-center py-10 text-slate-400">
        暂无图片，请先上传
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex justify-center mt-4">
        <el-pagination small v-model:current-page="currentPage" :page-size="pageSize" :total="total" layout="prev, pager, next" @current-change="fetchMedia" />
      </div>

      <template #footer>
        <el-button @click="showLibrary = false">取消</el-button>
        <el-button type="primary" :disabled="!selectedUrl" @click="confirmSelect">确定选择</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Picture, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits(['update:modelValue'])

const showLibrary = ref(false)
const searchQuery = ref('')
const mediaList = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const totalPages = ref(0)
const currentPage = ref(1)
const pageSize = 18
const selectedUrl = ref('')

const fetchMedia = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({ page: String(currentPage.value), pageSize: String(pageSize) })
    if (searchQuery.value) params.append('keyword', searchQuery.value)
    const res: any = await $fetch(`/api/media?${params}`)
    if (res?.success) {
      mediaList.value = res.data.list || []
      total.value = res.data.pagination?.total || 0
      totalPages.value = res.data.pagination?.totalPages || 0
    }
  } catch (err) {
    console.error('获取媒体列表失败:', err)
  } finally {
    loading.value = false
  }
}

watch(showLibrary, (val) => {
  if (val) {
    selectedUrl.value = props.modelValue || ''
    fetchMedia()
  }
})

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) { ElMessage.error('只能上传图片'); return false }
  if (!isLt5M) { ElMessage.error('图片不能超过5MB'); return false }
  return true
}

const handleUpload = (response: any) => {
  const url = response?.data?.url || response?.url
  if (url) emit('update:modelValue', url)
}

const handleQuickUpload = async (response: any, file: any) => {
  const url = response?.data?.url || response?.url
  if (!url) return
  // 保存到媒体库
  await $fetch('/api/media', { method: 'POST', body: { filename: file.name, url } })
  ElMessage.success('上传成功')
  selectedUrl.value = url
  fetchMedia()
}

const confirmSelect = () => {
  emit('update:modelValue', selectedUrl.value)
  showLibrary.value = false
}

const clearImage = () => {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.media-picker-preview {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.media-picker-img {
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.media-picker-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.media-picker-empty {
  display: flex;
  align-items: center;
}

/* 媒体库网格 */
.media-library-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  max-height: 50vh;
  overflow-y: auto;
  padding: 4px;
}

.media-library-item {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;
}

.media-library-item:hover {
  border-color: #cbd5e1;
}

.media-library-item.is-selected {
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.media-library-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.media-library-check {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  background: #1a73e8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-library-name {
  font-size: 11px;
  color: #64748b;
  padding: 6px 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
