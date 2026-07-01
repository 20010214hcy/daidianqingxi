<template>
  <div class="admin-page-container">
    <AdminPageHeader title="分类管理" description="管理产品分类">
      <template #actions>
        <el-button type="primary" @click="handleAdd">
          <el-icon class="mr-1"><Plus /></el-icon>
          新增分类
        </el-button>
      </template>
    </AdminPageHeader>

    <el-card>
      <el-table :data="categories" stripe style="width: 100%">
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column label="产品数量" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row._count?.product || 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="100" align="center" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <AdminActionButtons @edit="handleEdit(row)" @delete="handleDelete(row)" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '新增分类'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="categoryForm" :rules="rules" ref="categoryFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="categoryForm.sortOrder"
            :min="0"
            placeholder="数字越小越靠前"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/format'
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

interface Category {
  id: number
  name: string
  sortOrder: number
  createdAt: string
  _count?: { product: number }
}

definePageMeta({
  layout: 'admin'
})

const { formatDate } = useFormatDate()
const categories = ref<Category[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingCategory = ref<Category | null>(null)
const categoryFormRef = ref<FormInstance>()
const submitting = ref(false)

const categoryForm = reactive({
  name: '',
  sortOrder: 0
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

// 获取分类列表
const fetchCategories = async () => {
  loading.value = true
  try {
    const response: any = await $fetch('/api/categories')
    categories.value = response?.success ? (response.data || []) : []
  } catch (error) {
    console.error('获取分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})

const handleAdd = () => {
  isEdit.value = false
  editingCategory.value = null
  Object.assign(categoryForm, {
    name: '',
    sortOrder: 0
  })
  dialogVisible.value = true
}

const handleEdit = (row: Category) => {
  isEdit.value = true
  editingCategory.value = row
  Object.assign(categoryForm, {
    name: row.name,
    sortOrder: row.sortOrder
  })
  dialogVisible.value = true
}

const handleDelete = async (row: Category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${row.name}"吗？${row._count?.product ? `该分类下有 ${row._count.product} 个产品，无法删除。` : ''}`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonDisabled: row._count?.product > 0
      }
    )

    await $fetch(`/api/categories/${row.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    await fetchCategories()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除分类失败:', error)
      ElMessage.error('删除分类失败')
    }
  }
}

const handleSubmit = async () => {
  if (!categoryFormRef.value) return

  try {
    await categoryFormRef.value.validate()
    submitting.value = true

    if (isEdit.value && editingCategory.value) {
      await $fetch(`/api/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: categoryForm
      })
    } else {
      await $fetch('/api/categories', {
        method: 'POST',
        body: categoryForm
      })
    }

    dialogVisible.value = false
    ElMessage.success('保存成功')
    await fetchCategories()
  } catch (error) {
    if (error !== false) {
      console.error('保存分类失败:', error)
      ElMessage.error('保存分类失败')
    }
  } finally {
    submitting.value = false
  }
}
</script>