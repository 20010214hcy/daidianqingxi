<template>
  <div class="admin-page-container">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-slate-800">服务管理</h2>
      <el-button type="primary" @click="showAddModal = true">
        <el-icon class="mr-1"><Plus /></el-icon>
        新增服务
      </el-button>
    </div>

    <!-- 业务板块筛选 -->
    <el-card class="mb-4">
      <div class="flex flex-wrap items-center gap-4">
        <el-select
          v-model="filterBusinessUnit"
          placeholder="筛选业务板块"
          class="w-48"
          clearable
          @change="fetchServices"
        >
          <el-option label="全部板块" :value="null" />
          <el-option
            v-for="unit in businessUnits"
            :key="unit.id"
            :label="unit.name"
            :value="unit.id"
          />
        </el-select>
        <span class="text-sm text-slate-500">
          共 {{ services.length }} 个服务
        </span>
      </div>
    </el-card>

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
          <el-table-column prop="title" label="服务名称" min-width="180" />
          <el-table-column label="所属板块" width="150">
            <template #default="{ row }">
              <el-tag v-if="row.businessunit" size="small" type="primary">
                {{ row.businessunit.name }}
              </el-tag>
              <span v-else class="text-slate-400 text-sm">未分配</span>
            </template>
          </el-table-column>
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
              <p class="mobile-card-subtitle">
                {{ item.businessunit?.name || '未分配板块' }} · {{ item.description || '暂无描述' }}
              </p>
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
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form :model="serviceForm" label-width="100px">
        <el-form-item label="服务名称" required>
          <el-input v-model="serviceForm.title" placeholder="请输入服务名称" />
        </el-form-item>
        <el-form-item label="所属板块">
          <el-select v-model="serviceForm.businessUnitId" placeholder="请选择业务板块" class="w-full" clearable>
            <el-option label="不指定" :value="null" />
            <el-option
              v-for="unit in businessUnits"
              :key="unit.id"
              :label="unit.name"
              :value="unit.id"
            />
          </el-select>
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
          <el-input v-model="serviceForm.content" type="textarea" :rows="8" placeholder="请输入服务内容（支持HTML）" />
        </el-form-item>

        <!-- 详情页字段 -->
        <el-divider content-position="left">详情页设置</el-divider>

        <el-form-item label="详情图片">
          <ImageCropper v-model="serviceForm.detailImage" :width="800" :height="450" />
          <div class="mt-1 text-xs text-gray-400">用于详情页顶部横幅展示</div>
        </el-form-item>

        <el-form-item label="视频URL">
          <el-input v-model="serviceForm.videoUrl" placeholder="请输入视频URL（可选）" />
          <div class="mt-1 text-xs text-gray-400">支持mp4格式，优先于详情图片显示</div>
        </el-form-item>

        <el-form-item label="方案优势">
          <div class="w-full">
            <div v-for="(adv, index) in advantagesList" :key="index" class="flex gap-2 mb-2">
              <el-input v-model="adv.title" placeholder="优势标题" class="w-1/3" />
              <el-input v-model="adv.description" placeholder="优势描述" class="flex-1" />
              <el-button type="danger" text @click="advantagesList.splice(index, 1)">删除</el-button>
            </div>
            <el-button @click="advantagesList.push({ title: '', description: '' })" size="small" type="primary" text>
              + 添加优势
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="技术特点">
          <div class="w-full">
            <div v-for="(feat, index) in featuresList" :key="index" class="flex gap-2 mb-2">
              <el-input v-model="feat.title" placeholder="特点标题" class="w-1/3" />
              <el-input v-model="feat.description" placeholder="特点描述" class="flex-1" />
              <el-button type="danger" text @click="featuresList.splice(index, 1)">删除</el-button>
            </div>
            <el-button @click="featuresList.push({ title: '', description: '' })" size="small" type="primary" text>
              + 添加特点
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="技术参数">
          <div class="w-full">
            <div v-for="(spec, index) in specsList" :key="index" class="flex gap-2 mb-2">
              <el-input v-model="spec.label" placeholder="参数名称" class="w-1/3" />
              <el-input v-model="spec.value" placeholder="参数值" class="flex-1" />
              <el-button type="danger" text @click="specsList.splice(index, 1)">删除</el-button>
            </div>
            <el-button @click="specsList.push({ label: '', value: '' })" size="small" type="primary" text>
              + 添加参数
            </el-button>
          </div>
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

<script setup lang="ts">
import { Plus, Delete } from '@element-plus/icons-vue'

definePageMeta({
  layout: 'admin'
})

const services = ref([])
const businessUnits = ref([])
const showAddModal = ref(false)
const editingService = ref(null)
const filterBusinessUnit = ref(null)

const serviceForm = reactive({
  title: '',
  description: '',
  content: '',
  coverImage: '',
  icon: '',
  price: '',
  videoUrl: '',
  detailImage: '',
  sortOrder: 0,
  businessUnitId: null,
  status: 'published'
})

const advantagesList = ref([])
const featuresList = ref([])
const specsList = ref([])

// 获取服务列表
const fetchServices = async () => {
  try {
    const params = filterBusinessUnit.value ? `?businessUnitId=${filterBusinessUnit.value}` : ''
    const res = await $fetch(`/api/services${params}`)
    if (res.success) {
      services.value = res.data
    }
  } catch (error) {
    console.error('获取服务失败:', error)
  }
}

// 获取业务板块
const fetchBusinessUnits = async () => {
  try {
    const res = await $fetch('/api/business-units')
    if (res.success) {
      businessUnits.value = res.data
    }
  } catch (error) {
    console.error('获取业务板块失败:', error)
  }
}

// 编辑服务
const editService = (service) => {
  editingService.value = service
  Object.assign(serviceForm, {
    title: service.title,
    description: service.description || '',
    content: service.content,
    coverImage: service.coverImage || '',
    icon: service.icon || '',
    price: service.price || '',
    videoUrl: service.videoUrl || '',
    detailImage: service.detailImage || '',
    sortOrder: service.sortOrder || 0,
    businessUnitId: service.businessUnitId || null,
    status: service.status || 'published'
  })
  // 解析JSON字段
  try {
    advantagesList.value = service.advantages ? (typeof service.advantages === 'string' ? JSON.parse(service.advantages) : service.advantages) : []
  } catch { advantagesList.value = [] }
  try {
    featuresList.value = service.features ? (typeof service.features === 'string' ? JSON.parse(service.features) : service.features) : []
  } catch { featuresList.value = [] }
  try {
    specsList.value = service.specs ? (typeof service.specs === 'string' ? JSON.parse(service.specs) : service.specs) : []
  } catch { specsList.value = [] }
  showAddModal.value = true
}

// 提交表单
const handleSubmit = async () => {
  const { user } = useAuth()
  if (!user.value) {
    ElMessage.error("请先登录")
    return
  }
  if (!serviceForm.title || !serviceForm.content) {
    ElMessage.warning('请填写必填项')
    return
  }

  const submitData = {
    authorId: user.value.id,
    ...serviceForm,
    advantages: advantagesList.value.length > 0 ? JSON.stringify(advantagesList.value) : null,
    features: featuresList.value.length > 0 ? JSON.stringify(featuresList.value) : null,
    specs: specsList.value.length > 0 ? JSON.stringify(specsList.value) : null
  }

  try {
    if (editingService.value) {
      await $fetch(`/api/services/${editingService.value.id}`, {
        method: 'PUT',
        body: submitData
      })
      ElMessage.success('更新成功')
    } else {
      await $fetch('/api/services', {
        method: 'POST',
        body: submitData
      })
      ElMessage.success('添加成功')
    }
    showAddModal.value = false
    editingService.value = null
    resetForm()
    fetchServices()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除服务
const deleteService = async (id, coverImage) => {
  try {
    await ElMessageBox.confirm('确定要删除此服务吗？', '提示', { type: 'warning' })
    await $fetch(`/api/services/${id}`, {
      method: 'DELETE',
      body: { coverImage }
    })
    ElMessage.success('删除成功')
    fetchServices()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(serviceForm, {
    title: '',
    description: '',
    content: '',
    coverImage: '',
    icon: '',
    price: '',
    videoUrl: '',
    detailImage: '',
    sortOrder: 0,
    businessUnitId: null,
    status: 'published'
  })
  advantagesList.value = []
  featuresList.value = []
  specsList.value = []
}

onMounted(() => {
  fetchServices()
  fetchBusinessUnits()
})
</script>

<style scoped>
.desktop-table {
  display: block;
}

.mobile-list {
  display: none;
}

.mobile-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mobile-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.mobile-card-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.mobile-card-image-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.mobile-card-info {
  flex: 1;
}

.mobile-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.mobile-card-subtitle {
  font-size: 13px;
  color: #64748b;
}

.mobile-card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
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
