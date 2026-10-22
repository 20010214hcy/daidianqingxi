<template>
  <div class="admin-page-container">
    <AdminPageHeader title="分类管理" description="管理产品分类，支持按业务板块筛选">
      <template #actions>
        <el-button type="primary" @click="handleAdd">
          <el-icon class="mr-1"><Plus /></el-icon>
          新增分类
        </el-button>
      </template>
    </AdminPageHeader>

    <!-- 业务板块筛选 -->
    <el-card class="mb-4">
      <div class="flex flex-wrap items-center gap-4">
        <el-select
          v-model="filterBusinessUnit"
          placeholder="筛选业务板块"
          class="w-48"
          clearable
          @change="fetchCategories"
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
          共 {{ categories.length }} 个分类
        </span>
      </div>
    </el-card>

    <el-card>
      <AdminMobileList :empty="categories.length === 0">
        <!-- 桌面端表格 -->
        <el-table :data="categories" stripe style="width: 100%">
          <el-table-column prop="name" label="分类名称" min-width="180" />
          <el-table-column label="所属板块" width="150">
            <template #default="{ row }">
              <el-tag v-if="row.businessunit" size="small" type="primary">
                {{ row.businessunit.name }}
              </el-tag>
              <span v-else class="text-slate-400 text-sm">未分配</span>
            </template>
          </el-table-column>
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

        <!-- 移动端卡片列表 -->
        <template #mobile>
          <AdminMobileCard
            v-for="item in categories"
            :key="item.id"
            :title="item.name"
            :subtitle="`${item.businessunit?.name || '未分配板块'} · ${item._count?.product || 0} 个产品`"
            :tags="[
              { label: '排序', value: item.sortOrder },
              { label: '创建时间', value: formatDate(item.createdAt) }
            ]"
          >
            <template #actions>
              <el-button size="small" @click="handleEdit(item)">
                <el-icon class="mr-1"><Edit /></el-icon>
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(item)">
                <el-icon class="mr-1"><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </AdminMobileCard>
        </template>

        <template #empty>
          <el-empty description="暂无分类数据" :image-size="80" />
        </template>
      </AdminMobileList>
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
        <el-form-item label="所属板块">
          <el-select v-model="categoryForm.businessUnitId" placeholder="请选择业务板块" class="w-full" clearable>
            <el-option label="不指定" :value="null" />
            <el-option
              v-for="unit in businessUnits"
              :key="unit.id"
              :label="unit.name"
              :value="unit.id"
            />
          </el-select>
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
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

interface Category {
  id: number
  name: string
  sortOrder: number
  createdAt: string
  businessUnitId?: number | null
  businessunit?: { id: number; name: string; slug: string } | null
  _count?: { product: number }
}

interface BusinessUnit {
  id: number
  name: string
  slug: string
}

definePageMeta({
  layout: 'admin'
})

const { formatDate } = useFormatDate()
const categories = ref<Category[]>([])
const businessUnits = ref<BusinessUnit[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingCategory = ref<Category | null>(null)
const categoryFormRef = ref<FormInstance>()
const submitting = ref(false)
const filterBusinessUnit = ref<number | null>(null)

const categoryForm = reactive({
  name: '',
  sortOrder: 0,
  businessUnitId: null as number | null
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

const fetchBusinessUnits = async () => {
  try {
    const res: any = await $fetch('/api/business-units')
    businessUnits.value = res?.success ? (res.data || []) : []
  } catch (error) {
    console.error('获取业务板块列表失败:', error)
  }
}

const fetchCategories = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {}
    if (filterBusinessUnit.value) {
      const unit = businessUnits.value.find(u => u.id === filterBusinessUnit.value)
      if (unit) params.businessUnit = unit.slug
    }
    const response: any = await $fetch('/api/categories', { params })
    categories.value = response?.success ? (response.data || []) : []
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error(apiErrorMessage(error, '加载分类列表失败'))
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchBusinessUnits()
  await fetchCategories()
})

const handleAdd = () => {
  isEdit.value = false
  editingCategory.value = null
  Object.assign(categoryForm, {
    name: '',
    sortOrder: 0,
    businessUnitId: null
  })
  dialogVisible.value = true
}

const handleEdit = (row: Category) => {
  isEdit.value = true
  editingCategory.value = row
  Object.assign(categoryForm, {
    name: row.name,
    sortOrder: row.sortOrder,
    businessUnitId: row.businessUnitId || null
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
      ElMessage.error(apiErrorMessage(error, '删除分类失败'))
    }
  }
}

const handleSubmit = async () => {
  if (!categoryFormRef.value) return

  try {
    await categoryFormRef.value.validate()
    submitting.value = true

    const payload = {
      name: categoryForm.name,
      sortOrder: categoryForm.sortOrder,
      businessUnitId: categoryForm.businessUnitId
    }

    if (isEdit.value && editingCategory.value) {
      await $fetch(`/api/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/categories', {
        method: 'POST',
        body: payload
      })
    }

    dialogVisible.value = false
    ElMessage.success('保存成功')
    await fetchCategories()
  } catch (error) {
    if (error !== false) {
      console.error('保存分类失败:', error)
      ElMessage.error(apiErrorMessage(error, '保存分类失败'))
    }
  } finally {
    submitting.value = false
  }
}
</script>

