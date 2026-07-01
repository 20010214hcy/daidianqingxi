<template>
  <div class="admin-page-container">
    <AdminPageHeader title="联系方式设置" description="配置公司的联系信息" />

    <el-card class="mb-6">
      <template #header>
        <div class="card-header">
          <span class="text-lg font-semibold">公司联系信息</span>
          <span class="text-sm text-slate-400 ml-2">修改后前台"联系我们"页面将实时更新</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        :disabled="loading"
      >
        <el-divider content-position="left">基本信息</el-divider>

        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称" maxlength="50" show-word-limit />
        </el-form-item>

        <el-form-item label="公司地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入公司地址" maxlength="200" show-word-limit />
        </el-form-item>

        <el-divider content-position="left">电话信息</el-divider>

        <el-form-item label="客服热线" prop="phone1">
          <el-input v-model="form.phone1" placeholder="如：400-888-8888" maxlength="30" />
        </el-form-item>

        <el-form-item label="业务咨询" prop="phone2">
          <el-input v-model="form.phone2" placeholder="如：010-12345678" maxlength="30" />
        </el-form-item>

        <el-divider content-position="left">邮箱信息</el-divider>

        <el-form-item label="业务邮箱" prop="email1">
          <el-input v-model="form.email1" placeholder="如：contact@example.com" maxlength="100" />
        </el-form-item>

        <el-form-item label="售后邮箱" prop="email2">
          <el-input v-model="form.email2" placeholder="如：service@example.com" maxlength="100" />
        </el-form-item>

        <el-divider content-position="left">工作时间</el-divider>

        <el-form-item label="工作日" prop="workHours1">
          <el-input v-model="form.workHours1" placeholder="如：周一至周五：9:00 - 18:00" maxlength="50" />
        </el-form-item>

        <el-form-item label="周末" prop="workHours2">
          <el-input v-model="form.workHours2" placeholder="如：周六：9:00 - 12:00" maxlength="50" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="sm" class="mb-6">
      <template #header>
        <span class="text-base font-semibold">前台预览</span>
      </template>

      <div class="preview-section">
        <h3 class="preview-title">联系方式</h3>
        <div class="preview-list">
          <div v-if="form.companyName" class="preview-item">
            <span class="preview-label">公司名称</span>
            <span class="preview-value">{{ form.companyName }}</span>
          </div>
          <div v-if="form.address" class="preview-item">
            <span class="preview-label">公司地址</span>
            <span class="preview-value">{{ form.address }}</span>
          </div>
          <div v-if="form.phone1" class="preview-item">
            <span class="preview-label">客服热线</span>
            <span class="preview-value">{{ form.phone1 }}</span>
          </div>
          <div v-if="form.phone2" class="preview-item">
            <span class="preview-label">业务咨询</span>
            <span class="preview-value">{{ form.phone2 }}</span>
          </div>
          <div v-if="form.email1" class="preview-item">
            <span class="preview-label">业务邮箱</span>
            <span class="preview-value">{{ form.email1 }}</span>
          </div>
          <div v-if="form.email2" class="preview-item">
            <span class="preview-label">售后邮箱</span>
            <span class="preview-value">{{ form.email2 }}</span>
          </div>
          <div v-if="form.workHours1" class="preview-item">
            <span class="preview-label">工作时段</span>
            <span class="preview-value">{{ form.workHours1 }}</span>
          </div>
          <div v-if="form.workHours2" class="preview-item">
            <span class="preview-label">周末时段</span>
            <span class="preview-value">{{ form.workHours2 }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <div class="text-center">
      <el-button type="primary" size="large" @click="handleSave" :loading="saving">
        保存信息
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: '联系方式设置 - 后台管理'
})

const formRef = ref<FormInstance>()
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  companyName: '',
  address: '',
  phone1: '',
  phone2: '',
  email1: '',
  email2: '',
  workHours1: '',
  workHours2: '',
})

const rules: FormRules = {
  companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入公司地址', trigger: 'blur' }],
  phone1: [{ required: true, message: '请输入客服热线', trigger: 'blur' }],
  email1: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  email2: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
}

const loadContact = async () => {
  try {
    const res = await $fetch('/api/contact')
    if (res.success && res.data) {
      Object.assign(form, res.data)
    }
  } catch (error) {
    console.error('加载联系信息失败', error)
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    ElMessage.warning('请检查表单信息是否完整')
    return
  }

  if (form.email1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email1)) {
    ElMessage.warning('业务邮箱格式不正确')
    return
  }
  if (form.email2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email2)) {
    ElMessage.warning('售后邮箱格式不正确')
    return
  }

  try {
    saving.value = true
    const res = await $fetch('/api/contact', {
      method: 'PUT',
      body: form,
    })

    if (res.success) {
      ElMessage.success('联系信息保存成功，前台页面已同步更新')
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch (error) {
    console.error('保存失败', error)
    ElMessage.error('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadContact()
})
</script>

<style scoped>
.preview-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px 24px;
}
.preview-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}
.preview-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.preview-item {
  display: flex;
  gap: 12px;
  align-items: baseline;
}
.preview-label {
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
  flex-shrink: 0;
  width: 64px;
}
.preview-value {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
}
</style>