<template>
  <div class="admin-page-container">
    <AdminPageHeader title="文章管理" description="管理网站的文章和新闻资讯">
      <template #actions>
        <el-button type="primary" @click="goToEdit()">
          <el-icon class="mr-1"><Plus /></el-icon>
          新增文章
        </el-button>
      </template>
    </AdminPageHeader>

    <!-- 搜索筛选栏 -->
    <el-card class="mb-4">
      <div class="flex flex-wrap gap-4 items-center">
        <el-input
          v-model="searchQuery"
          placeholder="搜索文章标题..."
          clearable
          class="w-64"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterCategory" placeholder="文章分类" clearable class="w-32" @change="handleSearch">
          <el-option label="行业动态" value="news" />
          <el-option label="公司新闻" value="company" />
          <el-option label="技术分享" value="tech" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable class="w-28" @change="handleSearch">
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
        </el-select>
        <el-button @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </el-card>

    <el-card>
      <AdminMobileList v-loading="loading" :empty="!loading && articles.length === 0">
        <el-table :data="articles" stripe style="width: 100%">
          <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
          <el-table-column prop="category" label="分类" width="120">
            <template #default="{ row }">
              {{ getCategoryLabel(row.category) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'published' ? 'success' : 'warning'">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="viewCount" label="浏览" width="80" align="center" />
          <el-table-column prop="createdAt" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right" align="center">
            <template #default="{ row }">
              <AdminActionButtons @edit="goToEdit(row)" @delete="handleDelete(row)" />
            </template>
          </el-table-column>
        </el-table>

        <template #mobile>
          <AdminMobileCard
            v-for="article in articles"
            :key="article.id"
            :title="article.title"
            :subtitle="getCategoryLabel(article.category)"
            :image="article.coverImage"
            :status="getStatusLabel(article.status)"
            :status-type="article.status === 'published' ? 'success' : 'warning'"
            :tags="[
              { label: '分类', value: getCategoryLabel(article.category) },
              { label: '浏览', value: article.viewCount },
              { label: '创建时间', value: formatDate(article.createdAt) }
            ]"
          >
            <template #actions>
              <el-button size="small" @click="goToEdit(article)">
                <el-icon class="mr-1"><Edit /></el-icon>
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(article)">
                <el-icon class="mr-1"><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </AdminMobileCard>
        </template>
      </AdminMobileList>

      <div v-if="total > 0" class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

interface Article {
  id: number
  title: string
  category: string
  status: string
  summary: string
  coverImage: string
  content: string
  viewCount: number
  createdAt: string
}

definePageMeta({ layout: 'admin' })

const router = useRouter()
const { formatDate } = useFormatDate()

const articles = ref<Article[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')

const fetchArticles = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: String(currentPage.value),
      pageSize: String(pageSize.value),
      status: filterStatus.value || 'all',
    })
    if (searchQuery.value) params.append('keyword', searchQuery.value)
    if (filterCategory.value) params.append('category', filterCategory.value)

    const response: any = await $fetch(`/api/articles?${params}`)
    if (response?.success) {
      articles.value = response.data.list || []
      total.value = response.data.pagination?.total || 0
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchArticles())

const handleSearch = () => { currentPage.value = 1; fetchArticles() }
const resetSearch = () => { searchQuery.value = ''; filterCategory.value = ''; filterStatus.value = ''; handleSearch() }
const handleSizeChange = (val: number) => { pageSize.value = val; currentPage.value = 1; fetchArticles() }
const handleCurrentChange = (val: number) => { currentPage.value = val; fetchArticles() }

// 跳转编辑页
const goToEdit = (row?: Article) => {
  if (row) {
    router.push(`/admin/articles/edit?id=${row.id}`)
  } else {
    router.push('/admin/articles/edit')
  }
}

// 删除
const handleDelete = async (row: Article) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning',
    })
    await $fetch(`/api/articles/${row.id}`, { method: 'DELETE' })
    if (row.coverImage) {
      try { await $fetch('/api/upload', { method: 'DELETE', body: { url: row.coverImage } }) } catch {}
    }
    ElMessage.success('删除成功')
    await fetchArticles()
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('删除文章失败')
  }
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = { news: '行业动态', company: '公司新闻', tech: '技术分享' }
  return labels[category] || category
}

const getStatusLabel = (status: string) => status === 'published' ? '已发布' : '草稿'
</script>
