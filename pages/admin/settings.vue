<template>
  <div class="admin-page-container">
    <AdminPageHeader title="网站设置" description="配置网站基本信息和邮件服务" />

    <!-- 基本信息 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
        </div>
      </template>
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

    <!-- 邮件配置 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>邮件配置</span>
          <el-tag :type="emailForm.enableEmailReply ? 'success' : 'info'" size="small">
            {{ emailForm.enableEmailReply ? '已启用' : '未启用' }}
          </el-tag>
        </div>
      </template>

      <el-form :model="emailForm" label-width="120px">
        <el-form-item label="启用邮件回复">
          <el-switch v-model="emailForm.enableEmailReply" />
          <span class="ml-3 text-sm text-gray-500">开启后可直接回复留言到用户邮箱</span>
        </el-form-item>

        <template v-if="emailForm.enableEmailReply">
          <el-divider>SMTP配置</el-divider>

          <el-form-item label="SMTP服务器">
            <el-input v-model="emailForm.smtpHost" placeholder="smtp.qq.com" />
            <div class="form-tip">QQ邮箱: smtp.qq.com | 163邮箱: smtp.163.com</div>
          </el-form-item>

          <el-form-item label="SMTP端口">
            <el-input-number v-model="emailForm.smtpPort" :min="1" :max="65535" />
            <div class="form-tip">SSL端口通常为465，非SSL端口为587</div>
          </el-form-item>

          <el-form-item label="邮箱账号">
            <el-input v-model="emailForm.smtpUser" placeholder="your-email@qq.com" />
          </el-form-item>

          <el-form-item label="邮箱密码/授权码">
            <el-input v-model="emailForm.smtpPass" type="password" placeholder="QQ邮箱需要填写授权码" show-password />
            <div class="form-tip">
              <el-link type="primary" href="https://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256" target="_blank">
                如何获取QQ邮箱授权码？
              </el-link>
            </div>
          </el-form-item>

          <el-form-item label="发件人邮箱">
            <el-input v-model="emailForm.smtpFrom" placeholder="留空则使用邮箱账号" />
            <div class="form-tip">显示为发件人的邮箱地址，通常与邮箱账号相同</div>
          </el-form-item>

          <el-form-item label="测试邮箱">
            <el-input v-model="testEmailAddress" placeholder="输入邮箱地址测试配置" />
            <el-button class="ml-2" @click="handleTestEmail" :loading="testing">
              发送测试邮件
            </el-button>
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" @click="handleSaveEmail" :loading="savingEmail">
            保存邮件配置
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
const savingEmail = ref(false)
const testing = ref(false)
const testEmailAddress = ref('')

const settingForm = reactive({
  siteName: '',
  siteSlogan: '',
  siteLogo: '',
  siteIcon: ''
})

const emailForm = reactive({
  enableEmailReply: false,
  smtpHost: 'smtp.qq.com',
  smtpPort: 465,
  smtpUser: '',
  smtpPass: '',
  smtpFrom: ''
})

const rules = {
  siteName: [{ required: true, message: '请输入网站名称', trigger: 'blur' }]
}

// 加载设置
const loadSetting = async () => {
  try {
    const response = await $fetch('/api/settings')
    if (response.success && response.data) {
      Object.assign(settingForm, response.data)
      // 加载邮件配置
      if (response.data.smtpHost !== undefined) {
        Object.assign(emailForm, {
          enableEmailReply: response.data.enableEmailReply || false,
          smtpHost: response.data.smtpHost || 'smtp.qq.com',
          smtpPort: response.data.smtpPort || 465,
          smtpUser: response.data.smtpUser || '',
          smtpPass: response.data.smtpPass || '',
          smtpFrom: response.data.smtpFrom || ''
        })
      }
    }
  } catch (error) {
    console.error('加载设置失败', error)
  }
}

// 保存基本设置
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

// 保存邮件配置
const handleSaveEmail = async () => {
  if (emailForm.enableEmailReply) {
    if (!emailForm.smtpHost || !emailForm.smtpUser || !emailForm.smtpPass) {
      ElMessage.warning('请填写完整的SMTP配置')
      return
    }
  }

  savingEmail.value = true
  try {
    const response = await $fetch('/api/settings', {
      method: 'PUT',
      body: emailForm
    })

    if (response.success) {
      ElMessage.success('邮件配置保存成功')
      // 清除邮件配置缓存
      await $fetch('/api/email/clear-cache', { method: 'POST' })
    }
  } catch (error) {
    console.error('保存失败', error)
    ElMessage.error('保存失败')
  } finally {
    savingEmail.value = false
  }
}

// 发送测试邮件
const handleTestEmail = async () => {
  if (!testEmailAddress.value) {
    ElMessage.warning('请输入测试邮箱地址')
    return
  }

  // 先保存配置
  await handleSaveEmail()

  testing.value = true
  try {
    const response = await $fetch('/api/email/test', {
      method: 'POST',
      body: { to: testEmailAddress.value }
    })

    if (response.success) {
      ElMessage.success('测试邮件发送成功，请检查邮箱')
    } else {
      ElMessage.error(response.message || '发送失败')
    }
  } catch (error: any) {
    ElMessage.error(error.data?.message || '发送失败')
  } finally {
    testing.value = false
  }
}

onMounted(() => {
  loadSetting()
})
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-tip {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

:deep(.el-divider__text) {
  font-size: 13px;
  color: #64748b;
}
</style>
