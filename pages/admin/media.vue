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
        <div v-for="item in mediaList" :key="item.id" class="media-item group">
          <div class="media-img-wrap">
            <img :src="item.url" :alt="item.alt || item.filename" class="media-img" loading="lazy" />
            <div class="media-overlay">
              <el-button size="small" type="primary" circle @click.stop="handleEdit(item)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button size="small" type="danger" circle @click.stop="handleDelete(item)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
          <div class="media-info">
            <p class="media-name" @click.stop="handleEdit(item)" title="点击编辑">{{ item.filename }}</p>
            <p class="media-meta">{{ formatDate(item.createdAt) }}</p>
          </div>
        </div>
      </div>

      <div v-if="!loading && mediaList.length === 0" class="text-center py-20">
        <p class="text-slate-400">暂无图片，点击上方"上传图片"添加</p>
      </div>

      <div v-if="totalPages > 1" class="flex justify-end mt-6">
        <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total" layout="prev, pager, next" @current-change="fetchMedia" />
      </div>
    </el-card>

    <!-- 上传弹窗 -->
    <el-dialog v-model="showUploader" title="上传图片" width="700px">
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
      <template #footer>
        <el-button @click="showUploader = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="showEditor" title="编辑图片信息" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="预览">
          <div class="w-48 h-32 rounded-lg overflow-hidden bg-slate-100">
            <img :src="editForm.url" class="w-full h-full object-cover" />
          </div>
        </el-form-item>
        <el-form-item label="文件名">
          <el-input v-model="editForm.filename" placeholder="请输入文件名" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.alt" placeholder="图片描述（用于SEO）" />
        </el-form-item>
        <el-form-item label="链接">
          <el-input :model-value="editForm.url" disabled>
            <template #append>
              <el-button @click="copyUrl">复制</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditor = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus, Search, Delete, Edit } from '@element-plus/icons-vue'
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
const showEditor = ref(false)
const saving = ref(false)

const editForm = reactive({
  id: 0,
  filename: '',
  alt: '',
  url: '',
})

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

  // 上传成功后弹出编辑框，让用户修改名称
  editForm.id = 0
  editForm.filename = file.name
  editForm.alt = ''
  editForm.url = url
  showUploader.value = false
  showEditor.value = true
}

const handleUploadError = () => { ElMessage.error('上传失败') }

const handleEdit = (item: any) => {
  editForm.id = item.id
  editForm.filename = item.filename
  editForm.alt = item.alt || ''
  editForm.url = item.url
  showEditor.value = true
}

const handleSave = async () => {
  saving.value = true
  try {
    if (editForm.id) {
      // 更新已有图片
      await $fetch(`/api/media/${editForm.id}`, {
        method: 'PUT',
        body: { filename: editForm.filename, alt: editForm.alt },
      })
    } else {
      // 新上传的图片，保存到媒体库
      await $fetch('/api/media', {
        method: 'POST',
        body: { filename: editForm.filename, url: editForm.url, alt: editForm.alt },
      })
    }
    ElMessage.success('保存成功')
    showEditor.value = false
    fetchMedia()
  } catch (err) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

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

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(editForm.url)
    ElMessage.success('链接已复制')
  } catch {}
}
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
  border: 2px solid #f1f5f9;
  transition: all 0.3s;
}

.media-item:hover {
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
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
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.media-item:hover .media-overlay { opacity: 1; }

.media-info { padding: 10px 12px; }

.media-name {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s;
}

.media-name:hover { color: #1a73e8; }

.media-meta { font-size: 11px; color: #94a3b8; margin-top: 2px; }
</style>
