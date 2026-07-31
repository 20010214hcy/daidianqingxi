<template>
  <div class="admin-page-container">
    <AdminPageHeader :title="isEdit ? '编辑文章' : '新增文章'" description="编辑文章内容">
      <template #actions>
        <el-button @click="goBack">返回列表</el-button>
      </template>
    </AdminPageHeader>

    <el-card v-loading="pageLoading">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="max-w-4xl">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="分类" prop="category">
              <el-select v-model="form.category" placeholder="请选择分类" class="w-full">
                <el-option label="行业动态" value="news" />
                <el-option label="公司新闻" value="company" />
                <el-option label="技术分享" value="tech" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态" class="w-full">
                <el-option label="发布" value="published" />
                <el-option label="草稿" value="draft" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布日期">
              <el-date-picker
                v-model="form.publishedAt"
                type="datetime"
                placeholder="选择发布日期"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DDTHH:mm:ss.000Z"
                class="w-full"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="封面图">
          <MediaPicker v-model="form.coverImage" />
        </el-form-item>


        <el-form-item label="内容" prop="content">
          <RichEditor v-model="form.content" :height="500" />
        </el-form-item>

        <el-form-item>
          <div class="flex gap-3">
            <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
            <el-button @click="goBack">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const router = useRouter()
const { user } = useAuth()

const articleId = route.query.id ? Number(route.query.id) : null
const isEdit = !!articleId
const pageLoading = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  title: '',
  category: 'news',
  status: 'published',
  coverImage: '',
  content: '',
  publishedAt: null as string | null,
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
}

// 加载文章数据
const loadArticle = async () => {
  if (!articleId) return
  pageLoading.value = true
  try {
    const res: any = await $fetch(`/api/articles/${articleId}`)
    if (res?.success && res.data) {
      Object.assign(form, {
        title: res.data.title || '',
        category: res.data.category || 'news',
        status: res.data.status || 'published',
        coverImage: res.data.coverImage || '',
        content: res.data.content || '',
        publishedAt: res.data.publishedAt || null,
      })
    }
  } catch (err) {
    ElMessage.error('加载文章失败')
    goBack()
  } finally {
    pageLoading.value = false
  }
}

onMounted(() => loadArticle())

const goBack = () => router.push('/admin/articles')

const handleSubmit = async () => {
  if (!formRef.value) return
  submitting.value = true

  try {
    await formRef.value.validate()
    const authorId = user.value?.id ?? 1

    const payload = {
      ...form,
      authorId,
      // 如果没选日期，不传 publishedAt，让后端用默认值
      publishedAt: form.publishedAt || undefined,
    }

    if (isEdit) {
      await $fetch(`/api/articles/${articleId}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/articles', { method: 'POST', body: payload })
    }

    ElMessage.success('保存成功')
    goBack()
  } catch (err) {
    if (err !== false) ElMessage.error('保存文章失败')
  } finally {
    submitting.value = false
  }
}
</script>
