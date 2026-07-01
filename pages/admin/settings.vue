<template>
  <div class="admin-page-container">
    <AdminPageHeader title="网站设置" description="配置网站基本信息" />

    <el-card>
      <el-form :model="settingForm" :rules="rules" ref="settingFormRef" label-width="100px">
        <el-form-item label="网站名称" prop="siteName">
          <el-input v-model="settingForm.siteName" placeholder="请输入网站名称" />
        </el-form-item>

        <el-form-item label="网站标语" prop="siteSlogan">
          <el-input v-model="settingForm.siteSlogan" placeholder="请输入网站标语" />
        </el-form-item>

        <el-form-item label="网站Logo">
          <ImageCropper v-model="settingForm.siteLogo" />
        </el-form-item>

        <el-form-item label="网站Icon">
          <ImageCropper v-model="settingForm.siteIcon" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="saving">
            保存设置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ImageCropper from '~/components/ImageCropper.client.vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: '网站设置 - 后台管理'
})

const settingFormRef = ref()
const saving = ref(false)

const settingForm = reactive({
  siteName: '',
  siteSlogan: '',
  siteLogo: '',
  siteIcon: ''
})

const rules = {
  siteName: [{ required: true, message: '请输入网站名称', trigger: 'blur' }]
}

const loadSetting = async () => {
  try {
    const response = await $fetch('/api/settings')
    if (response.success && response.data) {
      Object.assign(settingForm, response.data)
    }
  } catch (error) {
    console.error('加载设置失败', error)
  }
}

const handleSave = async () => {
  try {
    await settingFormRef.value.validate()
    saving.value = true
    
    const response = await $fetch('/api/settings', {
      method: 'PUT',
      body: settingForm
    })
    
    if (response.success) {
      ElMessage.success('保存成功')
    }
  } catch (error) {
    console.error('保存失败', error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadSetting()
})
</script>