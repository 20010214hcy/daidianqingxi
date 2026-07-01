<template>
  <div class="admin-page-container">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-slate-800">服务管理</h2>
      <el-button type="primary" @click="showAddModal = true">
        <el-icon class="mr-1"><Plus /></el-icon>
        新增服务
      </el-button>
    </div>

    <el-card>
      <div class="desktop-table">
        <el-table :data="services" style="width: 100%" stripe>
          <el-table-column prop="coverImage" label="封面" width="120">
            <template #default="{ row }">
              <el-image
                v-if="row.coverImage"
                :src="row.coverImage"
                :preview-src-list="[row.coverImage]"
                fit="cover"
                style="width: 60px; height: 60px"
              />
              <div v-else class="w-15 h-15 bg-slate-100 flex items-center justify-center rounded">
                <span class="text-slate-400 text-xl">📷</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="服务名称" />
          <el-table-column prop="sortOrder" label="排序" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'published' ? 'success' : 'warning'">
                {{ row.status === 'published' ? '已发布' : '草稿' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right" align="center">
            <template #default="{ row }">
              <AdminActionButtons @edit="editService(row)" @delete="deleteService(row.id, row.coverImage)" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="mobile-list">
        <div v-for="item in services" :key="item.id" class="mobile-card">
          <div class="mobile-card-header">
            <img v-if="item.coverImage" :src="item.coverImage" class="mobile-card-image" />
            <div v-else class="mobile-card-image-placeholder">📷</div>
            <div class="mobile-card-info">
              <h4 class="mobile-card-title">{{ item.title }}</h4>
              <p class="mobile-card-subtitle">{{ item.description || '暂无描述' }}</p>
            </div>
            <el-tag :type="item.status === 'published' ? 'success' : 'warning'" size="small">
              {{ item.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </div>
          <div class="mobile-card-actions">
            <el-button size="small" @click="editService(item)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteService(item.id, item.coverImage)">删除</el-button>
          </div>
        </div>
        <el-empty v-if="services.length === 0" description="暂无服务数据" />
      </div>
    </el-card>

    <el-dialog
      v-model="showAddModal"
      :title="editingService ? '编辑服务' : '新增服务'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="serviceForm" label-width="100px">
        <el-form-item label="服务名称" required>
          <el-input v-model="serviceForm.title" placeholder="请输入服务名称" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="serviceForm.icon" placeholder="请输入图标，如: ⚡、🔧、💧" />
          <div class="mt-2 text-sm text-gray-500">
            预览: <span class="text-2xl">{{ serviceForm.icon || '📦' }}</span>
          </div>
        </el-form-item>
        <el-form-item label="封面图片">
          <ImageCropper v-model="serviceForm.coverImage" :width="300" :height="300" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="serviceForm.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="serviceForm.status">
            <el-option label="发布" value="published" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="serviceForm.description" type="textarea" :rows="2" placeholder="请输入服务简介" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input v-model="serviceForm.content" type="textarea" :rows="10" placeholder="请输入服务内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="showAddModal = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

useHead({ title: '服务管理 - 后台管理' })
definePageMeta({ layout: 'admin' })

const services = ref([])
const showAddModal = ref(false)
const editingService = ref(null)

const serviceForm = ref({
  title: '',
  description: '',
  coverImage: '',
  icon: '',
  sortOrder: 1,
  status: 'published',
  content: ''
})

const fetchServices = async () => {
  try {
    const response = await $fetch('/api/services')
    if (response?.success) {
      services.value = response.data || []
    }
  } catch (error) {
    console.error('获取服务列表失败:', error)
  }
}

const editService = (service) => {
  editingService.value = service
  serviceForm.value = {
    title: service.title,
    description: service.description || '',
    coverImage: service.coverImage || '',
    icon: service.icon || '',
    sortOrder: service.sortOrder || 1,
    status: service.status,
    content: service.content
  }
  showAddModal.value = true
}

const deleteService = async (id, coverImage) => {
  try {
    await ElMessageBox.confirm('确定要删除这个服务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    if (coverImage) {
      try {
        await $fetch('/api/upload', { method: 'DELETE', body: { url: coverImage } })
      } catch (e) {
        console.error('删除图片失败:', e)
      }
    }
    await $fetch('/api/services/' + id, { method: 'DELETE' })
    ElMessage.success('删除成功!')
    await fetchServices()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除服务失败:', error)
    }
  }
}

const handleSubmit = async () => {
  if (!serviceForm.value.title) {
    ElMessage.warning('请输入服务名称!')
    return
  }
  if (!serviceForm.value.content) {
    ElMessage.warning('请输入服务内容!')
    return
  }
  try {
    if (editingService.value) {
      await $fetch('/api/services/' + editingService.value.id, {
        method: 'PUT',
        body: { ...serviceForm.value, authorId: 1 }
      })
    } else {
      await $fetch('/api/services', {
        method: 'POST',
        body: { ...serviceForm.value, authorId: 1 }
      })
    }
    ElMessage.success('保存成功!')
    showAddModal.value = false
    editingService.value = null
    serviceForm.value = {
      title: '', description: '', coverImage: '', icon: '',
      sortOrder: 1, status: 'published', content: ''
    }
    await fetchServices()
  } catch (error) {
    console.error('保存服务失败:', error)
    ElMessage.error('保存失败，请重试!')
  }
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped>
.desktop-table { display: block; }
.mobile-list { display: none; }
.mobile-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}
.mobile-card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}
.mobile-card-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}
.mobile-card-image-placeholder {
  width: 60px;
  height: 60px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.mobile-card-info { flex: 1; min-width: 0; }
.mobile-card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mobile-card-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mobile-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}
@media (max-width: 768px) {
  .desktop-table { display: none !important; }
  .mobile-list { display: block; }
}
</style>
