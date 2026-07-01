<template>
  <div class="admin-page-container">
    <AdminPageHeader title="资质证书管理" description="管理公司的资质证书">
      <template #actions>
        <el-button type="primary" @click="handleAdd">
          <el-icon class="mr-1"><Plus /></el-icon>
          新增证书
        </el-button>
      </template>
    </AdminPageHeader>

    <el-card>
      <AdminMobileList :empty="!loading && certificates.length === 0" v-loading="loading">
        <!-- 桌面端表格 -->
        <el-table :data="certificates" stripe style="width: 100%">
          <el-table-column label="证书图片" width="120" align="center">
            <template #default="{ row }">
              <img v-if="row.image" :src="row.image" class="w-16 h-20 object-cover rounded border" />
              <span v-else class="text-slate-400">无图片</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="证书名称" min-width="200" />
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
            v-for="cert in certificates"
            :key="cert.id"
            :title="cert.title"
            :subtitle="'证书编号: ' + cert.id"
            :image="cert.image"
            status="已上传"
            status-type="success"
            :tags="[
              { label: '排序', value: cert.sortOrder },
              { label: '上传时间', value: formatDate(cert.createdAt) }
            ]"
          >
            <template #actions>
              <el-button size="small" @click="handleEdit(cert)">
                <el-icon class="mr-1"><Edit /></el-icon>
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(cert)">
                <el-icon class="mr-1"><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </AdminMobileCard>
        </template>
      </AdminMobileList>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑证书' : '新增证书'"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form :model="certForm" :rules="rules" ref="certFormRef" label-width="100px">
        <el-form-item label="证书名称" prop="title">
          <el-input v-model="certForm.title" placeholder="请输入证书名称" />
        </el-form-item>
        <el-form-item label="证书图片" prop="image">
          <ImageCropper v-model="certForm.image" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="certForm.sortOrder"
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

interface Certificate {
  id: number
  title: string
  image: string
  sortOrder: number
  createdAt: string
}

definePageMeta({
  layout: 'admin'
})

useHead({
  title: '资质证书管理 - 后台管理'
})

const { formatDate } = useFormatDate()
const certificates = ref<Certificate[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingCert = ref<Certificate | null>(null)
const submitting = ref(false)
const certFormRef = ref<FormInstance>()

const certForm = reactive({
  title: '',
  image: '',
  sortOrder: 0
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入证书名称', trigger: 'blur' }],
  image: [{ required: true, message: '请输入图片URL或上传图片', trigger: 'blur' }],
}

// 获取证书列表
const fetchCertificates = async () => {
  loading.value = true
  try {
    const res: any = await $fetch('/api/certificates')
    certificates.value = res?.success ? (res.data || []) : []
  } catch (error) {
    console.error('获取证书列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCertificates()
})

const resetForm = () => {
  certForm.title = ''
  certForm.image = ''
  certForm.sortOrder = 0
  certFormRef.value?.resetFields()
}

const handleAdd = () => {
  isEdit.value = false
  editingCert.value = null
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row: Certificate) => {
  isEdit.value = true
  editingCert.value = row
  certForm.title = row.title
  certForm.image = row.image
  certForm.sortOrder = row.sortOrder
  dialogVisible.value = true
}

const handleDelete = async (row: Certificate) => {
  try {
    await ElMessageBox.confirm(`确定要删除证书"${row.title}"吗？`, '确认删除', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    const res: any = await $fetch(`/api/certificates/${row.id}`, { method: 'DELETE' })
    if (res?.success) {
      ElMessage.success('删除成功')
      await fetchCertificates()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  const valid = await certFormRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    if (isEdit.value && editingCert.value) {
      const res: any = await $fetch(`/api/certificates/${editingCert.value.id}`, {
        method: 'PUT',
        body: { ...certForm }
      })
      if (res?.success) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        await fetchCertificates()
      }
    } else {
      const res: any = await $fetch('/api/certificates', {
        method: 'POST',
        body: { ...certForm }
      })
      if (res?.success) {
        ElMessage.success('添加成功')
        dialogVisible.value = false
        await fetchCertificates()
      }
    }
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
</style>
