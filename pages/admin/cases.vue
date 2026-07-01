<template>
  <div class="admin-page-container">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-slate-800">案例管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon class="mr-1"><Plus /></el-icon>
        新增案例
      </el-button>
    </div>

    <el-card>
      <div class="desktop-table">
        <el-table :data="cases" style="width: 100%" stripe>
          <el-table-column label="封面" width="120">
            <template #default="{ row }">
              <img v-if="row.coverImage" :src="row.coverImage" class="w-20 h-12 object-cover rounded" />
              <span v-else class="text-slate-400">无封面</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="项目名称" min-width="200" />
          <el-table-column prop="location" label="地点" />
          <el-table-column prop="clientName" label="客户名称" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'published' ? 'success' : 'warning'">
                {{ row.status === 'published' ? '已发布' : '草稿' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right" align="center">
            <template #default="{ row }">
              <AdminActionButtons @edit="handleEdit(row)" @delete="handleDelete(row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="mobile-list">
        <div v-for="item in cases" :key="item.id" class="mobile-card">
          <div class="mobile-card-header">
            <img v-if="item.coverImage" :src="item.coverImage" class="mobile-card-image" />
            <div v-else class="mobile-card-image-placeholder">无封面</div>
            <div class="mobile-card-info">
              <h4 class="mobile-card-title">{{ item.title }}</h4>
              <p class="mobile-card-subtitle">{{ item.location || '未知地点' }}</p>
            </div>
            <el-tag :type="item.status === 'published' ? 'success' : 'warning'" size="small">
              {{ item.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </div>
          <div class="mobile-card-actions">
            <el-button size="small" @click="handleEdit(item)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(item)">删除</el-button>
          </div>
        </div>
        <el-empty v-if="cases.length === 0" description="暂无案例数据" />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑案例' : '新增案例'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="caseForm" :rules="rules" ref="caseFormRef" label-width="100px">
        <el-form-item label="项目名称" prop="title">
          <el-input v-model="caseForm.title" placeholder="请输入项目名称" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="caseForm.clientName" placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地点">
              <el-input v-model="caseForm.location" placeholder="请输入地点" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态">
          <el-select v-model="caseForm.status">
            <el-option label="发布" value="published" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图">
          <ImageCropper v-model="caseForm.coverImage" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="caseForm.description" type="textarea" :rows="2" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="caseForm.content" type="textarea" :rows="6" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

useHead({ title: '案例管理 - 后台管理' })
definePageMeta({ layout: 'admin' })

const cases = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingCase = ref(null)
const caseFormRef = ref(null)

const caseForm = reactive({
  title: '',
  description: '',
  clientName: '',
  location: '',
  status: 'published',
  coverImage: '',
  content: ''
})

const rules = {
  title: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

const fetchCases = async () => {
  try {
    const response = await $fetch('/api/cases?status=all')
    if (response?.success) {
      cases.value = response.data?.list || response.data || []
    }
  } catch (error) {
    console.error('获取案例列表失败:', error)
  }
}

const handleAdd = () => {
  isEdit.value = false
  editingCase.value = null
  Object.assign(caseForm, {
    title: '', description: '', clientName: '', location: '',
    status: 'published', coverImage: '', content: ''
  })
  dialogVisible.value = true
}

const handleEdit = (item) => {
  isEdit.value = true
  editingCase.value = item
  Object.assign(caseForm, {
    title: item.title,
    description: item.description || '',
    clientName: item.clientName || '',
    location: item.location || '',
    status: item.status,
    coverImage: item.coverImage || '',
    content: item.content
  })
  dialogVisible.value = true
}

const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm('确定要删除这个案例吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await $fetch('/api/cases/' + item.id, { method: 'DELETE' })
    ElMessage.success('删除成功!')
    await fetchCases()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除案例失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  if (!caseFormRef.value) return
  await caseFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value && editingCase.value) {
          await $fetch('/api/cases/' + editingCase.value.id, {
            method: 'PUT',
            body: { ...caseForm, authorId: 1 }
          })
        } else {
          await $fetch('/api/cases', {
            method: 'POST',
            body: { ...caseForm, authorId: 1 }
          })
        }
        ElMessage.success('保存成功!')
        dialogVisible.value = false
        await fetchCases()
      } catch (error) {
        console.error('保存案例失败:', error)
        ElMessage.error('保存失败')
      }
    }
  })
}

onMounted(() => {
  fetchCases()
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
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}
.mobile-card-image-placeholder {
  width: 60px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #9ca3af;
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
