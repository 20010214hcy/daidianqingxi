<template>
  <div class="admin-page-container">
    <AdminPageHeader title="媒体资源" description="管理网站图片资源，可在文章和案例中引用">
      <template #actions>
        <el-button type="primary" @click="showUploader = true">
          <el-icon class="mr-1"><Plus /></el-icon>
          上传图片
        </el-button>
      </template>
    </AdminPageHeader>

    <!-- 搜索 -->
    <el-card class="mb-4">
      <div class="flex gap-4 items-center">
        <el-input v-model="searchQuery" placeholder="搜索文件名..." clearable class="w-64" @clear="fetchMedia" @keyup.enter="fetchMedia">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-button @click="fetchMedia">搜索</el-button>
        <span class="text-sm text-slate-400 ml-4">共 {{ total }} 张图片</span>
      </div>
    </el-card>

    <!-- 图片网格 -->
    <el-card>
      <div v-loading="loading" class="media-grid">
        <div v-for="item in mediaList" :key="item.id" class="media-item group" :class="{ 'is-selected': selectedIds.has(item.id) }" @click="toggleSelect(item)">
          <div class="media-img-wrap">
            <img :src="item.url" :alt="item.alt || item.filename" class="media-img" loading="lazy" />
            <div class="media-overlay">
              <el-button size="small" type="danger" circle @click.stop="handleDelete(item)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <div v-if="selectMode" class="media-check">
              <el-icon v-if="selectedIds.has(item.id)" class="text-white"><Check /></el-icon>
            </div>
          </div>
          <div class="media-info">
            <p class="media-name">{{ item.filename }}</p>
            <p class="media-meta">{{ formatDate(item.createdAt) }}</p>
          </div>
        </div>
      </div>

      <div v-if="!loading && mediaList.length === 0" class="text-center py-20">
        <p class="text-slate-400">暂无图片，点击上方"上传图片"添加</p>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex justify-end mt-6">
        <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total" layout="prev, pager, next" @current-change="fetchMedia" />
      </div>
    </el-card>

    <!-- 上传弹窗 -->
    <el-dialog v-model="showUploader" title="上传图片" width="600px">
      <div class="upload-area">
        <el-upload
          action="/api/upload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :before-upload="beforeUpload"
          accept="image/*"
          :limit="20"
          multiple
          list-type="picture-card"
          :on-exceed="() => ElMessage.warning('最多上传20张')"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </div>
      <template #footer>
        <el-button @click="showUploader = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus, Search, Delete, Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

definePageMeta({ layout: 'admin' })

const { formatDate } = useFormatDate()

const mediaList = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const totalPages = ref(0)
const currentPage = ref(1)
const pageSize = 24
const searchQuery = ref('')
const showUploader = ref(false)

// 选择模式（供其他页面调用）
const selectMode = ref(false)
const selectedIds = ref(new Set<number>())

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

onMounted(() => fetchMedia())

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) { ElMessage.error('只能上传图片文件'); return false }
  if (!isLt5M) { ElMessage.error('图片大小不能超过5MB'); return false }
  return true
}

const handleUploadSuccess = async (response: any, file: any) => {
  const url = response?.data?.url || response?.url
  if (!url) { ElMessage.error('上传失败'); return }

  try {
    await $fetch('/api/media', {
      method: 'POST',
      body: { filename: file.name, url, size: file.size, mimeType: file.raw?.type },
    })
    ElMessage.success('上传成功')
    fetchMedia()
  } catch (err) {
    ElMessage.error('保存到媒体库失败')
  }
}

const handleUploadError = () => { ElMessage.error('上传失败') }

const handleDelete = async (item: any) => {
  try {
    await ElMessageBox.confirm(`确定删除 "${item.filename}" 吗？`, '提示', { type: 'warning' })
    await $fetch(`/api/media/${item.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    fetchMedia()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('删除失败')
  }
}

const toggleSelect = (item: any) => {
  if (!selectMode.value) return
  if (selectedIds.value.has(item.id)) {
    selectedIds.value.delete(item.id)
  } else {
    selectedIds.value.add(item.id)
  }
}

// 暴露给其他组件使用
defineExpose({ selectMode, selectedIds, mediaList })
</script>

<style scoped>
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.media-item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.media-item:hover {
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.media-item.is-selected {
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.media-img-wrap {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.media-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.media-item:hover .media-img { transform: scale(1.05); }

.media-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.media-item:hover .media-overlay { opacity: 1; }

.media-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: #1a73e8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-info { padding: 10px 12px; }
.media-name { font-size: 13px; color: #334155; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.media-meta { font-size: 11px; color: #94a3b8; margin-top: 2px; }

.upload-area :deep(.el-upload--picture-card) { width: 120px; height: 120px; }
</style>
