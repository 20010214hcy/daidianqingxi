<template>
  <div class="admin-page-container">
    <AdminPageHeader title="产品管理" description="管理公司的产品信息">
      <template #actions>
        <el-button type="primary" @click="handleAdd">
          <el-icon class="mr-1"><Plus /></el-icon>
          新增产品
        </el-button>
      </template>
    </AdminPageHeader>

    <!-- 搜索和筛选 -->
    <el-card class="mb-4">
      <div class="flex flex-wrap items-center gap-4">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索产品名称"
          class="w-60"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="filterCategoryId"
          placeholder="筛选分类"
          class="w-40"
          clearable
          @change="fetchProducts"
        >
          <el-option label="全部分类" :value="null" />
          <el-option
            v-for="cat in categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
        <el-select
          v-model="filterStatus"
          placeholder="筛选状态"
          class="w-32"
          @change="fetchProducts"
        >
          <el-option label="全部" value="all" />
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
        </el-select>
        <div class="ml-auto flex items-center gap-2">
          <span class="text-sm text-slate-500">前台价格显示</span>
          <el-switch
            v-model="priceVisible"
            :loading="priceSwitching"
            size="small"
            active-color="#22c55e"
            inactive-color="#ef4444"
            @change="handlePriceToggle"
          />
        </div>
      </div>
    </el-card>

    <!-- 产品列表 -->
    <el-card class="shadow-sm">
      <AdminMobileList :empty="products.length === 0">
        <!-- 桌面端表格 -->
        <el-table :data="products" stripe style="width: 100%">
          <el-table-column label="图片" width="80">
            <template #default="{ row }">
              <img
                v-if="row.image"
                :src="row.image"
                class="w-12 h-12 rounded object-cover"
              />
              <div v-else class="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-400 text-xs">无图</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="产品名称" min-width="180" />
          <el-table-column label="分类" width="120">
            <template #default="{ row }">
              <el-tag size="small" type="info">{{ row.productcategory?.name || '-' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="价格" width="120">
            <template #default="{ row }">
              <span class="text-red-600 font-medium">{{ formatPrice(row.price) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'published' ? 'success' : 'warning'" size="small">
                {{ row.status === 'published' ? '已发布' : '草稿' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sortOrder" label="排序" width="80" />
          <el-table-column prop="createdAt" label="创建时间" width="160">
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
            v-for="product in products"
            :key="product.id"
            :title="product.name"
            :subtitle="product.productcategory?.name || '未分类'"
            :image="product.image"
            :status="product.status === 'published' ? '已发布' : '草稿'"
            :status-type="product.status === 'published' ? 'success' : 'warning'"
            :tags="[
              { label: '价格', value: formatPrice(product.price) },
              { label: '排序', value: product.sortOrder },
              { label: '创建时间', value: formatDate(product.createdAt) }
            ]"
          >
            <template #actions>
              <el-button size="small" @click="handleEdit(product)">
                <el-icon class="mr-1"><Edit /></el-icon>
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(product)">
                <el-icon class="mr-1"><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </AdminMobileCard>
        </template>
      </AdminMobileList>

      <!-- 分页 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="fetchProducts"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑产品' : '新增产品'"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form :model="productForm" :rules="rules" ref="productFormRef" label-width="100px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入产品名称" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类" prop="categoryId">
              <el-select v-model="productForm.categoryId" placeholder="请选择分类" class="w-full">
                <el-option
                  v-for="cat in categories"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number
                v-model="productForm.price"
                :min="0"
                :precision="2"
                class="w-full"
                placeholder="0表示面议"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="productForm.status" placeholder="请选择状态" class="w-full">
                <el-option label="发布" value="published" />
                <el-option label="草稿" value="draft" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number
                v-model="productForm.sortOrder"
                :min="0"
                class="w-full"
                placeholder="数字越小越靠前"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="产品图片">
          <ImageCropper v-model="productForm.image" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="productForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入产品描述"
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
import { ref, computed, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

interface Product {
  id: number
  name: string
  categoryId: number | null
  productcategory?: { id: number; name: string }
  price: number
  status: string
  sortOrder: number
  image?: string
  description?: string
  createdAt: string
}

interface Category {
  id: number
  name: string
}

interface ProductResponse {
  list: Product[]
  pagination: {
    total: number
  }
}

definePageMeta({
  layout: 'admin'
})

const { formatDate } = useFormatDate()
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingProduct = ref<Product | null>(null)
const productFormRef = ref<FormInstance>()
const submitting = ref(false)
const searchKeyword = ref('')
const filterCategoryId = ref<number | null>(null)
const filterStatus = ref('all')
const page = ref(1)
const pageSize = ref(10)
const priceVisible = ref(true)
const priceSwitching = ref(false)

let searchTimer: ReturnType<typeof setTimeout> | null = null

const productForm = reactive({
  name: '',
  categoryId: null as number | null,
  price: 0,
  status: 'published',
  sortOrder: 0,
  image: '',
  description: ''
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const res: any = await $fetch('/api/categories')
    categories.value = res?.success ? (res.data || []) : []
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

// 获取产品列表
const fetchProducts = async () => {
  loading.value = true
  try {
    const params: Record<string, string | number> = {
      page: page.value,
      pageSize: pageSize.value,
      status: filterStatus.value,
    }
    if (filterCategoryId.value) {
      params.categoryId = filterCategoryId.value
    }
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }

    const res: any = await $fetch('/api/products', { params })
    if (res?.success) {
      products.value = res.data.list || res.data || []
      total.value = res.data.pagination?.total || 0
    }
  } catch (error) {
    console.error('获取产品列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchProducts(), fetchPriceVisibility()])
})

const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    fetchProducts()
  }, 300)
}

const handleAdd = () => {
  isEdit.value = false
  editingProduct.value = null
  Object.assign(productForm, {
    name: '',
    categoryId: null,
    price: 0,
    status: 'published',
    sortOrder: 0,
    image: '',
    description: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: Product) => {
  isEdit.value = true
  editingProduct.value = row
  Object.assign(productForm, {
    name: row.name,
    categoryId: row.categoryId,
    price: Number(row.price),
    status: row.status,
    sortOrder: row.sortOrder,
    image: row.image || '',
    description: row.description || ''
  })
  dialogVisible.value = true
}

const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm('确定要删除该产品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await $fetch(`/api/products/${row.id}`, { method: 'DELETE' })

    if (row.image) {
      try {
        await $fetch('/api/upload', {
          method: 'DELETE',
          body: { url: row.image }
        })
      } catch (e) {
        console.error('删除图片失败:', e)
      }
    }

    ElMessage.success('删除成功')
    await fetchProducts()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除产品失败:', error)
      ElMessage.error('删除产品失败')
    }
  }
}

const handleSubmit = async () => {
  if (!productFormRef.value) return

  try {
    await productFormRef.value.validate()
    submitting.value = true

    const payload = {
      name: productForm.name,
      categoryId: productForm.categoryId,
      price: productForm.price,
      status: productForm.status,
      sortOrder: productForm.sortOrder,
      image: productForm.image,
      description: productForm.description
    }

    if (isEdit.value && editingProduct.value) {
      await $fetch(`/api/products/${editingProduct.value.id}`, {
        method: 'PUT',
        body: payload
      })

      if (
        editingProduct.value.image &&
        editingProduct.value.image !== productForm.image
      ) {
        try {
          await $fetch('/api/upload', {
            method: 'DELETE',
            body: { url: editingProduct.value.image }
          })
        } catch (e) {
          console.error('删除旧图片失败:', e)
        }
      }
    } else {
      await $fetch('/api/products', {
        method: 'POST',
        body: payload
      })
    }

    dialogVisible.value = false
    ElMessage.success('保存成功')
    await fetchProducts()
  } catch (error) {
    if (error !== false) {
      console.error('保存产品失败:', error)
      ElMessage.error('保存产品失败')
    }
  } finally {
    submitting.value = false
  }
}

const formatPrice = (price: number | string) => {
  const num = Number(price)
  if (isNaN(num) || num === 0) return '面议'
  return `¥${num.toFixed(2)}`
}

const handlePriceToggle = async (val: boolean) => {
  try {
    priceSwitching.value = true
    await $fetch('/api/price-visibility', {
      method: 'PUT',
      body: { visible: val, operatorName: '管理员' }
    })
    ElMessage.success(val ? '前台价格已显示' : '前台价格已隐藏')
  } catch (error) {
    priceVisible.value = !val
    ElMessage.error('状态切换失败')
  } finally {
    priceSwitching.value = false
  }
}

// 获取价格显示状态
const fetchPriceVisibility = async () => {
  try {
    const res: any = await $fetch('/api/price-visibility')
    if (res?.success && res.data) {
      priceVisible.value = res.data.visible
    }
  } catch (error) {
    console.error('获取价格显示状态失败', error)
  }
}
</script>